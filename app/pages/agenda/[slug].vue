<script setup lang="ts">
definePageMeta({ key: (route) => route.path.replace(/\/+$/, '') || '/' })
const route = useRoute()
const contentPath = route.path.replace(/\/+$/, '') || '/'
const { data: event } = await useAsyncData(`event-${contentPath}`, () =>
  queryCollection('events').path(contentPath).first(),
)
if (!event.value)
  throw createError({
    statusCode: 404,
    statusMessage: 'Dit concert is er niet',
  })
const { data: site } = await useChoir()
useSeoMeta({
  title: () => event.value?.title,
  description: () => event.value?.description,
  ogTitle: () => event.value?.title,
  ogImage: () => event.value?.image.src,
})
const schedule = computed(() => groupedEventSchedule(event.value?.schedule))
</script>
<template>
  <article v-if="event">
    <header class="inner-hero inner-hero-image event-hero page-pad">
      <div>
        <NuxtLink
          v-if="route.query.from !== 'home'"
          to="/agenda"
          class="text-link back-link"
          ><UIcon name="i-lucide-arrow-left" />Terug naar de agenda</NuxtLink
        >
        <p class="eyebrow">
          {{
            event.access === 'private'
              ? 'Besloten optreden'
              : 'Amstel Gospel Choir live'
          }}
        </p>
        <h1>{{ event.tagline || event.title }}</h1>
        <p>{{ event.city }}</p>
        <ul class="event-schedule">
          <li v-for="(slot, index) in schedule" :key="index">
            <time :datetime="slot.date"
              >{{ eventDateLabel(slot.date) }} · {{ slot.time }}</time
            >
          </li>
        </ul>
      </div>
      <img
        :src="event.image.src"
        :alt="event.image.alt"
        width="800"
        height="533"
        fetchpriority="high"
      />
    </header>
    <div class="page-content page-pad content-columns">
      <ContentRenderer :value="event" class="prose-content" />
      <aside class="practical-box">
        <h2>Goed om te weten.</h2>
        <dl>
          <div>
            <dt>Wanneer</dt>
            <dd>
              <ul class="event-schedule">
                <li v-for="(slot, index) in schedule" :key="index">
                  <time :datetime="slot.date"
                    >{{ eventDateLabel(slot.date) }} · {{ slot.time }}</time
                  >
                </li>
              </ul>
            </dd>
          </div>
          <div>
            <dt>Waar</dt>
            <dd>{{ event.location }}<br />{{ event.city }}</dd>
          </div>
        </dl>
        <p class="notice">{{ event.ticketStatus }}</p>
        <a
          v-if="event.ticketUrl && event.access === 'public'"
          :href="event.ticketUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="button button-ink"
          >Koop je tickets<UIcon name="i-lucide-arrow-up-right" /></a
        ><a
          v-else-if="event.access === 'public'"
          :href="`mailto:${site?.email}?subject=${encodeURIComponent('Vraag over ' + event.title)}`"
          class="text-link"
          >Stel een vraag<UIcon name="i-lucide-mail"
        /></a>
      </aside>
    </div>
  </article>
</template>
