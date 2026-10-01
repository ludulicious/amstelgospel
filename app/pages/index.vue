<script setup lang="ts">
const { data: home } = await useAsyncData('home', () =>
  queryCollection('home').first(),
)
useSeoMeta({
  title: () => home.value?.title,
  description: () => home.value?.description,
  ogTitle: () => home.value?.title,
  ogDescription: () => home.value?.description,
  ogImage: () => home.value?.hero.src,
  twitterCard: 'summary_large_image',
})
</script>
<template>
  <div v-if="home">
    <section class="home-hero page-pad">
      <div class="hero-copy">
        <p class="eyebrow"><span class="live-dot" />{{ home.eyebrow }}</p>
        <h1>
          <span
            v-for="(line, i) in home.headline"
            :key="line"
            :class="{ 'hero-highlight': i === 2 }"
            >{{ line }}</span
          >
        </h1>
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
      <div class="hero-photo-wrap">
        <div class="hero-photo">
          <img
            :src="home.hero.src"
            :alt="home.hero.alt"
            width="800"
            height="533"
            fetchpriority="high"
          /><span class="photo-number" aria-hidden="true">AGC / LIVE</span>
        </div>
        <div class="hero-sticker" aria-hidden="true">
          <UIcon name="i-lucide-audio-lines" /><span>VOLUIT.<br />SAMEN.</span>
        </div>
        <p class="photo-caption">
          {{ home.imageLabel }} <UIcon name="i-lucide-heart" />
        </p>
      </div>
    </section>
    <div class="music-strip" aria-label="Ons geluid">
      <span v-for="item in home.strip" :key="item"
        ><span aria-hidden="true">✳</span>{{ item }}</span
      >
    </div>
    <section class="intro-section page-pad">
      <div class="intro-photo">
        <img
          :src="home.about.image.src"
          :alt="home.about.image.alt"
          width="800"
          height="533"
          loading="lazy"
        /><span class="photo-note">Aangenaam, de AGC-familie.</span>
      </div>
      <div class="intro-copy">
        <p class="eyebrow">Meer dan een koor</p>
        <h2>{{ home.about.title }}</h2>
        <p>{{ home.about.text }}</p>
        <NuxtLink class="text-link" :to="home.about.link.to"
          >{{ home.about.link.label }}<UIcon name="i-lucide-arrow-up-right"
        /></NuxtLink>
      </div>
    </section>
    <section class="concert-feature page-pad">
      <div class="concert-copy">
        <p class="eyebrow">{{ home.concert.eyebrow }}</p>
        <h2>{{ home.concert.title }}</h2>
        <p>{{ home.concert.text }}</p>
        <NuxtLink class="button button-lime" :to="home.concert.link.to"
          >{{ home.concert.link.label }}<UIcon name="i-lucide-arrow-up-right"
        /></NuxtLink>
      </div>
      <div class="concert-photo">
        <img
          :src="home.concert.image.src"
          :alt="home.concert.image.alt"
          width="800"
          height="534"
          loading="lazy"
        /><span class="concert-label">KERST MET AGC</span>
      </div>
    </section>
    <section class="agenda-section page-pad">
      <div class="section-heading">
        <h2>Tot vooraan.</h2>
        <NuxtLink to="/agenda" class="text-link"
          >De hele agenda<UIcon name="i-lucide-arrow-right"
        /></NuxtLink>
      </div>
      <EventList :limit="3" />
    </section>
    <section class="join-banner page-pad">
      <UIcon name="i-lucide-mic-vocal" class="join-mic" aria-hidden="true" />
      <div>
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
