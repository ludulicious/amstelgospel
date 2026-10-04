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

Deploy `.output/public` to a static host. `pnpm build` also supports conventional Nuxt server hosting. No environment variables, remote fonts, content database service or authentication are required. All content pages and concerts are automatically included in prerendering, including archived concerts and newly added Markdown files.

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
- The validated Nuxt UI contact form creates an email draft. Visitors send it themselves through their email application; it is not a backend delivery service. A copyable fallback is provided.
- The source currently announces a waiting list and ticket sales starting in early October. No ticket URL was published in the extracted source. Add `ticketUrl` and update `ticketStatus` when available.

## Source and maintenance

[Source inventory](docs/sources.md) documents migrated facts and original URLs. [Image provenance](docs/media-sources.json) maps local assets to their source. Photography remains credited to its existing owners; no ownership or license is transferred by this project. Existing photo credits visible in source filenames are retained in the gallery.

Rebuild after publishing content edits. Site navigation and footer links are editable in `content/7.settings/site.yml`; newly created pages can be added to navigation there.
