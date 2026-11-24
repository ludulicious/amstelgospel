<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const props = defineProps<{
  photo: Collections['information']['image']
  defaultDisplay?: 'Hele foto' | 'Vul het kader'
}>()

const showWhole = computed(
  () => (props.photo.weergave ?? props.defaultDisplay ?? 'Hele foto') === 'Hele foto',
)

const positions = {
  Midden: 'center',
  Linksboven: 'left top',
  Boven: 'center top',
  Rechtsboven: 'right top',
  Links: 'left center',
  Rechts: 'right center',
  Linksonder: 'left bottom',
  Onder: 'center bottom',
  Rechtsonder: 'right bottom',
} as const

const objectPosition = computed(() =>
  !showWhole.value && props.photo.focuspunt
    ? positions[props.photo.focuspunt]
    : undefined,
)
</script>

<template>
  <NuxtImg
    :src="photo.src"
    :alt="photo.alt"
    :class="{ 'photo-whole': showWhole }"
    :style="{ objectPosition }"
    format="webp"
    fit="inside"
    width="800"
    sizes="xs:100vw sm:50vw md:50vw lg:50vw xl:50vw"
    densities="1x 2x"
  />
</template>

<style scoped>
.photo-whole {
  width: 100%;
  height: auto;
  max-height: min(36rem, 75svh);
  aspect-ratio: auto;
  object-fit: contain;
  object-position: center;
}
</style>
