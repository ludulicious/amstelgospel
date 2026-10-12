<script setup lang="ts">
const { copy } = await useInterfaceCopy()
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
  queryCollection('faq')
    .where('visible', '=', true)
    .order('order', 'ASC')
    .order('id', 'ASC')
    .all(),
)
const faqCategory = ref('')
const faqCategories = computed(() => [
  { key: '', title: copy.faqAllLabel },
  ...['Inhuren', 'Meezingen', 'Optredens', 'Algemeen']
    .filter((category) =>
      (faq.value || []).some((item) => item.category === category),
    )
    .map((title) => ({ key: title, title })),
])
const faqItems = computed(() =>
  (faq.value || [])
    .filter((item) => {
      if (page.value?.layout === 'booking') return item.category === 'Inhuren'
      if (page.value?.layout === 'join') return item.category === 'Meezingen'
      return !faqCategory.value || item.category === faqCategory.value
    })
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
        'inner-hero-image': [
          'story',
          'join',
          'booking',
          'support',
          'agenda',
          'media',
        ].includes(page.layout || 'story'),
      }"
    >
      <div>
        <p class="eyebrow">{{ page.eyebrow }}</p>
        <h1>{{ page.tagline || page.title }}</h1>
        <p class="inner-description">{{ page.description }}</p>
      </div>
      <NuxtImg
        format="webp"
        fit="inside"
        sizes="xs:100vw sm:50vw md:50vw lg:50vw xl:50vw"
        densities="1x 2x"
        v-if="
          ['story', 'join', 'booking', 'support', 'agenda', 'media'].includes(
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
          'content-columns': page.layout === 'booking',
        }"
      >
        <ContentRenderer :value="page" class="prose-content" />
        <aside v-if="page.layout === 'booking' && site" class="practical-box">
          <p class="eyebrow">{{ copy.bookingEyebrow }}</p>
          <h2>{{ copy.bookingTitle }}</h2>
          <p>{{ site.contactName }}</p>
          <a :href="`tel:${site.phoneLink}`" class="contact-phone">{{
            site.phone
          }}</a
          ><a :href="`mailto:${site.email}`">{{ site.email }}</a
          ><NuxtLink to="/veelgestelde-vragen" class="text-link"
            >{{ copy.faqLink }}<UIcon name="i-lucide-arrow-right"
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
            >{{ copy.upcomingFilter }}</UButton
          ><UButton
            color="neutral"
            :variant="showPast ? 'solid' : 'outline'"
            :aria-pressed="showPast"
            @click="showPast = true"
            >{{ copy.pastFilter }}</UButton
          >
        </div>
        <EventList :show-past="showPast"
      /></template>
      <template v-if="page.layout === 'media'"
        ><VideoGallery /><MediaGallery
      /></template>
      <ContactForm
        v-if="page.layout === 'join' || page.layout === 'booking'"
        :purpose="page.layout === 'join' ? 'join' : 'booking'"
      />
      <section
        v-if="
          page.layout === 'faq' ||
          (['booking', 'join'].includes(page.layout || '') &&
            faqItems.length > 0)
        "
        class="faq-section"
      >
        <h2 v-if="page.layout === 'booking'">{{ copy.bookingFaqTitle }}</h2>
        <h2 v-else-if="page.layout === 'join'">{{ copy.joinFaqTitle }}</h2>
        <div
          v-if="page.layout === 'faq'"
          class="filter-buttons"
          :aria-label="copy.faqFilterLabel"
        >
          <UButton
            v-for="item in faqCategories"
            :key="item.key"
            :variant="faqCategory === item.key ? 'solid' : 'outline'"
            color="neutral"
            :aria-pressed="faqCategory === item.key"
            @click="faqCategory = item.key"
            >{{ item.title }}</UButton
          >
        </div>
        <p v-if="!faqItems.length">{{ copy.faqEmptyText }}</p>
        <UAccordion
          v-else
          :key="faqCategory"
          :items="faqItems"
          :ui="{
            trigger: 'text-lg py-5 cursor-pointer font-bold',
            body: 'text-base pb-5 leading-relaxed',
          }"
        /><NuxtLink
          v-if="page.layout === 'booking' || page.layout === 'join'"
          class="text-link"
          to="/veelgestelde-vragen"
          >{{ copy.allFaqLink }}<UIcon name="i-lucide-arrow-right"
        /></NuxtLink>
      </section>
    </div>
  </article>
</template>
