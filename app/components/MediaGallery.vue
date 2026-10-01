<script setup lang="ts">
const { data: data } = await useAsyncData('photos', () =>
  queryCollection('photos').order('order', 'ASC').order('id', 'ASC').all(),
)
const { data: photoCategories } = await useAsyncData('photo-categories', () =>
  queryCollection('photo_categories')
    .order('order', 'ASC')
    .order('id', 'ASC')
    .all(),
)
const category = ref('')
const categories = computed(() => [
  { key: '', title: 'Alles' },
  ...(photoCategories.value || []),
])
const photos = computed(() =>
  (data.value || []).filter(
    (p) => !category.value || p.category === category.value,
  ),
)
const isOpen = ref(false)
const selectedIndex = ref(0)
const selected = computed(() => photos.value[selectedIndex.value])
function show(index: number) {
  selectedIndex.value = index
  isOpen.value = true
}
function step(direction: number) {
  selectedIndex.value =
    (selectedIndex.value + direction + photos.value.length) %
    photos.value.length
}
watch(category, () => {
  selectedIndex.value = 0
})
</script>
<template>
  <section class="gallery-section">
    <div class="section-heading">
      <h2>In beeld.</h2>
      <span>{{ photos.length }} foto's</span>
    </div>
    <div class="filter-buttons" aria-label="Filter foto's">
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
    <div class="photo-grid">
      <button
        v-for="(photo, index) in photos"
        :key="photo.image.src"
        type="button"
        class="gallery-photo"
        :aria-label="`Vergroot foto: ${photo.image.alt}`"
        @click="show(index)"
      >
        <img
          :src="photo.image.src"
          :alt="photo.image.alt"
          loading="lazy"
          width="800"
          height="533"
        /><span>{{ photo.title }} <UIcon name="i-lucide-expand" /></span>
      </button>
    </div>
    <UModal
      v-if="isOpen"
      v-model:open="isOpen"
      :title="selected?.title"
      :description="selected?.credit || 'Amstel Gospel Choir'"
      :ui="{ content: 'max-w-5xl' }"
      ><template #body
        ><div
          class="lightbox"
          @keydown.left.prevent="step(-1)"
          @keydown.right.prevent="step(1)"
        >
          <img
            v-if="selected"
            :src="selected.image.src"
            :alt="selected.image.alt"
          />
          <div class="lightbox-controls">
            <UButton
              icon="i-lucide-arrow-left"
              color="neutral"
              variant="outline"
              aria-label="Vorige foto"
              @click="step(-1)"
            /><span>{{ selectedIndex + 1 }} / {{ photos.length }}</span
            ><UButton
              icon="i-lucide-arrow-right"
              color="neutral"
              variant="outline"
              aria-label="Volgende foto"
              @click="step(1)"
            />
          </div></div></template
    ></UModal>
  </section>
</template>
