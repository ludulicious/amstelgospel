<script setup lang="ts">
import {
  websiteLogoPaths,
  websiteLogoLayouts,
  type WebsiteLogoVariant,
} from '~/assets/branding/website-logo'

const props = withDefaults(defineProps<{ variant?: WebsiteLogoVariant }>(), {
  variant: 'classic',
})
const layout = computed(() => websiteLogoLayouts[props.variant])
</script>

<template>
  <svg
    class="stage-logo"
    :class="`stage-logo-${variant}`"
    viewBox="0 0 420 132"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Amstel Gospel Choir"
  >
    <g :transform="layout.clef" class="stage-clef">
      <path :d="websiteLogoPaths.clef.path" fill-rule="evenodd" />
    </g>
    <g :transform="layout.name" class="stage-wordmark">
      <path :d="websiteLogoPaths.name.path" fill-rule="evenodd" />
    </g>
    <path v-if="layout.rule" :d="layout.rule" class="stage-rule" />
    <g :transform="layout.subtitle" class="stage-wordmark">
      <path :d="websiteLogoPaths.subtitle.path" fill-rule="evenodd" />
    </g>
  </svg>
</template>

<style scoped>
/* Hallmark · component: wordmark · theme: existing cream / plum / gold
 * pre-emit critique: P5 H4 E4 S5 R5 V4 · static SVG, no interactive states
 */
.stage-logo {
  display: block;
  width: 100%;
  height: auto;
}
.stage-clef {
  fill: var(--logo-clef, currentColor);
}
.stage-wordmark {
  fill: var(--logo-wordmark, currentColor);
  stroke: var(--logo-wordmark, currentColor);
  stroke-width: 0.35;
  stroke-linejoin: round;
}
.stage-rule {
  fill: none;
  stroke: var(--logo-clef, currentColor);
  stroke-width: 1;
}
</style>
