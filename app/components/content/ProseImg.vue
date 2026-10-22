<script setup lang="ts">
const props = defineProps<{
  src: string
  alt?: string
  title?: string
  width?: string | number
  height?: string | number
  size?: string
  align?: string
}>()
const customWidth = computed(() => {
  const value = String(props.width || '').trim()
  return /^(\d+(?:\.\d+)?)(px|%)?$/.test(value) && parseFloat(value) > 0
    ? /^\d+(?:\.\d+)?$/.test(value)
      ? `${value}px`
      : value
    : undefined
})
const format = computed(() =>
  customWidth.value
    ? undefined
    : /^[a-z][a-z0-9-]*$/.test(props.size || '')
      ? props.size
      : 'normal',
)
</script>

<template>
  <NuxtImg
    :src="src"
    :alt="alt || ''"
    :title="title"
    class="prose-image"
    :data-size="format"
    :data-align="align"
    :style="customWidth ? { width: customWidth, maxWidth: '100%' } : undefined"
    format="webp"
    width="1200"
    sizes="xs:100vw sm:100vw md:800px lg:800px"
    loading="lazy"
  />
</template>
