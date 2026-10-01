import { mkdir, writeFile } from 'node:fs/promises'

// Original vector artwork. No raster tracing, imported outlines, or external fonts.
// Letterforms are constructed on a 40-unit cap-height grid.
const glyphs = {
  A: [38, 'M0 40 L19 0 L38 40 M6.2 27 H31.8'],
  M: [44, 'M0 40 V0 L22 33 L44 0 V40'],
  S: [
    36,
    'M34 4 C29 1 23 0 18 0 C7 0 1 4 1 11 C1 18 9 19 18 20 C28 21 35 24 35 31 C35 38 27 40 18 40 C11 40 5 38 1 35',
  ],
  T: [38, 'M0 0 H38 M19 0 V40'],
  E: [33, 'M33 0 H0 V40 H33 M0 19 H28'],
  L: [32, 'M0 0 V40 H32'],
  G: [
    39,
    'M37 5 C32 1 27 0 20 0 C7 0 0 7 0 20 C0 33 7 40 20 40 C28 40 34 37 38 34 V21 H23',
  ],
  O: [
    40,
    'M20 0 C6 0 0 7 0 20 C0 33 6 40 20 40 C34 40 40 33 40 20 C40 7 34 0 20 0 Z',
  ],
  P: [34, 'M0 40 V0 H18 C29 0 34 4 34 11 C34 18 29 22 18 22 H0'],
  C: [
    38,
    'M37 5 C32 1 27 0 20 0 C7 0 0 7 0 20 C0 33 7 40 20 40 C27 40 32 39 37 35',
  ],
  H: [36, 'M0 0 V40 M36 0 V40 M0 20 H36'],
  I: [12, 'M0 0 H12 M6 0 V40 M0 40 H12'],
  R: [36, 'M0 40 V0 H18 C29 0 34 4 34 11 C34 18 29 22 18 22 H0 M18 22 L36 40'],
}

// Bake positioning into coordinates, keeping stroke thickness even in the
// deliberately wide, low subtitle. Curves stay curves at every output size.
function positionPath(path, x, y, sx, sy) {
  return path.replace(/([A-Z])([^A-Z]*)/g, (_, command, values) => {
    const numbers = values.match(/-?\d*\.?\d+/g)?.map(Number) || []
    const moved = numbers.map((n, i) => {
      const horizontal = command === 'H' || (command !== 'V' && i % 2 === 0)
      return Number((horizontal ? x + n * sx : y + n * sy).toFixed(3))
    })
    return `${command}${moved.join(' ')}`
  })
}
function lettering(text, x, y, width, height, tracking = 10) {
  const naturalWidth = [...text].reduce(
    (sum, char) => sum + (char === ' ' ? 26 : glyphs[char][0]) + tracking,
    -tracking,
  )
  const sx = width / naturalWidth,
    sy = height / 40
  let cursor = x
  return [...text]
    .map((char) => {
      if (char === ' ') {
        cursor += (26 + tracking) * sx
        return ''
      }
      const [advance, path] = glyphs[char]
      const result = positionPath(path, cursor, y, sx, sy)
      cursor += (advance + tracking) * sx
      return result
    })
    .join(' ')
}

// A newly drawn, flowing treble clef with an open loop and rounded terminals.
const clef =
  'M49 97 C36 105 23 96 25 83 C27 66 50 61 61 74 C77 92 64 116 43 117 C20 119 7 103 10 85 C12 66 31 50 43 34 C53 21 58 10 53 4 C48 -2 41 3 38 14 C34 30 39 48 43 69 L52 126 C54 139 46 146 36 146 C28 146 23 141 23 134'
const colours = {
  cream: {
    paper: '#faf5e8',
    text: '#291e35',
    accent: '#9c702e',
    caption: '#6d5c70',
  },
  plum: {
    paper: '#291e35',
    text: '#faf5e8',
    accent: '#e6b947',
    caption: '#e8dcca',
  },
  gold: {
    paper: '#e6b947',
    text: '#291e35',
    accent: '#291e35',
    caption: '#493643',
  },
}
const layouts = {
  signature: {
    label: 'Signature',
    viewBox: '0 0 520 154',
    width: 520,
    height: 154,
    mark: 'translate(9 5) scale(.96)',
    words: [
      ['AMSTEL', 116, 32, 378, 42, 2.7],
      ['GOSPEL CHOIR', 133, 103, 344, 16, 2],
    ],
    rule: 'M116 88 H494',
  },
  duet: {
    label: 'Duet',
    viewBox: '0 0 680 134',
    width: 680,
    height: 134,
    mark: 'translate(7 7) scale(.81)',
    words: [
      ['AMSTEL', 98, 38, 244, 32, 2.7],
      ['GOSPEL', 396, 38, 255, 32, 2.7],
      ['CHOIR', 477, 91, 93, 12, 1.8],
    ],
    rule: 'M368 32 V80',
  },
  unison: {
    label: 'Unison',
    viewBox: '0 0 470 154',
    width: 470,
    height: 154,
    mark: 'translate(10 5) scale(.96)',
    words: [
      ['AMSTEL', 114, 34, 329, 41, 2.7],
      ['GOSPEL CHOIR', 114, 97, 329, 18, 2],
    ],
    rule: '',
  },
}
function artwork(layout, colour) {
  return `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g transform="${layout.mark}" stroke="${colour.accent}" stroke-width="4.6"><path d="${clef}"/><circle cx="23" cy="132" r="4.5" fill="${colour.accent}" stroke="none"/></g>
    ${layout.words.map(([word, x, y, width, height, stroke]) => `<path d="${lettering(word, x, y, width, height)}" stroke="${colour.text}" stroke-width="${stroke}"/>`).join('\n    ')}
    ${layout.rule ? `<path d="${layout.rule}" stroke="${colour.accent}" stroke-width="1.6"/>` : ''}
  </g>`
}
const output = new URL('../public/images/website-identity/', import.meta.url)
await mkdir(output, { recursive: true })

// The clef from Unison, strengthened for browser tabs. The dark tile keeps
// the gold symbol visible in both light and dark browser chrome.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img" aria-labelledby="title">
  <title id="title">Amstel Gospel Choir</title>
  <rect width="64" height="64" rx="13" fill="${colours.plum.paper}"/>
  <g transform="translate(18 5) scale(.36)" fill="none" stroke="${colours.plum.accent}" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="${clef}"/>
    <circle cx="23" cy="132" r="5.5" fill="${colours.plum.accent}" stroke="none"/>
  </g>
</svg>\n`
await writeFile(new URL('../public/favicon.svg', import.meta.url), favicon)

for (const [name, layout] of Object.entries(layouts)) {
  for (const [surface, colour] of Object.entries(colours)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.height}" viewBox="${layout.viewBox}" role="img" aria-labelledby="title"><title id="title">Amstel Gospel Choir — ${layout.label}</title>${artwork(layout, colour)}</svg>\n`
    await writeFile(new URL(`${name}-${surface}.svg`, output), svg)
  }
}

// A shareable comparison sheet, also rendered as a PNG for visual review.
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="1560" height="1140" viewBox="0 0 1560 1140">
<rect width="1560" height="1140" fill="${colours.cream.paper}"/>
<g font-family="Arial, sans-serif" fill="${colours.cream.text}">
<text x="60" y="67" font-size="20" letter-spacing="3">AMSTEL GOSPEL CHOIR</text>
<text x="60" y="125" font-size="40">A new website signature.</text>
${Object.entries(layouts)
  .map(([name, layout], row) => {
    const top = 168 + row * 304
    return (
      `<text x="60" y="${top + 27}" font-size="23">${layout.label}</text>` +
      Object.entries(colours)
        .map(([surface, colour], col) => {
          const x = 60 + col * 480,
            y = top + 53
          const scale = 414 / layout.width
          return `<rect x="${x}" y="${y}" width="480" height="218" fill="${colour.paper}" stroke="#d6cbbb" stroke-width="1"/>
      <g transform="translate(${x + 33} ${y + 32}) scale(${scale})">${artwork(layout, colour)}</g>
      <text x="${x + 28}" y="${y + 192}" fill="${colour.caption}" font-size="13">${surface === 'cream' ? 'PLUM + BRONZE / CREAM' : surface === 'plum' ? 'CREAM + GOLD / PLUM' : 'PLUM / GOLD'}</text>`
        })
        .join('')
    )
  })
  .join('')}
<text x="60" y="1110" font-size="16" fill="${colours.cream.caption}">Original vector lettering · Smooth curves · Transparent SVG artwork</text>
</g></svg>`
await writeFile(new URL('comparison.svg', output), sheet)
console.log(
  'Created nine SVG logos, the Unison favicon, and a comparison sheet.',
)
