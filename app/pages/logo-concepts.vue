<script setup lang="ts">
import type { WebsiteLogoVariant } from '~/assets/branding/website-logo'

const concepts = [
  {
    id: 'classic' as const,
    title: 'Classic rule',
    description:
      'A fine line between Amstel and Gospel Choir. My pick for the website.',
  },
  {
    id: 'aligned' as const,
    title: 'Open & aligned',
    description:
      'Two lines of equal width. Airy, simple, and a little more contemporary.',
  },
  {
    id: 'compact' as const,
    title: 'Vertical bar',
    description:
      'A shorter clef with a vertical divider. A tidy, understated signature.',
  },
]
const surfaces = [
  { id: 'cream', label: 'Plum & gold on cream' },
  { id: 'plum', label: 'Cream & gold on plum' },
  { id: 'gold', label: 'Plum on gold' },
] as const
const selected = ref<WebsiteLogoVariant>('classic')
useSeoMeta({
  title: 'Website logo options · Amstel Gospel Choir',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="logo-workshop page-pad" lang="en">
    <header class="logo-workshop-heading">
      <h1>The logo, made for the web.</h1>
      <p>
        The familiar treble clef on the left, the original lettering on the
        right. Three arrangements in the website’s cream, plum, and gold.
      </p>
    </header>
    <div class="logo-comparison">
      <section
        v-for="concept in concepts"
        :key="concept.id"
        class="logo-option"
        :aria-labelledby="`logo-${concept.id}`"
      >
        <div class="logo-option-heading">
          <h2 :id="`logo-${concept.id}`">{{ concept.title }}</h2>
          <p>{{ concept.description }}</p>
        </div>
        <div class="logo-colourways">
          <figure
            v-for="surface in surfaces"
            :key="surface.id"
            :class="`logo-surface logo-surface-${surface.id}`"
          >
            <div class="logo-sample"><StageLogo :variant="concept.id" /></div>
            <figcaption>
              <span>{{ surface.label }}</span>
              <a
                :href="`/images/logo-options/amstel-${concept.id}-${surface.id}.svg`"
                :download="`amstel-${concept.id}-${surface.id}.svg`"
                :aria-label="`Download ${concept.title}, ${surface.label}, as SVG`"
                >SVG ↓</a
              >
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
    <section class="logo-context" aria-labelledby="header-preview-title">
      <div class="logo-context-heading">
        <div>
          <h2 id="header-preview-title">In the website header</h2>
          <p>Try each option at a practical website size.</p>
        </div>
        <label class="logo-picker"
          >Logo layout
          <select v-model="selected">
            <option
              v-for="concept in concepts"
              :key="concept.id"
              :value="concept.id"
            >
              {{ concept.title }}
            </option>
          </select>
        </label>
      </div>
      <div class="logo-context-frame">
        <div class="logo-header-preview logo-surface-cream">
          <StageLogo :variant="selected" class="logo-at-header-size" />
          <div class="logo-preview-nav" aria-hidden="true">
            <span>Het koor</span><span>Agenda</span><span>Kijk & luister</span
            ><span>Meezingen</span>
          </div>
          <NuxtLink to="/boeken" class="button button-ink"
            >Boek het koor ↗</NuxtLink
          >
        </div>
        <div class="logo-context-hero">
          <div>
            <p>18 & 19 december 2026 · Amstelveen</p>
            <h3>A Season of Kindness.</h3>
          </div>
          <img
            src="/images/gallery-10.jpg"
            alt="Amstel Gospel Choir tijdens een kerstconcert"
            loading="lazy"
            width="800"
            height="534"
          />
        </div>
      </div>
    </section>
    <p class="logo-artwork-note">
      Each download is a transparent SVG; the coloured backgrounds are for
      comparison. The lettering is traced from the supplied 500px logo and the
      clef is smoothed for the web. These are close reconstructions, not the
      original vector master.
    </p>
  </div>
</template>

<style scoped>
/* Hallmark · component: logo comparison · theme: existing cream / plum / gold
 * pre-emit critique: P5 H5 E4 S5 R5 V4 · no added motion
 */
.logo-workshop {
  padding-block: var(--space-10) var(--space-16);
}
.logo-workshop-heading {
  margin-bottom: var(--space-8);
}
.logo-workshop-heading h1 {
  font-size: clamp(40px, 4vw, 60px);
  margin: 0 0 var(--space-4);
}
.logo-workshop-heading p {
  max-width: 75ch;
  color: var(--color-muted);
}
.logo-option {
  display: grid;
  grid-template-columns: minmax(150px, 0.55fr) minmax(0, 3fr);
  gap: var(--space-6);
  padding-block: var(--space-5);
  border-top: 1px solid var(--color-rule);
}
.logo-option-heading {
  padding-top: var(--space-3);
}
.logo-option-heading h2 {
  font-size: 27px;
  margin: 0 0 var(--space-3);
}
.logo-option-heading p {
  font-size: 13px;
  color: var(--color-muted);
}
.logo-colourways {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.logo-surface {
  margin: 0;
  padding: var(--space-4) var(--space-5) 0;
  border: 1px solid var(--color-rule);
}
.logo-surface-cream {
  background: var(--color-paper);
  color: var(--color-ink);
  --logo-clef: var(--color-gold-deep);
}
.logo-surface-plum {
  background: var(--color-ink);
  color: var(--color-paper);
  --logo-clef: var(--color-accent);
}
.logo-surface-gold {
  background: var(--color-accent);
  color: var(--color-ink);
  --logo-clef: var(--color-ink);
}
.logo-sample {
  min-height: 104px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-sample :deep(svg) {
  max-width: 340px;
}
.logo-surface figcaption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  font-size: 10px;
  line-height: 1.3;
}
.logo-surface a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding-inline: var(--space-1);
  white-space: nowrap;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.logo-surface-plum a:focus-visible {
  outline-color: var(--color-paper);
}
.logo-context {
  margin-top: var(--space-12);
  border-top: 1px solid var(--color-rule);
  padding-top: var(--space-8);
}
.logo-context-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-5);
  margin-bottom: var(--space-6);
}
.logo-context-heading h2 {
  font-size: 32px;
  margin: 0 0 var(--space-2);
}
.logo-context-heading p,
.logo-picker {
  font-size: 13px;
  color: var(--color-muted);
}
.logo-picker {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  white-space: nowrap;
}
.logo-picker select {
  min-height: 44px;
  padding: var(--space-2) var(--space-3);
  background: var(--color-paper);
  color: var(--color-ink);
  border: 1px solid var(--color-muted);
  border-radius: 0;
  font: inherit;
  cursor: pointer;
}
.logo-picker select:hover {
  border-color: var(--color-ink);
}
.logo-picker select:active {
  background: var(--color-pink);
}
.logo-picker select:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 4px;
}
.logo-picker select:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  background: var(--color-rule);
}
.logo-context-frame {
  border: 1px solid var(--color-rule);
}
.logo-header-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  padding: var(--space-4) var(--space-8);
}
.logo-at-header-size {
  width: 240px;
  flex-shrink: 0;
}
.logo-preview-nav {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  margin-left: auto;
  font-size: 12px;
  font-weight: 650;
  white-space: nowrap;
}
.logo-header-preview .button {
  font-size: 12px;
}
.logo-context-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  background: var(--color-ink);
  color: var(--color-gold-light);
  gap: var(--space-8);
  padding: var(--space-8);
  align-items: center;
}
.logo-context-hero p {
  color: var(--color-accent);
  font-size: 11px;
}
.logo-context-hero h3 {
  font-size: clamp(40px, 5vw, 76px);
  max-width: 12ch;
  margin: var(--space-3) 0 0;
}
.logo-context-hero img {
  width: 100%;
  height: 260px;
  object-fit: cover;
}
.logo-artwork-note {
  max-width: 75ch;
  margin-top: var(--space-8);
  font-size: 13px;
  color: var(--color-muted);
}
@media (max-width: 1100px) {
  .logo-option {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-4);
  }
  .logo-option-heading {
    padding: 0;
  }
  .logo-option-heading h2 {
    margin-bottom: var(--space-2);
  }
  .logo-preview-nav {
    display: none;
  }
}
@media (max-width: 600px) {
  .logo-colourways {
    grid-template-columns: minmax(0, 1fr);
  }
  .logo-sample {
    min-height: 120px;
  }
  .logo-header-preview,
  .logo-context-hero {
    padding: var(--space-4);
  }
  .logo-header-preview .button {
    display: none;
  }
  .logo-at-header-size {
    width: 220px;
    max-width: 100%;
  }
  .logo-context-hero {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-6);
  }
  .logo-context-hero img {
    height: 180px;
  }
  .logo-context-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
