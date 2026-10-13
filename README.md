# Amstel Gospel Choir

A standalone Dutch choir website built with Nuxt 4, Nuxt UI 4 and Nuxt Content 3. Content and photography were migrated from [amstelgospel.nl](https://www.amstelgospel.nl/) on 1 October 2026. The design uses a festival-poster style, locally bundled fonts, the real choir gallery and a responsive layout.

## Logo source

The original Amstel Gospel Choir logo in `public/images/amstel-gospel-choir-logo.png` was retrieved on 1 October 2026 from the choir's [public Clubspace listing](https://app.use-space.com/public/location/53dcbf80-cb43-4e4c-adbf-f572d2a39d44). The listing identifies the asset as the choir's logo and links to `amstelgospel.nl`. The source artwork is retained unchanged and is used in the header, footer, and favicon.

## Develop

Requires Node.js 22 and pnpm 10 (the exact package-manager version is in `package.json`).

```sh
pnpm install
pnpm dev
```

Open http://localhost:3107/ to preview the site. Checks and production export:

```sh
pnpm typecheck
pnpm test
pnpm format:check
pnpm generate
```

Deploy the Nuxt server produced by `pnpm build` (or the Docker image) to support form delivery. A static-only export cannot send form submissions. Configure the environment variables described below. No remote fonts, content database service or authentication are required. All content pages and concerts are automatically included in prerendering, including archived concerts and newly added Markdown files.

## Image delivery

Photos use Nuxt Image with WebP output at quality 80 and responsive `srcset`
variants for standard and high-density displays. Sizes follow the page and gallery
breakpoints. Original uploads remain in `public/images` for editing and social
previews; displayed photos are resized by IPX. SVG logos remain vector images.

`pnpm generate` includes optimized image files in the static export. The gallery
also registers enlarged image variants during server rendering, so opening its
initially closed modal works without an image server. `pnpm build` supports IPX
image processing on the Nuxt server. Rebuild after adding or changing uploads.

## Deploy with Docker

```sh
docker build -t amstel-gospel-choir .
docker run -d --name amstel-gospel-choir --restart unless-stopped -p 3000:3000 amstel-gospel-choir
```

The image builds with Node.js 22 and the pinned pnpm version, then runs the Nuxt server as a non-root user on port 3000. Only the production output is copied into the runtime image. A health check requests the homepage every 30 seconds. Put your deployment's HTTPS reverse proxy in front of port 3000. Rebuild the image after content changes.

## Edit in Marpos Studio

See [the editor guide](docs/marpos-studio.md). The project exposes nine non-overlapping local collections with explicit Zod schemas and media selectors. `studio.preview.json` maps each existing content document to its rendered route. Photos, videos and FAQ entries are individual documents that can be created and edited separately. There is deliberately no Nuxt Studio dependency: Marpos Studio is a separate desktop editor.

Marpos Studio opens GitHub repositories. Put this standalone project in its own GitHub repository, then connect that repository in Marpos Studio. A preview hosted elsewhere does not automatically create that GitHub connection.

## Behaviour

- All public pages, text, concert information, photographs, videos, contact information and membership details live in `content/`.
- Markdown pages in **Information** can be edited visually or as raw Markdown in Marpos Studio. Layouts are selected from a schema enum; photos use media inputs.
- The concert agenda separates upcoming and past events using Amsterdam dates. Multi-day concerts remain current through their last day. The browser refreshes the date after hydration, including on static exports.
- The gallery contains the 30 original gallery images, category filters and a keyboard-accessible Nuxt UI modal. Four source background photographs are also included.
- The eight original YouTube videos load only after the visitor presses play. Only one video is active at a time. No analytics are configured.
- Booking, membership and donation forms send email through Resend after server-side Cloudflare Turnstile verification. Each form has independently configured recipient and CC addresses.
- The source currently announces a waiting list and ticket sales starting in early October. No ticket URL was published in the extracted source. Add `ticketUrl` and update `ticketStatus` when available.

## Source and maintenance

Legacy `.html` pages use permanent (301) redirects in `nuxt.config.ts`.
These cover the 13 old page URLs found across both Google `site:amstelgospel.nl`
results pages on 13 October 2026, plus five URLs from the migration inventory.
Redirects point directly to current pages; donation and sponsorship links target
the relevant section on `/steun-ons`. The retired CD page points to the media
page, which is the closest remaining content rather than a CD sales page.
Deploy a rebuilt Nuxt server/Docker image to activate these redirects in production.
For a static-only deployment, configure equivalent HTTP 301 redirects at the host.

[Source inventory](docs/sources.md) documents migrated facts and original URLs. [Image provenance](docs/media-sources.json) maps local assets to their source. Photography remains credited to its existing owners; no ownership or license is transferred by this project. Existing photo credits visible in source filenames are retained in the gallery.

Rebuild after publishing content edits. Site navigation and footer links are editable in `content/7.settings/site.yml`; newly created pages can be added to navigation there.

## Form configuration

Copy `.env.example` to `.env` for local development and fill in all values. In production, set these variables on the Nuxt server; Node does not load `.env` automatically. For Docker, pass a production environment file to `docker run` with `--env-file`. Set `NUXT_TURNSTILE_HOSTNAMES=amstelgospel.nl` in production; do not use the local development hostname list.

- `NUXT_RESEND_API_KEY`: Resend API key with email sending permission.
- `NUXT_RESEND_FROM_EMAIL`: sender address on your verified Resend domain.
- `NUXT_TURNSTILE_SECRET_KEY`: private secret for the existing Cloudflare widget. The public site key defaults to `0x4AAAAAAFVXTP1ufSmtL9UJ` and can be overridden with `NUXT_PUBLIC_TURNSTILE_SITE_KEY`.
- `NUXT_TURNSTILE_HOSTNAMES`: comma-separated exact frontend hostnames. Defaults to `amstelgospel.nl`. For local development, use `localhost,127.0.0.1` with a widget allowing those hosts or Cloudflare test keys. Production rejects loopback hostnames. Siteverify must return `success: true`, the matching form action (`booking`, `join`, or `donate`), and an allowed hostname. Each submission attempt resets its widget because tokens are single-use.
- `NUXT_CONTACT_BOOKING_TO` / `NUXT_CONTACT_BOOKING_CC`: booking recipient and CC.
- `NUXT_CONTACT_JOIN_TO` / `NUXT_CONTACT_JOIN_CC`: membership recipient and CC.
- `NUXT_CONTACT_DONATE_TO` / `NUXT_CONTACT_DONATE_CC`: donation recipient and CC.

The page determines the recipient, optional CC and Turnstile action. Each dropdown offers only its page-specific topic and “Andere vraag”; both choices go to the same page-specific recipients.

Each recipient is required. CC is optional: leave its variable unset or empty to send without a copy. Non-empty recipient and CC values must be individual email addresses. Recipients and credentials remain server-only. Replies go to the visitor. Missing credentials or recipient settings prevent delivery; Turnstile is required. The endpoint also checks consent, validates input lengths, rejects a hidden spam field, and limits submissions to five per 15 minutes per connection IP per server process. Configure trusted proxy rate limiting at the host for multi-instance deployments; forwarded IP headers are deliberately not trusted by the app.

Implementation references: [Resend email API](https://resend.com/docs/api-reference/emails/send-email) and [Cloudflare server-side verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
