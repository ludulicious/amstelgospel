<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
const props = withDefaults(
  defineProps<{ purpose?: 'booking' | 'join' | 'donate' }>(),
  { purpose: 'booking' },
)
const { data: site } = await useChoir()
const schema = z.object({
  name: z.string().trim().min(2, 'Vul je naam in.'),
  email: z.email('Vul een geldig e-mailadres in.'),
  phone: z.string(),
  subject: z.string().min(1, 'Kies een onderwerp.'),
  message: z
    .string()
    .trim()
    .min(10, 'Vertel ons iets meer (minimaal 10 tekens).'),
  consent: z
    .boolean()
    .refine(Boolean, 'Ga akkoord voordat je je e-mail opstelt.'),
})
type FormData = z.output<typeof schema>
const subjects = [
  'Een optreden boeken',
  'Een repetitie bezoeken',
  'Donateur worden',
  'Een andere vraag',
]
const state = reactive({
  name: '',
  email: '',
  phone: '',
  subject:
    subjects[
      props.purpose === 'join' ? 1 : props.purpose === 'donate' ? 2 : 0
    ]!,
  message: '',
  consent: false,
})
const draft = ref('')
const mailto = ref('')
watch(state, () => {
  draft.value = ''
  mailto.value = ''
})
const copied = ref(false)
const copyError = ref(false)
function submit(event: FormSubmitEvent<FormData>) {
  const v = event.data
  draft.value = `Beste Amstel Gospel Choir,\n\n${v.message}\n\nNaam: ${v.name}\nE-mail: ${v.email}\nTelefoon: ${v.phone || 'Niet opgegeven'}\nOnderwerp: ${v.subject}\n\nIk ga akkoord met het gebruik van deze gegevens om mijn vraag te beantwoorden.`
  mailto.value = `mailto:${site.value?.email}?subject=${encodeURIComponent(v.subject)}&body=${encodeURIComponent(draft.value)}`
}
async function copy() {
  try {
    await navigator.clipboard.writeText(draft.value)
    copied.value = true
    copyError.value = false
  } catch {
    copyError.value = true
  }
}
</script>
<template>
  <section class="contact-form" aria-labelledby="contact-title">
    <h2 id="contact-title">Vertel het ons.</h2>
    <p>
      Vul je bericht in en open het daarna in je eigen e-mailprogramma. Je
      verstuurt de e-mail zelf.
    </p>
    <UForm
      :schema="schema"
      :state="state"
      novalidate
      class="form-fields"
      @submit="submit"
    >
      <div class="form-row">
        <UFormField name="name" label="Je naam" required
          ><UInput
            v-model="state.name"
            autocomplete="name"
            size="xl" /></UFormField
        ><UFormField name="email" label="E-mailadres" required
          ><UInput
            v-model="state.email"
            type="email"
            autocomplete="email"
            size="xl"
        /></UFormField>
      </div>
      <div class="form-row">
        <UFormField name="phone" label="Telefoon (optioneel)"
          ><UInput
            v-model="state.phone"
            type="tel"
            autocomplete="tel"
            size="xl" /></UFormField
        ><UFormField name="subject" label="Waar gaat het over?"
          ><USelect v-model="state.subject" :items="subjects" size="xl"
        /></UFormField>
      </div>
      <UFormField
        name="message"
        label="Je bericht"
        :description="
          purpose === 'booking'
            ? 'Denk aan datum, locatie, soort evenement en de sfeer die je zoekt.'
            : 'Vertel bijvoorbeeld wanneer je wilt komen en of je al zangervaring hebt.'
        "
        required
        ><UTextarea v-model="state.message" :rows="5" autoresize size="xl"
      /></UFormField>
      <UFormField name="consent"
        ><UCheckbox
          v-model="state.consent"
          label="Het koor mag mijn gegevens gebruiken om mijn vraag te beantwoorden."
        /><NuxtLink to="/privacy" class="privacy-link"
          >Lees over je privacy</NuxtLink
        ></UFormField
      >
      <UButton
        type="submit"
        class="button button-ink"
        trailing-icon="i-lucide-arrow-right"
        >Maak mijn e-mail</UButton
      >
    </UForm>
    <div v-if="draft" class="email-draft" role="status">
      <h3>Je bericht staat klaar.</h3>
      <p>
        Klik om je e-mailprogramma te openen. Werkt dat niet? Kopieer je bericht
        en mail het naar <a :href="`mailto:${site?.email}`">{{ site?.email }}</a
        >.
      </p>
      <div class="draft-actions">
        <a :href="mailto" class="button button-ink"
          >Open je e-mail<UIcon name="i-lucide-mail" /></a
        ><UButton color="neutral" variant="outline" @click="copy">{{
          copied ? 'Bericht gekopieerd' : 'Kopieer bericht'
        }}</UButton>
      </div>
      <p v-if="copyError">
        Kopiëren is niet beschikbaar. Selecteer de tekst hieronder.
      </p>
      <details>
        <summary>Bekijk je bericht</summary>
        <pre>{{ draft }}</pre>
      </details>
    </div>
  </section>
</template>
