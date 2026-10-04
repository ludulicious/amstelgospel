<script setup lang="ts">
const homepage = ref<HTMLElement | null>(null)
const motionPaused = ref(false)
let revealObserver: IntersectionObserver | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-revealed')
        revealObserver?.unobserve(entry.target)
      }
    },
    { threshold: 0.12 },
  )
  homepage.value?.querySelectorAll('[data-reveal]').forEach((element) => {
    // SSR already displays these elements. Replaying an entrance on hydration
    // would make visible content disappear and then fade back in.
    const bounds = element.getBoundingClientRect()
    if (bounds.top >= window.innerHeight || bounds.bottom <= 0) {
      revealObserver?.observe(element)
    }
  })
})
onBeforeUnmount(() => revealObserver?.disconnect())

const { data: home } = await useAsyncData('home', () =>
  queryCollection('home').first(),
)
const { data: concert } = await useAsyncData('home-concert', () =>
  queryCollection('home_concert').first(),
)
const { copy } = await useInterfaceCopy()
const { data: concertEvent } = await useAsyncData('home-concert-event', () => {
  const path = concert.value?.link.to.split(/[?#]/)[0]
  return path?.startsWith('/agenda/')
    ? queryCollection('events').path(path).first()
    : Promise.resolve(null)
})
const hasConcertTickets = computed(
  () =>
    !!concertEvent.value?.ticketUrl && concertEvent.value.access === 'public',
)
const showConcert = computed(
  () => home.value?.visibility.concert && !!concert.value,
)
const concertLink = computed(() => {
  const to = concert.value?.link.to || '/agenda'
  if (!to.startsWith('/agenda/')) return to
  const hashIndex = to.indexOf('#')
  const path = hashIndex === -1 ? to : to.slice(0, hashIndex)
  const hash = hashIndex === -1 ? '' : to.slice(hashIndex)
  return `${path}${path.includes('?') ? '&' : '?'}from=home${hash}`
})
const headingTag = (section: 'hero' | 'about' | 'agenda' | 'join') => {
  const sections = ['concert', 'hero', 'about', 'agenda', 'join'] as const
  const firstVisible = sections.find((key) =>
    key === 'concert' ? showConcert.value : home.value?.visibility[key],
  )
  return firstVisible === section ? 'h1' : 'h2'
}
useSeoMeta({
  title: () => (showConcert.value ? concert.value?.title : home.value?.title),
  description: () =>
    showConcert.value ? concert.value?.description : home.value?.description,
  ogTitle: () => (showConcert.value ? concert.value?.title : home.value?.title),
  ogDescription: () =>
    showConcert.value ? concert.value?.description : home.value?.description,
  ogImage: () =>
    showConcert.value ? concert.value?.image.src : home.value?.hero.src,
  twitterCard: 'summary_large_image',
})
</script>
<template>
  <div
    v-if="home"
    ref="homepage"
    class="homepage"
    :class="{ 'motion-paused': motionPaused }"
  >
    <section v-if="showConcert && concert" class="concert-feature page-pad">
      <div class="concert-sparkles" aria-hidden="true">
        <span
          v-for="star in 32"
          :key="star"
          class="concert-sparkle"
          :style="{
            '--star-x': `${(star * 29) % 98}%`,
            '--star-y': `${(star * 17) % 92}%`,
            '--star-size': `${star % 4 === 0 ? 26 : star % 3 === 0 ? 12 : 4}px`,
            '--star-delay': `${star * -0.7}s`,
          }"
        />
      </div>
      <div class="concert-copy" data-reveal>
        <p class="eyebrow">{{ concert.eyebrow }}</p>
        <h1 :aria-label="concert.title">
          <span
            v-for="(word, index) in concert.title.split(' ')"
            :key="index"
            class="entrance-word"
            aria-hidden="true"
            :style="{ '--word-delay': `${index * 110}ms` }"
            >{{ word }}</span
          >
        </h1>
        <ContentRenderer :value="concert" class="concert-content" />
        <div class="concert-actions">
          <a
            v-if="hasConcertTickets"
            :href="concertEvent?.ticketUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="button button-gold"
            >{{ copy.ticketLink }}<UIcon name="i-lucide-arrow-up-right"
          /></a>
          <NuxtLink
            class="button"
            :class="
              hasConcertTickets ? 'button-concert-secondary' : 'button-gold'
            "
            :to="concertLink"
            >{{ concert.link.label }}<UIcon name="i-lucide-arrow-right"
          /></NuxtLink>
        </div>
      </div>
      <div class="concert-photo">
        <div class="concert-photo-viewport">
          <NuxtImg
            format="webp"
            fit="inside"
            sizes="xs:100vw sm:50vw md:50vw lg:50vw xl:50vw"
            densities="1x 2x"
            :src="concert.image.src"
            :alt="concert.image.alt"
            width="800"
            height="534"
            fetchpriority="high"
          />
        </div>
        <span class="concert-label">{{ concert.imageLabel }}</span>
      </div>
      <button
        class="motion-toggle"
        type="button"
        :aria-pressed="motionPaused"
        @click="motionPaused = !motionPaused"
      >
        <span aria-hidden="true">{{ motionPaused ? '▶' : 'Ⅱ' }}</span>
        {{ motionPaused ? home.motion.play : home.motion.pause }}
      </button>
    </section>
    <section v-if="home.visibility.hero" class="home-hero page-pad">
      <div class="hero-copy" data-reveal>
        <p class="eyebrow"><span class="live-dot" />{{ home.eyebrow }}</p>
        <component :is="headingTag('hero')">
          <span
            v-for="(line, i) in home.headline"
            :key="line"
            :class="{ 'hero-highlight': i === 2 }"
            >{{ line }}</span
          >
        </component>
        <p class="hero-intro">{{ home.intro }}</p>
        <div class="hero-actions">
          <NuxtLink class="button button-ink" :to="home.primary.to"
            >{{ home.primary.label
            }}<UIcon name="i-lucide-arrow-up-right" /></NuxtLink
          ><NuxtLink class="text-link" :to="home.secondary.to"
            >{{ home.secondary.label }}<UIcon name="i-lucide-arrow-right"
          /></NuxtLink>
        </div>
      </div>
      <div class="hero-photo-wrap" data-reveal>
        <div class="hero-photo">
          <NuxtImg
            format="webp"
            fit="inside"
            sizes="xs:100vw sm:50vw md:50vw lg:50vw xl:50vw"
            densities="1x 2x"
            :src="home.hero.src"
            :alt="home.hero.alt"
            width="800"
            height="533"
            :loading="showConcert ? 'lazy' : 'eager'"
            :fetchpriority="showConcert ? 'auto' : 'high'"
          /><span class="photo-number" aria-hidden="true">{{
            home.photoStamp
          }}</span>
        </div>
        <div class="hero-sticker" aria-hidden="true">
          <div class="sound-bars">
            <i
              v-for="bar in 5"
              :key="bar"
              :style="{ '--bar-delay': `${bar * -0.18}s` }"
            />
          </div>
          <span
            ><template v-for="(line, index) in home.stickerLines" :key="index"
              ><br v-if="index" />{{ line }}</template
            ></span
          >
        </div>
        <p class="photo-caption">
          {{ home.imageLabel }} <UIcon name="i-lucide-heart" />
        </p>
      </div>
    </section>
    <div
      v-if="home.visibility.strip"
      class="music-strip"
      :aria-label="home.stripLabel"
    >
      <div class="music-track">
        <div
          v-for="copy in 2"
          :key="copy"
          class="music-track-group"
          :aria-hidden="copy === 2 ? true : undefined"
        >
          <span v-for="item in home.strip" :key="item"
            ><span aria-hidden="true">✳</span>{{ item }}</span
          >
        </div>
      </div>
    </div>
    <section v-if="home.visibility.about" class="intro-section page-pad">
      <div class="intro-photo" data-reveal>
        <NuxtImg
          format="webp"
          fit="inside"
          sizes="xs:100vw sm:50vw md:50vw lg:50vw xl:50vw"
          densities="1x 2x"
          :src="home.about.image.src"
          :alt="home.about.image.alt"
          width="800"
          height="533"
          loading="lazy"
        /><span class="photo-note">{{ home.about.imageLabel }}</span>
      </div>
      <div class="intro-copy" data-reveal>
        <p class="eyebrow">{{ home.about.eyebrow }}</p>
        <component :is="headingTag('about')">{{ home.about.title }}</component>
        <p>{{ home.about.text }}</p>
        <NuxtLink class="text-link" :to="home.about.link.to"
          >{{ home.about.link.label }}<UIcon name="i-lucide-arrow-up-right"
        /></NuxtLink>
      </div>
    </section>
    <section v-if="home.visibility.agenda" class="agenda-section page-pad">
      <div class="section-heading" data-reveal>
        <component :is="headingTag('agenda')">{{
          home.agenda.title
        }}</component>
        <NuxtLink :to="home.agenda.link.to" class="text-link"
          >{{ home.agenda.link.label }}<UIcon name="i-lucide-arrow-right"
        /></NuxtLink>
      </div>
      <EventList
        :limit="3"
        :public-label="home.agenda.publicLabel"
        :private-label="home.agenda.privateLabel"
        :empty-text="home.agenda.emptyText"
      />
    </section>
    <section v-if="home.visibility.join" class="join-banner page-pad">
      <UIcon name="i-lucide-mic-vocal" class="join-mic" aria-hidden="true" />
      <div data-reveal>
        <component :is="headingTag('join')">{{ home.join.title }}</component>
        <p>{{ home.join.text }}</p>
        <NuxtLink :to="home.join.link.to" class="button button-ink"
          >{{ home.join.link.label }}<UIcon name="i-lucide-arrow-up-right"
        /></NuxtLink>
      </div>
      <span class="join-word" aria-hidden="true"
        ><template v-for="(word, index) in home.joinWords" :key="index"
          ><br v-if="index" />{{ word }}</template
        ></span
      >
    </section>
    <div
      v-if="!showConcert && Object.values(home.visibility).some(Boolean)"
      class="page-pad"
    >
      <button
        class="motion-toggle motion-toggle-inline"
        type="button"
        :aria-pressed="motionPaused"
        @click="motionPaused = !motionPaused"
      >
        <span aria-hidden="true">{{ motionPaused ? '▶' : 'Ⅱ' }}</span>
        {{ motionPaused ? home.motion.play : home.motion.pause }}
      </button>
    </div>
  </div>
</template>
