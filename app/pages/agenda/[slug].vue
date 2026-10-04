<script setup lang="ts">
const { copy } = await useInterfaceCopy()
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
  ogImage: () => event.value?.image?.src,
})
const schedule = computed(() => groupedEventSchedule(event.value?.schedule))
</script>
<template>
  <article v-if="event">
    <header
      class="inner-hero event-hero page-pad"
      :class="{ 'inner-hero-image': event.video?.src || event.image?.src }"
    >
      <div>
        <NuxtLink
          v-if="route.query.from !== 'home'"
          to="/agenda"
          class="text-link back-link"
          ><UIcon name="i-lucide-arrow-left" />{{
            copy.eventBackLink
          }}</NuxtLink
        >
        <p class="eyebrow">
          {{
            event.access === 'private'
              ? copy.eventPrivateLabel
              : copy.eventPublicLabel
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
        <a
          v-if="event.ticketUrl && event.access === 'public'"
          :href="event.ticketUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="button button-gold event-ticket-button"
          >{{ copy.ticketLink }}<UIcon name="i-lucide-arrow-up-right"
        /></a>
      </div>
      <iframe
        v-if="
          event.video?.src &&
          /^https:\/\/(www\.)?youtube(-nocookie)?\.com\/embed\//.test(
            event.video.src,
          )
        "
        :src="event.video.src"
        :title="event.title"
        class="event-video"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
      />
      <video
        v-else-if="event.video?.src"
        :src="event.video.src"
        :aria-label="event.title"
        class="event-video"
        controls
        playsinline
        preload="metadata"
      />
      <NuxtImg
        format="webp"
        fit="inside"
        sizes="xs:100vw sm:50vw md:50vw lg:50vw xl:50vw"
        densities="1x 2x"
        v-else-if="event.image?.src"
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
        <h2>{{ copy.eventPracticalTitle }}</h2>
        <dl>
          <div>
            <dt>{{ copy.eventWhenLabel }}</dt>
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
            <dt>{{ copy.eventWhereLabel }}</dt>
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
          >{{ copy.ticketLink }}<UIcon name="i-lucide-arrow-up-right" /></a
        ><a
          v-else-if="event.access === 'public'"
          :href="`mailto:${site?.email}?subject=${encodeURIComponent(formatCopy(copy.questionSubject, { title: event.title }))}`"
          class="text-link"
          >{{ copy.questionLink }}<UIcon name="i-lucide-mail"
        /></a>
      </aside>
    </div>
  </article>
</template>
