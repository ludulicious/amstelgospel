<script setup lang="ts">
withDefaults(defineProps<{ surface?: 'light' | 'dark' }>(), {
  surface: 'light',
})
</script>

<template>
  <span class="choir-mark choir-mark-unison">
    <img
      :src="`/images/website-identity/unison-${surface === 'dark' ? 'plum' : 'cream'}.svg`"
      alt="Amstel Gospel Choir"
      width="470"
      height="154"
    />
  </span>
</template>

<style scoped>
/* Hallmark · component: Unison wordmark · theme: existing cream / plum / gold */
.choir-mark-unison {
  display: block;
  flex-shrink: 0;
  width: var(--choir-logo-width, 240px);
  max-width: 100%;
  line-height: 0;
}
.choir-mark-unison img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}
</style>
