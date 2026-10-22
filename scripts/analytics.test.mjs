import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

function compile(path, globals) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8').replace(
    'import.meta.dev',
    'true',
  )
  const exports = {}
  vm.runInNewContext(
    ts.transpile(source, {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    }),
    { exports, ...globals },
  )
  return exports
}

function browser() {
  const scripts = []
  const deleted = []
  const document = {
    getElementById: (id) => scripts.find((script) => script.id === id),
    createElement: () => ({}),
    head: { appendChild: (script) => scripts.push(script) },
    get cookie() {
      return '_ga=123; _ga_LM6FZLK9NE=456; agc-analytics-consent-v1=rejected'
    },
    set cookie(value) {
      deleted.push(value)
    },
  }
  const window = { location: { hostname: 'www.amstelgospel.nl' } }
  return { scripts, deleted, document, window }
}

test('Google remains unloaded until enabled; consent precedes config and script loads once', () => {
  const context = browser()
  const api = compile('../app/utils/googleAnalytics.ts', context)
  assert.equal(context.scripts.length, 0)
  api.enableGoogleAnalytics()
  api.enableGoogleAnalytics()
  assert.equal(context.scripts.length, 1)
  assert.equal(
    context.scripts[0].src,
    'https://www.googletagmanager.com/gtag/js?id=G-LM6FZLK9NE',
  )
  const commands = context.window.dataLayer.map((args) => Array.from(args))
  assert.equal(commands[0][0], 'consent')
  assert.equal(commands[0][2].analytics_storage, 'denied')
  assert.equal(commands[0][2].ad_storage, 'denied')
  assert.equal(commands[0][2].ad_user_data, 'denied')
  assert.equal(commands[0][2].ad_personalization, 'denied')
  assert.equal(commands[1][2].analytics_storage, 'granted')
  assert.equal(commands[3][0], 'config')
  assert.equal(commands[3][2].allow_google_signals, false)
  assert.equal(commands[3][2].allow_ad_personalization_signals, false)
})

test('withdrawal disables collection and deletes only Analytics cookies across host domains', () => {
  const context = browser()
  compile('../app/utils/googleAnalytics.ts', context).disableGoogleAnalytics()
  assert.equal(context.window['ga-disable-G-LM6FZLK9NE'], true)
  assert.ok(
    context.deleted.some(
      (cookie) =>
        cookie.startsWith('_ga=;') && cookie.includes('Domain=amstelgospel.nl'),
    ),
  )
  assert.ok(
    context.deleted.some((cookie) => cookie.startsWith('_ga_LM6FZLK9NE=;')),
  )
  assert.ok(
    context.deleted.every((cookie) => !cookie.startsWith('agc-analytics')),
  )
})

test('reject never loads Google; withdrawal persists the preference before reload', async () => {
  const consent = { value: null }
  const calls = []
  const api = compile('../app/composables/useAnalyticsConsent.ts', {
    useCookie: () => consent,
    useState: () => ({ value: true }),
    enableGoogleAnalytics: () => calls.push('enable'),
    disableGoogleAnalytics: () => calls.push('disable'),
    nextTick: async () => {
      calls.push(`persist:${consent.value}`)
    },
    window: { location: { reload: () => calls.push('reload') } },
  }).useAnalyticsConsent()
  await api.choose(false)
  assert.equal(consent.value, 'rejected')
  assert.deepEqual(calls, [])
  await api.choose(true)
  assert.equal(consent.value, 'accepted')
  await api.choose(false)
  assert.deepEqual(calls, ['enable', 'disable', 'persist:rejected', 'reload'])
})
