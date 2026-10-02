import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { parse } from 'yaml'

const read = (file) =>
  readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const files = [
  'content/1.home/1.home.yml',
  'content/1.home/2.menu.md',
  'content/1.home/4.footer-menu.md',
  'content/1.home/3.concert.md',
  'content/7.settings/site.yml',
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
test('FAQ migration keeps ten questions and four booking answers', () => {
  const questions = docs.filter((d) => d.file.startsWith('content/6.faq/'))
  assert.equal(questions.length, 10)
  assert.equal(questions.filter((d) => d.data.showOnBooking).length, 4)
  for (const { data } of questions) {
    assert.ok(data.title && data.content)
    assert.equal(typeof data.showOnBooking, 'boolean')
  }
})
