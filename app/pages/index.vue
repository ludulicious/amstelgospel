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
    revealObserver?.observe(element)
  })
})
onBeforeUnmount(() => revealObserver?.disconnect())

const { data: home } = await useAsyncData('home', () =>
  queryCollection('home').first(),
)
useSeoMeta({
  title: () => home.value?.title,
  description: () => home.value?.description,
  ogTitle: () => home.value?.title,
  ogDescription: () => home.value?.description,
  ogImage: () => home.value?.concert.image.src,
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
    <section class="concert-feature page-pad">
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
        <p class="eyebrow">{{ home.concert.eyebrow }}</p>
        <h1 :aria-label="home.concert.title">
          <span
            v-for="(word, index) in home.concert.title.split(' ')"
            :key="index"
            class="entrance-word"
            aria-hidden="true"
            :style="{ '--word-delay': `${index * 110}ms` }"
            >{{ word }}{{ ' ' }}</span
          >
        </h1>
        <p>{{ home.concert.text }}</p>
        <NuxtLink class="button button-gold" :to="home.concert.link.to"
          >{{ home.concert.link.label }}<UIcon name="i-lucide-arrow-up-right"
        /></NuxtLink>
      </div>
      <div class="concert-photo">
        <div class="concert-photo-viewport">
          <img
            :src="home.concert.image.src"
            :alt="home.concert.image.alt"
            width="800"
            height="534"
            fetchpriority="high"
          />
        </div>
        <span class="concert-label">KERST MET AGC</span>
      </div>
      <button
        class="motion-toggle"
        type="button"
        :aria-pressed="motionPaused"
        @click="motionPaused = !motionPaused"
      >
        <span aria-hidden="true">{{ motionPaused ? '▶' : 'Ⅱ' }}</span>
        {{ motionPaused ? 'Animaties afspelen' : 'Animaties pauzeren' }}
      </button>
    </section>
    <section class="home-hero page-pad">
      <div class="hero-copy" data-reveal>
        <p class="eyebrow"><span class="live-dot" />{{ home.eyebrow }}</p>
        <h2>
          <span
            v-for="(line, i) in home.headline"
            :key="line"
            :class="{ 'hero-highlight': i === 2 }"
            >{{ line }}</span
          >
        </h2>
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
          <img
            :src="home.hero.src"
            :alt="home.hero.alt"
            width="800"
            height="533"
            loading="lazy"
          /><span class="photo-number" aria-hidden="true">AGC / LIVE</span>
        </div>
        <div class="hero-sticker" aria-hidden="true">
          <div class="sound-bars">
            <i
              v-for="bar in 5"
              :key="bar"
              :style="{ '--bar-delay': `${bar * -0.18}s` }"
            />
          </div>
          <span>VOLUIT.<br />SAMEN.</span>
        </div>
        <p class="photo-caption">
          {{ home.imageLabel }} <UIcon name="i-lucide-heart" />
        </p>
      </div>
    </section>
    <div class="music-strip" aria-label="Ons geluid">
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
    <section class="intro-section page-pad">
      <div class="intro-photo" data-reveal>
        <img
          :src="home.about.image.src"
          :alt="home.about.image.alt"
          width="800"
          height="533"
          loading="lazy"
        /><span class="photo-note">Aangenaam, de AGC-familie.</span>
      </div>
      <div class="intro-copy" data-reveal>
        <p class="eyebrow">Meer dan een koor</p>
        <h2>{{ home.about.title }}</h2>
        <p>{{ home.about.text }}</p>
        <NuxtLink class="text-link" :to="home.about.link.to"
          >{{ home.about.link.label }}<UIcon name="i-lucide-arrow-up-right"
        /></NuxtLink>
      </div>
    </section>
    <section class="agenda-section page-pad">
      <div class="section-heading" data-reveal>
        <h2>Tot vooraan.</h2>
        <NuxtLink to="/agenda" class="text-link"
          >De hele agenda<UIcon name="i-lucide-arrow-right"
        /></NuxtLink>
      </div>
      <EventList :limit="3" />
    </section>
    <section class="join-banner page-pad">
      <UIcon name="i-lucide-mic-vocal" class="join-mic" aria-hidden="true" />
      <div data-reveal>
        <h2>{{ home.join.title }}</h2>
        <p>{{ home.join.text }}</p>
        <NuxtLink :to="home.join.link.to" class="button button-ink"
          >{{ home.join.link.label }}<UIcon name="i-lucide-arrow-up-right"
        /></NuxtLink>
      </div>
      <span class="join-word" aria-hidden="true">SING<br />IT!</span>
    </section>
  </div>
</template>
