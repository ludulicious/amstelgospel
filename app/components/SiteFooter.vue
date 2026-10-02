<script setup lang="ts">
const { data: site } = await useChoir()
const { data: menu } = await useAsyncData('main-menu', () =>
  queryCollection('menu').first(),
)
const items = computed(() =>
  (menu.value?.items || []).filter(
    (item) => item.visible !== false && item.placements?.includes('footer'),
  ),
)
const action = computed(() => menu.value?.action)
</script>
<template>
  <footer v-if="site" class="site-footer">
    <div class="footer-top">
      <div>
        <p class="eyebrow">Amstel Gospel Choir</p>
        <h2>{{ site.footerTitle }}</h2>
      </div>
      <NuxtLink
        v-if="
          action?.visible !== false && action?.placements?.includes('footer')
        "
        class="round-link"
        :to="action.to"
        :aria-label="action.label"
        :external="action.external"
        :target="action.external ? '_blank' : undefined"
        :rel="action.external ? 'noopener noreferrer' : undefined"
        ><UIcon :name="action.icon"
      /></NuxtLink>
    </div>
    <div class="footer-middle">
      <p>{{ site.footerText }}</p>
      <div class="contact-links">
        <a :href="`mailto:${site.email}`">{{ site.email }}</a
        ><a :href="`tel:${site.phoneLink}`">{{ site.phone }}</a>
      </div>
    </div>
    <div class="footer-bottom">
      <NuxtLink to="/" aria-label="Amstel Gospel Choir homepage"
        ><ChoirMark surface="dark"
      /></NuxtLink>
      <nav aria-label="Footernavigatie">
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          :external="item.external"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          class="footer-menu-link"
        >
          <UIcon v-if="item.icon" :name="item.icon" aria-hidden="true" />
          {{ item.label }}
        </NuxtLink>
      </nav>
      <span class="copyright">© {{ new Date().getFullYear() }} AGC</span>
    </div>
  </footer>
</template>

<style scoped>
.footer-menu-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}
</style>
