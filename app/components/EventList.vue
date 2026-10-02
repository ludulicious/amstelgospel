<script setup lang="ts">
const { copy } = await useInterfaceCopy()
const props = withDefaults(
  defineProps<{
    limit?: number
    showPast?: boolean
    publicLabel?: string
    privateLabel?: string
    emptyText?: string
  }>(),
  {
    limit: 0,
    showPast: false,
    publicLabel: undefined,
    privateLabel: undefined,
    emptyText: '',
  },
)
const { data: events } = await useAsyncData('events', () =>
  queryCollection('events').all(),
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
  const list = (events.value || [])
    .flatMap((event) =>
      groupedEventSchedule(event.schedule).map((slot) => ({
        ...event,
        slot,
      })),
    )
    .filter((event) =>
      props.showPast
        ? event.slot.date < today.value
        : event.slot.date >= today.value,
    )
    .sort(
      (a, b) =>
        a.slot.date.localeCompare(b.slot.date) ||
        a.slot.time.localeCompare(b.slot.time, 'nl', { numeric: true }),
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
      :key="`${event.id}-${event.slot.date}`"
      :to="event.path"
      class="event-row"
    >
      <time :datetime="event.slot.date" class="event-date"
        ><strong>{{ event.slot.date.slice(-2) }}</strong
        ><span
          >{{ month(event.slot.date) }} {{ event.slot.date.slice(0, 4) }}</span
        ></time
      >
      <div class="event-copy">
        <span class="eyebrow">{{
          event.access === 'private'
            ? privateLabel || copy.privateEventLabel
            : publicLabel || copy.publicEventLabel
        }}</span>
        <h3>{{ event.title }}</h3>
        <p>{{ event.location }} · {{ event.city }}</p>
        <p class="event-time">{{ event.slot.time }}</p>
      </div>
      <UIcon name="i-lucide-arrow-up-right" class="event-arrow" />
    </NuxtLink>
    <p v-if="!visibleEvents.length" class="empty-state">
      {{
        emptyText || (showPast ? copy.pastEmptyText : copy.upcomingEmptyText)
      }}
    </p>
  </div>
</template>
