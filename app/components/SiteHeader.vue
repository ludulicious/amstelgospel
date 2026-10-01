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

<style scoped>
/* Give the horizontal wordmark room without crowding the navigation. */
.site-header {
  padding-block: var(--space-4);
}
.brand {
  display: block;
  flex-shrink: 0;
  line-height: 0;
}
@media (max-width: 1024px) {
  .desktop-nav,
  .header-book {
    display: none;
  }
  .menu-trigger {
    display: inline-flex;
    margin-left: auto;
    min-width: 44px;
    min-height: 44px;
  }
}
@media (max-width: 600px) {
  .site-header {
    --choir-logo-width: 200px;
    gap: var(--space-4);
  }
}
</style>
