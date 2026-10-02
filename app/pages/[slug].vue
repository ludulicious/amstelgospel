<script setup lang="ts">
definePageMeta({ key: (route) => route.path.replace(/\/+$/, '') || '/' })
const route = useRoute()
const contentPath = route.path.replace(/\/+$/, '') || '/'
const { data: page } = await useAsyncData(`page-${contentPath}`, () =>
  queryCollection('information').path(contentPath).first(),
)
if (!page.value)
  throw createError({
    statusCode: 404,
    statusMessage: 'Deze pagina is er niet',
  })
const { data: site } = await useChoir()
const { data: faq } = await useAsyncData('faq', () =>
  queryCollection('faq').order('order', 'ASC').order('id', 'ASC').all(),
)
const faqItems = computed(() =>
  (faq.value || [])
    .filter((item) => page.value?.layout !== 'booking' || item.showOnBooking)
    .map((item) => ({ label: item.title, content: item.content })),
)
const showPast = ref(false)
useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description,
  ogTitle: () => page.value?.title,
  ogDescription: () => page.value?.description,
  ogImage: () => page.value?.image.src,
})
</script>
<template>
  <article v-if="page" :class="`page-${page.layout}`">
    <header
      class="inner-hero page-pad"
      :class="{
        'inner-hero-image': ['story', 'join', 'booking', 'support'].includes(
          page.layout || 'story',
        ),
      }"
    >
      <div>
        <p class="eyebrow">{{ page.eyebrow }}</p>
        <h1>{{ page.title }}</h1>
        <p class="inner-description">{{ page.description }}</p>
      </div>
      <img
        v-if="
          ['story', 'join', 'booking', 'support'].includes(
            page.layout || 'story',
          )
        "
        :src="page.image.src"
        :alt="page.image.alt"
        width="800"
        height="533"
        fetchpriority="high"
      />
    </header>
    <div class="page-content page-pad">
      <div
        :class="{
          'content-columns': ['join', 'booking'].includes(
            page.layout || 'story',
          ),
        }"
      >
        <ContentRenderer :value="page" class="prose-content" />
        <aside v-if="page.layout === 'join' && site" class="practical-box">
          <p class="eyebrow">Een plek voor je stem</p>
          <h2>Kom erbij.</h2>
          <dl>
            <div>
              <dt>Wanneer</dt>
              <dd>{{ site.rehearsal.day }}<br />{{ site.rehearsal.time }}</dd>
            </div>
            <div>
              <dt>Waar</dt>
              <dd>
                {{ site.rehearsal.venue }}<br />{{ site.rehearsal.address }}
              </dd>
            </div>
            <div>
              <dt>Contributie</dt>
              <dd>{{ site.rehearsal.cost }}<br />{{ site.rehearsal.trial }}</dd>
            </div>
          </dl>
          <p class="notice">
            <UIcon name="i-lucide-info" />{{ site.rehearsal.waitingList }}
          </p>
        </aside>
        <aside v-if="page.layout === 'booking' && site" class="practical-box">
          <p class="eyebrow">Even overleggen?</p>
          <h2>We horen je graag.</h2>
          <p>{{ site.contactName }}</p>
          <a :href="`tel:${site.phoneLink}`" class="contact-phone">{{
            site.phone
          }}</a
          ><a :href="`mailto:${site.email}`">{{ site.email }}</a
          ><NuxtLink to="/veelgestelde-vragen" class="text-link"
            >Veelgestelde vragen <UIcon name="i-lucide-arrow-right"
          /></NuxtLink>
        </aside>
      </div>
      <NuxtLink
        v-if="page.action && page.layout === 'story'"
        :to="page.action.to"
        class="button button-ink story-cta"
        >{{ page.action.label }}<UIcon name="i-lucide-arrow-up-right"
      /></NuxtLink>
      <template v-if="page.layout === 'agenda'"
        ><div class="filter-buttons">
          <UButton
            color="neutral"
            :variant="!showPast ? 'solid' : 'outline'"
            :aria-pressed="!showPast"
            @click="showPast = false"
            >Binnenkort</UButton
          ><UButton
            color="neutral"
            :variant="showPast ? 'solid' : 'outline'"
            :aria-pressed="showPast"
            @click="showPast = true"
            >Terugblik</UButton
          >
        </div>
        <EventList :show-past="showPast"
      /></template>
      <template v-if="page.layout === 'media'"
        ><VideoGallery /><MediaGallery
      /></template>
      <template v-if="page.layout === 'support' && site"
        ><div class="support-options">
          <section>
            <span class="support-number">01</span>
            <h2>Word donateur.</h2>
            <p>
              Vanaf {{ site.support.minimum }} help je ons met nieuwe muziek en
              kledingaccessoires.
            </p>
            <dl>
              <dt>Rekeningnummer</dt>
              <dd class="iban">{{ site.support.iban }}</dd>
              <dt>Ten name van</dt>
              <dd>{{ site.support.account }}</dd>
            </dl>
            <a
              class="text-link"
              :href="`mailto:${site.email}?subject=Donateur%20worden`"
              >Meld je aan als donateur<UIcon name="i-lucide-arrow-up-right"
            /></a>
          </section>
          <section>
            <span class="support-number">02</span>
            <h2>Shop & steun.</h2>
            <p>
              Ga via SponsorKliks naar je favoriete webwinkel. Jij betaalt
              dezelfde prijs, wij ontvangen een commissie.
            </p>
            <a
              :href="site.support.sponsorUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-link"
              >Naar SponsorKliks<UIcon name="i-lucide-arrow-up-right"
            /></a>
          </section>
          <section>
            <span class="support-number">03</span>
            <h2>Koppel je lot.</h2>
            <p>
              Speel je al mee met de VriendenLoterij? Laat jouw bestaande lot
              aan Amstel Gospel Choir koppelen. Onze clubcode is
              <strong>{{ site.support.clubCode }}</strong
              >.
            </p>
            <p>
              Bel de VriendenLoterij via {{ site.support.lotteryPhone }} en houd
              onze clubcode bij de hand.
            </p>
          </section>
        </div></template
      >
      <ContactForm
        v-if="page.layout === 'join' || page.layout === 'booking'"
        :purpose="page.layout === 'join' ? 'join' : 'booking'"
      />
      <section
        v-if="page.layout === 'faq' || page.layout === 'booking'"
        class="faq-section"
      >
        <h2 v-if="page.layout === 'booking'">Alvast een antwoord.</h2>
        <UAccordion
          :items="faqItems"
          :ui="{
            trigger: 'text-lg py-5 cursor-pointer font-bold',
            body: 'text-base pb-5 leading-relaxed',
          }"
        /><NuxtLink
          v-if="page.layout === 'booking'"
          class="text-link"
          to="/veelgestelde-vragen"
          >Alle vragen & antwoorden<UIcon name="i-lucide-arrow-right"
        /></NuxtLink>
      </section>
    </div>
  </article>
</template>
