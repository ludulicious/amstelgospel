import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { parse } from 'yaml'

const read = (file) =>
  readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const files = [
  'content/1.home/1.home.md',
  'content/1.home/2.menu.md',
  'content/7.settings/site.md',
  ...['2.information', '3.events', '4.photos', '5.videos', '6.faq'].flatMap(
    (dir) =>
      readdirSync(new URL(`../content/${dir}`, import.meta.url))
        .filter((file) => !file.startsWith('.'))
        .map((file) => `content/${dir}/${file}`),
  ),
]
const docs = files.map((file) => ({
  file,
  data: parse(file.endsWith('.md') ? read(file).split('---')[1] : read(file)),
}))
const routes = new Set([
  '/',
  ...docs
    .filter((d) => /^content\/\d+\.(information|events)\//.test(d.file))
    .map(
      (d) =>
        `/${d.file.includes('/3.events/') ? 'agenda/' : ''}${d.file
          .split('/')
          .pop()
          .replace(/^\d+\./, '')
          .replace('.md', '')}`,
    ),
])
const walk = (value, visit) => {
  if (typeof value === 'string') visit(value)
  else if (value && typeof value === 'object')
    Object.values(value).forEach((v) => walk(v, visit))
}

test('all content images and internal destinations exist', () => {
  for (const { file, data } of docs)
    walk(data, (value) => {
      if (value.startsWith('/images/'))
        assert.ok(
          existsSync(new URL(`../public${value}`, import.meta.url)),
          `${file}: missing image ${value}`,
        )
      else if (value.startsWith('/'))
        assert.ok(
          routes.has(value.split('#')[0]),
          `${file}: missing destination ${value}`,
        )
    })
})
test('all editable documents have explicit Marpos preview mappings', () => {
  const previews = JSON.parse(read('studio.preview.json'))
  for (const file of files) {
    assert.ok(previews[file], `Missing preview for ${file}`)
    for (const route of [previews[file]].flat())
      assert.ok(
        routes.has(route.split('#')[0]),
        `Missing preview route ${route}`,
      )
  }
})
test('concerts have dated time slots and no ticket link for private events', () => {
  for (const { data: event } of docs.filter((d) =>
    d.file.includes('/3.events/'),
  )) {
    assert.ok(event.schedule.length >= 1)
    for (const slot of event.schedule) {
      assert.match(slot.date, /^\d{4}-\d{2}-\d{2}$/)
      assert.ok(slot.time.trim())
    }
    if (event.access === 'private') assert.ok(!event.ticketUrl)
  }
})
test('all 30 source gallery photos and 8 source videos were migrated', () => {
  assert.equal(
    docs.filter((d) => d.file.startsWith('content/4.photos/')).length,
    30,
  )
  assert.equal(
    docs.filter((d) => d.file.startsWith('content/5.videos/')).length,
    8,
  )
})

test('photos and videos support free-form category lists', () => {
  for (const { file, data } of docs.filter((d) =>
    /^content\/\d+\.(photos|videos)\//.test(d.file),
  )) {
    assert.ok(
      Array.isArray(data.categories),
      `${file}: categories must be a list`,
    )
    assert.ok(!('category' in data), `${file}: legacy category field`)
    for (const category of data.categories) {
      assert.equal(typeof category, 'string', file)
      assert.ok(category.trim().length > 0, `${file}: empty category`)
    }
  }
})
test('FAQ entries have a supported category and explicit visibility', () => {
  const questions = docs.filter((d) => d.file.startsWith('content/6.faq/'))
  assert.equal(questions.length, 10)
  for (const { data } of questions) {
    assert.ok(data.title && data.content)
    assert.ok(
      ['Inhuren', 'Meezingen', 'Optredens', 'Algemeen'].includes(data.category),
    )
    assert.equal(typeof data.visible, 'boolean')
    assert.ok(!('showOnBooking' in data))
  }
})

test('page block definitions reference the actual structured fields and Markdown slots', () => {
  const pages = docs.filter(({ data }) => data.studio?.blocks)
  assert.equal(pages.length, 3)
  for (const { file, data } of pages) {
    const ids = new Set()
    for (const block of data.studio.blocks) {
      assert.ok(!ids.has(block.id), `${file}: duplicate tab`)
      ids.add(block.id)
      if (block.type === 'fields') {
        assert.ok(data[block.field], `${file}: missing ${block.field}`)
      } else {
        assert.ok(read(file).includes(`::${block.component}\n`))
        assert.ok(read(file).includes(`\n#${block.slot}\n`))
        assert.ok(
          existsSync(
            new URL(
              `../app/components/content/${block.component
                .split('-')
                .map((part) => part[0].toUpperCase() + part.slice(1))
                .join('')}.vue`,
              import.meta.url,
            ),
          ),
        )
      }
    }
  }
  const join = pages.find(({ data }) => data.layout === 'join').data
  assert.ok(join.information.when.time)
  assert.ok(join.information.where.address)
  assert.ok(join.information.membership.cost)
  const support = pages.find(({ data }) => data.layout === 'support').data
  assert.deepEqual(
    support.studio.blocks.map(({ slot }) => slot),
    ['default', 'donateur', 'sponsorkliks', 'vriendenloterij'],
  )
})
