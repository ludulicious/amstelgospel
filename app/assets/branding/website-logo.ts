import { officialLogoPaths } from './official-logo-paths.ts'

// A smooth reconstruction of the supplied clef. The source's lettering is
// retained as traced outlines so no substitute font or font download is needed.
export const websiteLogoPaths = {
  ...officialLogoPaths,
  clef: {
    width: 110,
    height: 312,
    path: `M64 4 C80 -7 94 3 92 34 C90 64 77 89 61 109
      L61 155 C87 145 110 167 110 197 C110 226 87 251 61 254
      L61 282 C68 285 72 290 72 297 C72 306 65 312 56 312
      C47 312 40 306 40 297 C40 290 44 285 51 282 L51 254
      C24 249 6 226 6 198 C4 166 28 131 51 108 L51 52
      C51 28 54 12 64 4 Z
      M61 93 C73 74 82 48 82 25 C83 13 80 8 75 9
      C62 10 61 34 61 59 Z
      M51 123 C28 151 16 174 16 196 C16 219 31 239 51 244
      L51 225 C24 217 22 179 51 159 Z
      M51 171 C37 182 36 205 51 214 Z
      M61 165 L61 215 C67 213 73 206 77 202
      C81 199 86 204 82 209 C76 218 70 223 61 225 L61 244
      C84 240 100 220 100 197 C100 174 80 153 61 165 Z`,
  },
}

export const websiteLogoLayouts = {
  classic: {
    clef: 'translate(10 6) scale(.38)',
    name: 'translate(80 28) scale(1.1)',
    subtitle: 'translate(99 95) scale(1.1)',
    rule: 'M80 81 H400',
  },
  aligned: {
    clef: 'translate(10 6) scale(.38)',
    name: 'translate(80 28) scale(1.1)',
    subtitle: 'translate(80 87) scale(1.25)',
    rule: '',
  },
  compact: {
    clef: 'translate(9 12) scale(.345)',
    name: 'translate(86 30) scale(1.05)',
    subtitle: 'translate(88 90) scale(1.04)',
    rule: 'M64 24 V112',
  },
} as const

export type WebsiteLogoVariant = keyof typeof websiteLogoLayouts
