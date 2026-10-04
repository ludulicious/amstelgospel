<script setup lang="ts">
const { copy } = await useInterfaceCopy()
const { data: data } = await useAsyncData('videos', () =>
  queryCollection('videos')
    .where('visible', '=', true)
    .order('order', 'ASC')
    .order('id', 'ASC')
    .all(),
)
const category = ref('')
const categories = computed(() => [
  { key: '', title: copy.videosAllLabel },
  ...Array.from(
    new Set((data.value || []).flatMap((video) => video.categories || [])),
  ).map((title) => ({ key: title, title })),
])
const videos = computed(() =>
  (data.value || []).filter(
    (video) => !category.value || video.categories?.includes(category.value),
  ),
)
const active = ref<string | null>(null)
watch(category, () => {
  active.value = null
})
</script>
<template>
  <section class="video-section">
    <div class="section-heading">
      <h2>{{ copy.videosTitle }}</h2>
      <span>{{ copy.videosSubtitle }}</span>
    </div>
    <p class="media-notice">{{ copy.youtubeNotice }}</p>
    <div class="filter-buttons" :aria-label="copy.videosFilterLabel">
      <UButton
        v-for="item in categories"
        :key="item.key"
        :variant="category === item.key ? 'solid' : 'outline'"
        color="neutral"
        :aria-pressed="category === item.key"
        @click="category = item.key"
        >{{ item.title }}</UButton
      >
    </div>
    <div class="video-grid">
      <div v-for="video in videos" :key="video.youtubeId" class="video-item">
        <iframe
          v-if="active === video.youtubeId"
          :src="`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`"
          :title="video.title"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
        /><button
          v-else
          type="button"
          :aria-label="formatCopy(copy.playVideoLabel, { title: video.title })"
          @click="active = video.youtubeId"
        >
          <NuxtImg
            format="webp"
            fit="inside"
            sizes="xs:100vw sm:50vw md:50vw lg:50vw xl:50vw"
            densities="1x 2x"
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
