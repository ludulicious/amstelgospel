<script setup lang="ts">
const route = useRoute()
const { settingsOpen } = useAnalyticsConsent()
const { copy } = await useInterfaceCopy()
const { data: site } = await useChoir()
const { data: menu } = await useMainMenu()
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
        <p class="eyebrow">{{ copy.footerEyebrow }}</p>
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
      <NuxtLink to="/" :aria-label="copy.footerHomeLabel"
        ><ChoirMark surface="dark"
      /></NuxtLink>
      <nav :aria-label="copy.footerNavLabel">
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
        <button
          type="button"
          class="footer-menu-link"
          @click="settingsOpen = true"
        >
          {{ copy.cookieSettingsLabel }}
        </button>
      </nav>
      <span class="copyright">{{
        formatCopy(copy.copyrightText, { year: new Date().getFullYear() })
      }}</span>
    </div>
    <div v-if="route.path === '/'" class="footer-partners">
      <a
        href="https://www.e-boekhouden.nl/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/images/website-identity/e-boekhouden.png"
          alt="Wij werken met e-Boekhouden.nl"
          width="180"
          height="90"
          loading="lazy"
        />
      </a>
    </div>
  </footer>
</template>

<style scoped>
.footer-partners {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-8);
}
.footer-partners img {
  width: 180px;
  height: auto;
}
@media (max-width: 640px) {
  .footer-partners {
    justify-content: flex-start;
  }
}
.footer-menu-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}
</style>
