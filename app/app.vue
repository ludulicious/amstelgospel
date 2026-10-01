<script setup lang="ts">
import { nl } from '@nuxt/ui/locale'
useHead({
  titleTemplate: (title) =>
    title?.includes('Amstel Gospel Choir')
      ? title
      : `${title || 'Voel de muziek'} · Amstel Gospel Choir`,
})
</script>
<template>
  <UApp :locale="nl">
    <a href="#main" class="skip-link">Ga naar inhoud</a>
    <SiteHeader />
    <NuxtRouteAnnouncer />
    <main id="main"><NuxtPage /></main>
    <SiteFooter />
  </UApp>
</template>
