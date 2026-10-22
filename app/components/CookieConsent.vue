<script setup lang="ts">
const { copy } = await useInterfaceCopy()
const { consent, settingsOpen, choose } = useAnalyticsConsent()
const ready = ref(false)
onMounted(() => {
  ready.value = true
  if (consent.value === 'accepted') enableGoogleAnalytics()
})
</script>

<template>
  <section
    v-if="
      ready &&
      (settingsOpen || !['accepted', 'rejected'].includes(consent || ''))
    "
    class="cookie-banner"
    aria-labelledby="cookie-title"
    role="region"
  >
    <div>
      <h2 id="cookie-title">{{ copy.cookieTitle }}</h2>
      <p>{{ copy.cookieText }}</p>
      <NuxtLink class="text-link" to="/privacy">{{
        copy.cookiePrivacyLabel
      }}</NuxtLink>
    </div>
    <div class="cookie-actions">
      <button type="button" class="button" @click="choose(false)">
        {{ copy.cookieRejectLabel }}
      </button>
      <button type="button" class="button" @click="choose(true)">
        {{ copy.cookieAcceptLabel }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.cookie-banner {
  position: fixed;
  inset: auto var(--page-gutter) var(--space-5);
  z-index: 90;
  display: flex;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-6);
  max-height: calc(100dvh - var(--space-10));
  overflow-y: auto;
  background: var(--color-paper);
  color: var(--color-ink);
  border: 1px solid var(--color-ink);
  box-shadow: 0 8px 40px var(--color-overlay);
}
h2 {
  font-size: 28px;
  margin: 0 0 var(--space-2);
}
p {
  max-width: 70ch;
  font-size: 14px;
}
.cookie-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  flex-shrink: 0;
}
.cookie-actions .button {
  background: var(--color-paper);
  color: var(--color-ink);
  cursor: pointer;
}
@media (max-width: 1000px) {
  .cookie-banner {
    flex-direction: column;
    align-items: stretch;
  }
  .cookie-actions .button {
    flex: 1;
    white-space: normal;
  }
}
</style>
