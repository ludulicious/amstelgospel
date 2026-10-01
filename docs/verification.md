# Verification — 1 October 2026

- `pnpm format` and `pnpm format:check`: formatting passes.
- `pnpm typecheck`: Nuxt preparation and TypeScript checks pass.
- `pnpm test`: four content checks pass (local media/internal links, Marpos preview mappings, event metadata, source gallery/video inventory).
- `pnpm generate`: production static export succeeds, including all 12 content routes and content query payloads. Upstream bundler annotation/unused import warnings do not prevent the build.
- Marpos Studio `scripts/inspect-project.mjs`: seven editable collections, no warnings. Pages and events support new documents; all media fields expose the media editor hint.
- Production browser checks: homepage visually reviewed at 320, 375, 414, 768 pixels and desktop. No horizontal overflow on the tested widths.
- Direct content URLs are normalized with or without trailing slashes, including archived concert routes.
- Mobile menu opens, navigates and closes. Booking form shows inline validation, creates an encoded email draft, and clears that draft after edits. No email was sent.
- FAQ accordion expands. Gallery filters to three `Samen` photos; modal opens, advances and closes with Escape. Video iframe is absent until play, then uses the original YouTube ID on the privacy-enhanced domain.

The GitHub import and final publish flow inside the user's Marpos Studio account has not been executed. The local inspector validates compatibility, not that account connection.

## Design review

Festival-poster typography and the choir's real photography create a distinct music identity. Cream, plum, coral and lime carry the color system. The page progresses from a personal concert image through the choir, a concert promotion, an agenda and participation. Display headings, CTAs and navigation were checked at narrow widths; motion respects reduced-motion preferences. Keyboard focus is visible and the gallery uses Nuxt UI's dialog semantics.
