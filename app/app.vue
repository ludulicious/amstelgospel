<script setup lang="ts">
import { nl } from '@nuxt/ui/locale'
const route = useRoute()
const showSiteChrome = computed(() => route.path !== '/logo-concepts')
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
    <SiteHeader v-if="showSiteChrome" />
    <NuxtRouteAnnouncer />
    <main id="main"><NuxtPage /></main>
    <SiteFooter v-if="showSiteChrome" />
  </UApp>
</template>
