import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { parse } from 'yaml'

const read = (file) =>
  readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const files = [
  'content/home.yml',
  'content/settings/site.yml',
  ...['information', 'events', 'photos', 'videos', 'faq'].flatMap((dir) =>
    readdirSync(new URL(`../content/${dir}`, import.meta.url)).map(
      (file) => `content/${dir}/${file}`,
    ),
  ),
]
const docs = files.map((file) => ({
  file,
  data: parse(file.endsWith('.md') ? read(file).split('---')[1] : read(file)),
}))
const routes = new Set([
  '/',
  ...docs
    .filter((d) => d.file.endsWith('.md'))
    .map(
      (d) =>
        `/${d.file.includes('/events/') ? 'agenda/' : ''}${d.file.split('/').pop().replace('.md', '')}`,
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
test('concerts have ISO dates, chronological ranges and no ticket link for private events', () => {
  for (const { data: event } of docs.filter((d) =>
    d.file.includes('/events/'),
  )) {
    assert.match(event.date, /^\d{4}-\d{2}-\d{2}$/)
    if (event.endDate) assert.ok(event.endDate >= event.date)
    if (event.access === 'private') assert.ok(!event.ticketUrl)
  }
})
test('all 30 source gallery photos and 8 source videos were migrated', () => {
  assert.equal(
    docs.filter((d) => d.file.startsWith('content/photos/')).length,
    30,
  )
  assert.equal(
    docs.filter((d) => d.file.startsWith('content/videos/')).length,
    8,
  )
})

test('photos and videos support free-form category lists', () => {
  for (const { file, data } of docs.filter((d) =>
    /^content\/(photos|videos)\//.test(d.file),
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
  const questions = docs.filter((d) => d.file.startsWith('content/faq/'))
  assert.equal(questions.length, 10)
  assert.equal(questions.filter((d) => d.data.showOnBooking).length, 4)
  for (const { data } of questions) {
    assert.ok(data.title && data.content)
    assert.equal(typeof data.showOnBooking, 'boolean')
  }
})
