<script setup lang="ts">
const { data: site } = await useChoir()
const open = ref(false)
const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)
</script>
<template>
  <header class="site-header">
    <NuxtLink
      to="/"
      aria-label="Amstel Gospel Choir, naar de homepage"
      class="brand"
      ><ChoirMark
    /></NuxtLink>
    <nav class="desktop-nav" aria-label="Hoofdnavigatie">
      <NuxtLink v-for="item in site?.nav" :key="item.to" :to="item.to">{{
        item.label
      }}</NuxtLink>
    </nav>
    <NuxtLink to="/boeken" class="button button-ink header-book"
      >Boek het koor <UIcon name="i-lucide-arrow-up-right"
    /></NuxtLink>
    <UButton
      class="menu-trigger"
      color="neutral"
      variant="ghost"
      :icon="open ? 'i-lucide-x' : 'i-lucide-menu'"
      :aria-expanded="open"
      aria-controls="mobile-menu"
      :aria-label="open ? 'Sluit menu' : 'Open menu'"
      @click="open = !open"
    />
    <nav
      v-if="open"
      id="mobile-menu"
      class="mobile-menu"
      aria-label="Mobiele navigatie"
      @keydown.esc="open = false"
    >
      <NuxtLink v-for="item in site?.nav" :key="item.to" :to="item.to"
        >{{ item.label }} <UIcon name="i-lucide-arrow-up-right"
      /></NuxtLink>
      <NuxtLink to="/boeken"
        >Boek het koor <UIcon name="i-lucide-arrow-up-right"
      /></NuxtLink>
      <NuxtLink to="/steun-ons"
        >Steun ons <UIcon name="i-lucide-heart"
      /></NuxtLink>
    </nav>
  </header>
</template>
