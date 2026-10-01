<script setup lang="ts">
const props = withDefaults(
  defineProps<{ limit?: number; showPast?: boolean }>(),
  { limit: 0, showPast: false },
)
const { data: events } = await useAsyncData('events', () =>
  queryCollection('events').order('date', 'ASC').all(),
)
const today = useState('today', () =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Amsterdam' }).format(
    new Date(),
  ),
)
onMounted(() => {
  today.value = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Amsterdam',
  }).format(new Date())
})
const visibleEvents = computed(() => {
  const list = (events.value || []).filter((event) =>
    props.showPast
      ? (event.endDate || event.date) < today.value
      : (event.endDate || event.date) >= today.value,
  )
  return props.limit ? list.slice(0, props.limit) : list
})
const month = (date: string) =>
  new Intl.DateTimeFormat('nl-NL', {
    month: 'short',
    timeZone: 'Europe/Amsterdam',
  })
    .format(new Date(`${date}T12:00:00Z`))
    .replace('.', '')
</script>
<template>
  <div class="event-list">
    <NuxtLink
      v-for="event in visibleEvents"
      :key="event.id"
      :to="event.path"
      class="event-row"
    >
      <time :datetime="event.date" class="event-date"
        ><strong>{{ event.date.slice(-2) }}</strong
        ><span>{{ month(event.date) }} {{ event.date.slice(0, 4) }}</span></time
      >
      <div class="event-copy">
        <span class="eyebrow">{{
          event.access === 'private' ? 'Besloten optreden' : 'Live concert'
        }}</span>
        <h3>{{ event.title }}</h3>
        <p>{{ event.location }} · {{ event.city }}</p>
      </div>
      <UIcon name="i-lucide-arrow-up-right" class="event-arrow" />
    </NuxtLink>
    <p v-if="!visibleEvents.length" class="empty-state">
      {{
        showPast
          ? 'Hier verschijnen onze eerdere optredens.'
          : 'Nieuwe concerten volgen. Houd onze socials in de gaten!'
      }}
    </p>
  </div>
</template>
