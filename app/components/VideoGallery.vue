<script setup lang="ts">
const { data: data } = await useAsyncData('videos', () =>
  queryCollection('videos').first(),
)
const active = ref<number | null>(null)
</script>
<template>
  <section class="video-section">
    <div class="section-heading">
      <h2>Hoor ons gaan.</h2>
      <span>Gospel, pop & soul</span>
    </div>
    <p class="media-notice">
      Speel een video af om YouTube te laden. Je maakt dan verbinding met
      YouTube.
    </p>
    <div class="video-grid">
      <div
        v-for="(video, index) in data?.videos"
        :key="video.youtubeId"
        class="video-item"
      >
        <iframe
          v-if="active === index"
          :src="`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`"
          :title="video.title"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
        /><button
          v-else
          type="button"
          :aria-label="`Speel ${video.title}`"
          @click="active = index"
        >
          <img
            :src="video.image.src"
            :alt="video.image.alt"
            loading="lazy"
            width="800"
            height="533"
          /><span class="play-circle"><UIcon name="i-lucide-play" /></span>
        </button>
        <p>{{ video.title }}</p>
      </div>
    </div>
  </section>
</template>
