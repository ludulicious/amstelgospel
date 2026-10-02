<script setup lang="ts">
const { copy } = await useInterfaceCopy()
const { data: menu } = await useAsyncData('main-menu', () =>
  queryCollection('menu').first(),
)
const items = computed(() =>
  (menu.value?.items || []).filter((item) => item.visible !== false),
)
const mainItems = computed(() =>
  items.value.filter((item) => item.placements?.includes('desktop')),
)
const mobileItems = computed(() =>
  items.value.filter((item) => item.placements?.includes('mobile')),
)
const action = computed(() => menu.value?.action)
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
    <NuxtLink to="/" :aria-label="copy.homeLinkLabel" class="brand"
      ><ChoirMark
    /></NuxtLink>
    <nav class="desktop-nav" :aria-label="copy.desktopNavLabel">
      <NuxtLink
        v-for="item in mainItems"
        :key="item.to"
        :to="item.to"
        :external="item.external"
        :target="item.external ? '_blank' : undefined"
        :rel="item.external ? 'noopener noreferrer' : undefined"
      >
        <UIcon :name="item.icon" aria-hidden="true" />{{ item.label }}
      </NuxtLink>
    </nav>
    <NuxtLink
      v-if="
        action?.visible !== false && action?.placements?.includes('desktop')
      "
      :to="action.to"
      :external="action.external"
      :target="action.external ? '_blank' : undefined"
      :rel="action.external ? 'noopener noreferrer' : undefined"
      class="button button-ink header-book"
    >
      {{ action.label }} <UIcon :name="action.icon" aria-hidden="true" />
    </NuxtLink>
    <UButton
      class="menu-trigger"
      color="neutral"
      variant="ghost"
      :icon="open ? 'i-lucide-x' : 'i-lucide-menu'"
      :aria-expanded="open"
      aria-controls="mobile-menu"
      :aria-label="open ? copy.closeMenuLabel : copy.openMenuLabel"
      @click="open = !open"
    />
    <nav
      v-if="open"
      id="mobile-menu"
      class="mobile-menu"
      :aria-label="copy.mobileNavLabel"
      @keydown.esc="open = false"
    >
      <NuxtLink
        v-for="item in mobileItems"
        :key="item.to"
        :to="item.to"
        :external="item.external"
        :target="item.external ? '_blank' : undefined"
        :rel="item.external ? 'noopener noreferrer' : undefined"
        >{{ item.label }} <UIcon :name="item.icon" aria-hidden="true"
      /></NuxtLink>
      <NuxtLink
        v-if="
          action?.visible !== false && action?.placements?.includes('mobile')
        "
        :to="action.to"
        :external="action.external"
        :target="action.external ? '_blank' : undefined"
        :rel="action.external ? 'noopener noreferrer' : undefined"
      >
        {{ action.label }} <UIcon :name="action.icon" aria-hidden="true" />
      </NuxtLink>
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
