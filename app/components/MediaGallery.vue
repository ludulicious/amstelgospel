<script setup lang="ts">
const { copy } = await useInterfaceCopy()
const { data: data } = await useAsyncData('photos', () =>
  queryCollection('photos')
    .where('visible', '=', true)
    .order('order', 'ASC')
    .order('id', 'ASC')
    .all(),
)
// Register modal-only variants while rendering the gallery so static exports
// contain them even though the modal is initially closed.
const image = useImage()
if (import.meta.server) {
  for (const photo of data.value || []) {
    image.getSizes(photo.image.src, {
      sizes: galleryLightboxImage.sizes,
      densities: galleryLightboxImage.densities,
      modifiers: {
        format: galleryLightboxImage.format,
        quality: 80,
        fit: galleryLightboxImage.fit,
      },
    })
  }
}
const category = ref('')
const categories = computed(() => [
  { key: '', title: copy.photosAllLabel },
  ...Array.from(
    new Set((data.value || []).flatMap((photo) => photo.categories || [])),
  ).map((title) => ({ key: title, title })),
])
const photos = computed(() =>
  (data.value || []).filter(
    (p) => !category.value || p.categories?.includes(category.value),
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
      <h2>{{ copy.photosTitle }}</h2>
      <span>{{ formatCopy(copy.photoCount, { count: photos.length }) }}</span>
    </div>
    <div class="filter-buttons" :aria-label="copy.photosFilterLabel">
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
        :aria-label="
          formatCopy(copy.enlargePhotoLabel, { alt: photo.image.alt })
        "
        @click="show(index)"
      >
        <NuxtImg
          format="webp"
          fit="inside"
          sizes="xs:100vw sm:50vw md:33vw lg:33vw xl:33vw"
          densities="1x 2x"
          :src="photo.image.src"
          :alt="photo.image.alt"
          loading="lazy"
          width="800"
        /><span>{{ photo.title }} <UIcon name="i-lucide-expand" /></span>
      </button>
    </div>
    <UModal
      v-if="isOpen"
      v-model:open="isOpen"
      :title="selected?.title"
      :description="selected?.credit || copy.footerEyebrow"
      :ui="{
        content: 'max-w-5xl h-[calc(100dvh-2rem)]',
        header: 'shrink-0',
        title: 'gallery-modal-title',
        body: 'flex-1 min-h-0 overflow-hidden flex flex-col',
      }"
      ><template #body
        ><div
          class="lightbox"
          @keydown.left.prevent="step(-1)"
          @keydown.right.prevent="step(1)"
        >
          <NuxtImg
            v-if="selected"
            v-bind="galleryLightboxImage"
            :src="selected.image.src"
            :alt="selected.image.alt"
          />
          <div class="lightbox-controls">
            <UButton
              icon="i-lucide-arrow-left"
              color="neutral"
              variant="outline"
              :aria-label="copy.previousPhotoLabel"
              @click="step(-1)"
            /><span>{{ selectedIndex + 1 }} / {{ photos.length }}</span
            ><UButton
              icon="i-lucide-arrow-right"
              color="neutral"
              variant="outline"
              :aria-label="copy.nextPhotoLabel"
              @click="step(1)"
            />
          </div></div></template
    ></UModal>
  </section>
</template>
