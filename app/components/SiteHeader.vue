<script setup lang="ts">
const { data: menu } = await useAsyncData('main-menu', () =>
  queryCollection('menu').first(),
)
const items = computed(() =>
  (menu.value?.items || []).filter((item) => item.visible !== false),
)
const mainItems = computed(() =>
  items.value.filter((item) => item.placement === 'main'),
)
const actionItems = computed(() =>
  items.value.filter((item) => item.placement === 'action'),
)
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
      <NuxtLink v-for="item in mainItems" :key="item.to" :to="item.to">
        <UIcon :name="item.icon" aria-hidden="true" />{{ item.label }}
      </NuxtLink>
    </nav>
    <NuxtLink
      v-for="item in actionItems"
      :key="item.to"
      :to="item.to"
      class="button button-ink header-book"
    >
      {{ item.label }} <UIcon :name="item.icon" aria-hidden="true" />
    </NuxtLink>
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
      <NuxtLink v-for="item in items" :key="item.to" :to="item.to"
        >{{ item.label }} <UIcon :name="item.icon" aria-hidden="true"
      /></NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
/* Give the horizontal wordmark room without crowding the navigation. */
.site-header {
  padding-block: var(--space-4);
}
.desktop-nav {
  gap: var(--space-6);
}
.desktop-nav a {
  gap: var(--space-2);
}
.desktop-nav a .iconify {
  flex-shrink: 0;
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
