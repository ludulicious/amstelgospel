import test from 'node:test'
import assert from 'node:assert/strict'
import ts from 'typescript'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { z } from 'zod'

function compile(path, globals) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8')
  const js = ts.transpile(source, {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  })
  const exports = {}
  vm.runInNewContext(js, { exports, ...globals })
  return exports
}
const shared = compile('../shared/contact.ts', { require: () => ({ z }) })
const valid = {
  purpose: 'booking',
  name: 'Visitor',
  email: 'visitor@example.com',
  phone: '',
  choirExperience: 'yes',
  voicePart: 'Alt',
  ageGroup: '31-40',
  subject: 'Aanvraag',
  message: 'Een bericht voor het koor.',
  consent: true,
  turnstileToken: 'token',
}
const config = {
  resendApiKey: 'key',
  resendFromEmail: 'sender@example.com',
  turnstileSecretKey: 'secret',
  turnstileHostnames: 'amstelgospel.nl',
  ...Object.fromEntries(
    ['Booking', 'Join', 'Donate'].flatMap((p) => [
      ['contact' + p + 'To', p.toLowerCase() + '@example.com'],
      ['contact' + p + 'Cc', p.toLowerCase() + '-cc@example.com'],
    ]),
  ),
}
function endpoint(
  overrides = {},
  success = true,
  verification = {},
  production = false,
) {
  const calls = []
  let currentPurpose = 'booking'
  const handler = compile('../server/api/contact.post.ts', {
    process: { env: { NODE_ENV: production ? 'production' : 'development' } },
    URLSearchParams,
    require: (name) => (name === 'zod' ? { z } : shared),
    defineEventHandler: (fn) => fn,
    getRequestIP: () => '127.0.0.1',
    readBody: async (event) => {
      currentPurpose = event.purpose
      return event
    },
    useRuntimeConfig: () => ({ ...config, ...overrides }),
    createError: (value) =>
      Object.assign(new Error(value.statusMessage), value),
    $fetch: async (url, options) => {
      calls.push({ url, options })
      return {
        success,
        action:
          options.body?.purpose ||
          (url.includes('siteverify') ? currentPurpose : undefined),
        hostname: 'amstelgospel.nl',
        ...verification,
        id: 'email-id',
      }
    },
  }).default
  return { handler, calls }
}
test('each purpose uses its server-configured recipient and CC with visitor reply-to', async () => {
  for (const purpose of ['booking', 'join', 'donate']) {
    const { handler, calls } = endpoint()
    await handler({ ...valid, purpose, to: 'attacker@example.com' })
    assert.equal(calls.length, 2)
    const mail = calls[1].options.body
    assert.equal(mail.to[0], purpose + '@example.com')
    assert.equal(mail.cc[0], purpose + '-cc@example.com')
    assert.equal(mail.reply_to, valid.email)
  }
})
test('invalid input, missing consent, spam and failed CAPTCHA never send email', async () => {
  for (const patch of [
    { consent: false },
    { purpose: 'unknown' },
    { honeypot: 'spam' },
    { message: 'short' },
    { turnstileToken: '' },
  ]) {
    const { handler, calls } = endpoint()
    await assert.rejects(handler({ ...valid, ...patch }), { statusCode: 400 })
    assert.equal(calls.length, 0)
  }
  const { handler, calls } = endpoint({}, false)
  await assert.rejects(handler(valid), { statusCode: 400 })
  assert.equal(calls.length, 1)
})
test('joining requires choir experience and a valid voice part before sending', async () => {
  for (const patch of [
    { choirExperience: undefined },
    { voicePart: undefined },
    { choirExperience: 'maybe' },
    { voicePart: 'Invalid' },
    { ageGroup: undefined },
    { ageGroup: 'Invalid' },
  ]) {
    const { handler, calls } = endpoint()
    await assert.rejects(handler({ ...valid, purpose: 'join', ...patch }), {
      statusCode: 400,
    })
    assert.equal(calls.length, 0)
  }
})
test('joining emails include every supported voice part and both experience answers', async () => {
  for (const voicePart of shared.voiceParts) {
    for (const choirExperience of ['yes', 'no']) {
      const { handler, calls } = endpoint()
      await handler({ ...valid, purpose: 'join', voicePart, choirExperience })
      assert.ok(calls[1].options.body.text.includes(`Stempartij: ${voicePart}`))
      assert.ok(
        calls[1].options.body.text.includes(
          `Koorervaring: ${choirExperience === 'yes' ? 'Ja' : 'Nee'}`,
        ),
      )
    }
  }
})
test('other forms do not require or include the joining fields', async () => {
  for (const purpose of ['booking', 'donate']) {
    const { handler, calls } = endpoint()
    await handler({
      ...valid,
      purpose,
      choirExperience: undefined,
      voicePart: undefined,
      ageGroup: undefined,
    })
    assert.equal(calls[1].options.body.text.includes('Koorervaring:'), false)
    assert.equal(calls[1].options.body.text.includes('Stempartij:'), false)
    assert.equal(
      calls[1].options.body.text.includes('Leeftijdscategorie:'),
      false,
    )
  }
})
test('joining emails include every supported age group', async () => {
  for (const ageGroup of shared.ageGroups) {
    const { handler, calls } = endpoint()
    await handler({ ...valid, purpose: 'join', ageGroup })
    assert.ok(
      calls[1].options.body.text.includes(`Leeftijdscategorie: ${ageGroup}`),
    )
  }
})
test('missing secret or recipients fail closed', async () => {
  for (const patch of [
    { turnstileSecretKey: '' },
    { contactBookingTo: '' },
    { contactBookingCc: 'invalid-address' },
  ]) {
    const { handler, calls } = endpoint(patch)
    await assert.rejects(handler(valid), { statusCode: 503 })
    assert.equal(calls.length, 0)
  }
})
test('rate limit rejects the sixth submission', async () => {
  const { handler } = endpoint()
  for (let i = 0; i < 5; i++) await handler(valid)
  await assert.rejects(handler(valid), { statusCode: 429 })
})

test('all forms send without CC when omitted, empty or whitespace', async () => {
  for (const [purpose, key] of [
    ['booking', 'Booking'],
    ['join', 'Join'],
    ['donate', 'Donate'],
  ]) {
    for (const cc of [undefined, '', '   ']) {
      const { handler, calls } = endpoint({ ['contact' + key + 'Cc']: cc })
      await handler({ ...valid, purpose })
      assert.equal(calls.length, 2)
      assert.equal(calls[1].options.body.to[0], purpose + '@example.com')
      assert.equal(Object.hasOwn(calls[1].options.body, 'cc'), false)
    }
  }
})

test('verification must have strict success, matching action and approved hostname', async () => {
  for (const verification of [
    { success: 'true' },
    { action: 'join' },
    { action: undefined },
    { hostname: 'attacker.example' },
    { hostname: undefined },
    { hostname: 'localhost' },
  ]) {
    const { handler, calls } = endpoint({}, true, verification)
    await assert.rejects(handler(valid), { statusCode: 400 })
    assert.equal(calls.length, 1)
  }
})
test('production rejects local hostnames and missing hostname configuration', async () => {
  for (const hostnames of ['', 'localhost', 'amstelgospel.nl,127.0.0.1']) {
    const { handler, calls } = endpoint(
      { turnstileHostnames: hostnames },
      true,
      {},
      true,
    )
    await assert.rejects(handler(valid), { statusCode: 503 })
    assert.equal(calls.length, 0)
  }
})
test('siteverify receives the token through a server-side form encoded request', async () => {
  const { handler, calls } = endpoint()
  await handler(valid)
  const body = new URLSearchParams(calls[0].options.body)
  assert.equal(body.get('secret'), config.turnstileSecretKey)
  assert.equal(body.get('response'), valid.turnstileToken)
  assert.equal(calls[0].options.timeout, 10000)
  assert.equal(calls[0].options.retry, 0)
})

test('page recipients and CAPTCHA action stay the same for primary and other questions', async () => {
  for (const purpose of ['booking', 'join', 'donate']) {
    for (const subject of ['Pagina-specifieke vraag', 'Andere vraag']) {
      const { handler, calls } = endpoint()
      await handler({ ...valid, purpose, subject })
      assert.equal(calls[1].options.body.to[0], purpose + '@example.com')
      assert.equal(calls[1].options.body.cc[0], purpose + '-cc@example.com')
      assert.ok(calls[1].options.body.subject.endsWith(subject))
    }
  }
})
