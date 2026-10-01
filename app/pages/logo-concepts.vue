<script setup lang="ts">
const concepts = [
  {
    id: 'signature',
    name: 'Signature',
    description:
      'A flowing clef, a fine rule, and generous lettering. A balanced signature for the main website header.',
    width: 520,
    height: 154,
    headerWidth: 260,
  },
  {
    id: 'duet',
    name: 'Duet',
    description:
      'Amstel and Gospel share a line, separated by a slim bar. A wider option for desktop navigation.',
    width: 680,
    height: 134,
    headerWidth: 340,
  },
  {
    id: 'unison',
    name: 'Unison',
    description:
      'Two aligned lines with room to breathe. A compact option with a little more presence at smaller sizes.',
    width: 470,
    height: 154,
    headerWidth: 240,
  },
]
const colours = [
  { id: 'cream', name: 'Plum & bronze on cream' },
  { id: 'plum', name: 'Cream & gold on plum' },
  { id: 'gold', name: 'Plum on gold' },
]
useSeoMeta({
  title: 'New logo directions · Amstel Gospel Choir',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="identity-workshop page-pad" lang="en">
    <div class="identity-toolbar">
      <NuxtLink to="/">← Back to the website</NuxtLink>
      <a href="/images/website-identity/comparison.png" download
        >Download comparison ↓</a
      >
    </div>
    <header class="identity-intro">
      <h1>A new website signature.</h1>
      <p>
        Three fresh directions. A flowing treble clef, clean geometric
        lettering, and the warm colours of Amstel Gospel Choir.
      </p>
    </header>
    <section
      v-for="concept in concepts"
      :key="concept.id"
      class="identity-direction"
      :aria-labelledby="`${concept.id}-title`"
    >
      <div class="identity-direction-heading">
        <h2 :id="`${concept.id}-title`">{{ concept.name }}</h2>
        <p>{{ concept.description }}</p>
      </div>
      <div class="identity-colours">
        <figure
          v-for="colour in colours"
          :key="colour.id"
          :class="['identity-sample', `identity-${colour.id}`]"
        >
          <div class="identity-artwork">
            <img
              :src="`/images/website-identity/${concept.id}-${colour.id}.svg`"
              :alt="`Amstel Gospel Choir — ${concept.name}`"
              :width="concept.width"
              :height="concept.height"
            />
          </div>
          <figcaption>
            <span>{{ colour.name }}</span>
            <a
              :href="`/images/website-identity/${concept.id}-${colour.id}.svg`"
              :download="`amstel-gospel-choir-${concept.id}-${colour.id}.svg`"
              :aria-label="`Download ${concept.name}, ${colour.name}, as SVG`"
              >SVG ↓</a
            >
          </figcaption>
        </figure>
      </div>
    </section>
    <section class="identity-scale" aria-labelledby="identity-scale-title">
      <h2 id="identity-scale-title">At header size</h2>
      <p>
        The same vector artwork at practical display sizes. Duet needs more
        horizontal room; Signature and Unison suit a compact header.
      </p>
      <div class="identity-scale-options">
        <figure v-for="concept in concepts" :key="concept.id">
          <div class="identity-small-artwork">
            <img
              :src="`/images/website-identity/${concept.id}-cream.svg`"
              :alt="`${concept.name} at website header size`"
              :width="concept.width"
              :height="concept.height"
              :style="{ width: `${concept.headerWidth}px` }"
            />
          </div>
          <figcaption>
            {{ concept.name }} · {{ concept.headerWidth }}px
          </figcaption>
        </figure>
      </div>
    </section>
    <footer class="identity-note">
      Drawn from scratch as smooth vector paths. Every SVG has a transparent
      background and includes its own lettering, so it renders consistently
      without a font download.
    </footer>
  </div>
</template>

<style scoped>
/* Hallmark · component: identity comparison · theme: existing cream / plum / gold
 * pre-emit critique: P5 H5 E5 S5 R5 V4 · static artwork, no added motion
 */
.identity-workshop {
  padding-block: var(--space-5) var(--space-16);
  max-width: 1760px;
  margin-inline: auto;
}
.identity-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-6);
  font-size: 12px;
}
.identity-toolbar a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  white-space: nowrap;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.identity-intro {
  padding-block: var(--space-10) var(--space-12);
}
.identity-intro h1 {
  font-size: clamp(46px, 5vw, 76px);
  margin: 0 0 var(--space-5);
}
.identity-intro p {
  max-width: 65ch;
  color: var(--color-muted);
}
.identity-direction {
  border-top: 1px solid var(--color-rule);
  padding-block: var(--space-6) var(--space-10);
}
.identity-direction-heading h2 {
  font-size: 32px;
  margin: 0 0 var(--space-2);
}
.identity-direction-heading p {
  max-width: 75ch;
  font-size: 14px;
  color: var(--color-muted);
}
.identity-colours {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: var(--space-6);
}
.identity-sample {
  margin: 0;
  padding: var(--space-6) var(--space-6) var(--space-2);
  border: 1px solid var(--color-rule);
}
.identity-cream {
  background: var(--color-paper);
  color: var(--color-ink);
}
.identity-plum {
  background: var(--color-ink);
  color: var(--color-paper);
}
.identity-gold {
  background: var(--color-accent);
  color: var(--color-ink);
}
.identity-artwork {
  min-height: 136px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.identity-artwork img {
  width: 100%;
  height: auto;
  max-width: 440px;
  object-fit: contain;
}
.identity-sample figcaption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  font-size: 11px;
}
.identity-sample a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.identity-plum a:focus-visible {
  outline-color: var(--color-paper);
}
.identity-scale {
  border-top: 1px solid var(--color-rule);
  padding-block: var(--space-8);
}
.identity-scale h2 {
  font-size: 36px;
  margin: 0 0 var(--space-3);
}
.identity-scale > p {
  font-size: 14px;
  color: var(--color-muted);
  max-width: 75ch;
}
.identity-scale-options {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-8) var(--space-12);
  margin-top: var(--space-6);
}
.identity-scale-options figure {
  margin: 0;
  max-width: 100%;
}
.identity-small-artwork {
  min-height: 104px;
  display: flex;
  align-items: center;
}
.identity-small-artwork img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}
.identity-scale-options figcaption {
  font-size: 12px;
  color: var(--color-muted);
  margin-top: var(--space-2);
}
.identity-note {
  max-width: 75ch;
  color: var(--color-muted);
  font-size: 13px;
  border-top: 1px solid var(--color-rule);
  padding-top: var(--space-6);
  margin-top: var(--space-5);
}
@media (max-width: 950px) {
  .identity-sample {
    padding-inline: var(--space-4);
  }
  .identity-artwork {
    min-height: 104px;
  }
  .identity-sample figcaption {
    font-size: 10px;
  }
}
@media (max-width: 700px) {
  .identity-colours {
    grid-template-columns: minmax(0, 1fr);
  }
  .identity-artwork {
    min-height: 140px;
  }
  .identity-sample {
    padding-inline: var(--space-6);
  }
  .identity-intro {
    padding-block: var(--space-8) var(--space-10);
  }
  .identity-scale-options {
    flex-direction: column;
  }
}
</style>
