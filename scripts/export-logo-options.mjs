import { mkdir, readFile, writeFile } from 'node:fs/promises'
import {
  websiteLogoLayouts,
  websiteLogoPaths,
} from '../app/assets/branding/website-logo.ts'

// Run with Node 22+: node --experimental-strip-types scripts/export-logo-options.mjs
// Export the same geometry as StageLogo, with portable sRGB colours from tokens.css.
const tokens = await readFile(new URL('../tokens.css', import.meta.url), 'utf8')
function tokenHex(name) {
  const match = tokens.match(
    new RegExp(`--${name}: oklch\\((\\d+)% ([\\d.]+) ([\\d.]+)\\)`),
  )
  if (!match) throw new Error(`Missing OKLCH token: ${name}`)
  const lightness = Number(match[1]) / 100
  const chroma = Number(match[2])
  const hue = (Number(match[3]) * Math.PI) / 180
  const a = chroma * Math.cos(hue),
    b = chroma * Math.sin(hue)
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
  const channels = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
  return (
    '#' +
    channels
      .map((c) => {
        const srgb = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
        return Math.round(Math.min(1, Math.max(0, srgb)) * 255)
          .toString(16)
          .padStart(2, '0')
      })
      .join('')
  )
}
const paper = tokenHex('color-paper'),
  ink = tokenHex('color-ink')
const gold = tokenHex('color-accent'),
  deepGold = tokenHex('color-gold-deep')
const colours = {
  cream: { text: ink, clef: deepGold },
  plum: { text: paper, clef: gold },
  gold: { text: ink, clef: ink },
}
const output = new URL('../public/images/logo-options/', import.meta.url)
await mkdir(output, { recursive: true })
for (const [variant, layout] of Object.entries(websiteLogoLayouts)) {
  for (const [surface, colour] of Object.entries(colours)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 132" width="420" height="132" role="img" aria-labelledby="title">
  <title id="title">Amstel Gospel Choir</title>
  <desc>Website concept: ${variant}, for a ${surface} background. Reconstructed from the supplied raster logo; transparent background.</desc>
  <g transform="${layout.clef}" fill="${colour.clef}" fill-rule="evenodd"><path d="${websiteLogoPaths.clef.path.replace(/\s+/g, ' ')}"/></g>
  <g fill="${colour.text}" stroke="${colour.text}" stroke-width="0.35" stroke-linejoin="round" fill-rule="evenodd">
    <path transform="${layout.name}" d="${websiteLogoPaths.name.path}"/>
    <path transform="${layout.subtitle}" d="${websiteLogoPaths.subtitle.path}"/>
  </g>
  ${layout.rule ? `<path d="${layout.rule}" fill="none" stroke="${colour.clef}" stroke-width="1"/>` : ''}
</svg>\n`
    await writeFile(new URL(`amstel-${variant}-${surface}.svg`, output), svg)
  }
}
console.log(
  'Exported 9 transparent SVG logo options from the shared geometry and site palette.',
)
