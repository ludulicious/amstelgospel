export type EventSlot = { date: string; time: string }

export const sortedEventSchedule = (schedule: EventSlot[] = []) =>
  [...schedule].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.time.localeCompare(b.time, 'nl', { numeric: true }),
  )

export const eventDateLabel = (date: string) =>
  new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Amsterdam',
  }).format(new Date(`${date}T12:00:00Z`))

export const groupedEventSchedule = (schedule: EventSlot[] = []) => {
  const dates = new Map<string, string[]>()
  for (const slot of sortedEventSchedule(schedule)) {
    const times = dates.get(slot.date) || []
    if (!times.includes(slot.time)) times.push(slot.time)
    dates.set(slot.date, times)
  }
  const list = new Intl.ListFormat('nl-NL', {
    style: 'long',
    type: 'conjunction',
  })
  return Array.from(dates, ([date, times]) => {
    const clockTimes = times.map((time) =>
      time.trim().match(/^(\d{1,2})[.:](\d{2})(?:\s*uur)?$/),
    )
    const time = clockTimes.every(Boolean)
      ? `${list.format(clockTimes.map((match) => `${match![1]!.padStart(2, '0')}:${match![2]}`))} uur`
      : list.format(times)
    return { date, time }
  })
}
