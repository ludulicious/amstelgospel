<script setup lang="ts">
const { data: site } = await useChoir()
</script>
<template>
  <footer v-if="site" class="site-footer">
    <div class="footer-top">
      <div>
        <p class="eyebrow">Amstel Gospel Choir</p>
        <h2>{{ site.footerTitle }}</h2>
      </div>
      <NuxtLink
        class="round-link"
        to="/boeken"
        aria-label="Neem contact op met het koor"
        ><UIcon name="i-lucide-arrow-up-right"
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
        <NuxtLink to="/steun-ons">Steun ons</NuxtLink
        ><NuxtLink to="/veelgestelde-vragen">Veelgestelde vragen</NuxtLink
        ><NuxtLink to="/privacy">Privacy</NuxtLink
        ><a
          v-for="social in site.socials"
          :key="social.to"
          :href="social.to"
          target="_blank"
          rel="noopener noreferrer"
          >{{ social.label }} ↗</a
        >
      </nav>
      <span class="copyright">© {{ new Date().getFullYear() }} AGC</span>
    </div>
  </footer>
</template>
