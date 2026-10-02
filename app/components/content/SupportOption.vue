<script setup lang="ts">
defineProps<{ number?: string }>()
</script>
<template>
  <section>
    <span v-if="number" class="support-number">{{ number }}</span>
    <slot />
  </section>
</template>
