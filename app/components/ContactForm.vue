<script setup lang="ts">
const { copy } = await useInterfaceCopy()
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
const props = withDefaults(
  defineProps<{ purpose?: 'booking' | 'join' | 'donate' }>(),
  { purpose: 'booking' },
)
const { data: site } = await useChoir()
const schema = z.object({
  name: z.string().trim().min(2, copy.nameError),
  email: z.email(copy.emailError),
  phone: z.string(),
  subject: z.string().min(1, copy.subjectError),
  message: z.string().trim().min(10, copy.messageError),
  consent: z.boolean().refine(Boolean, copy.consentError),
})
type FormData = z.output<typeof schema>
const subjects = [
  copy.bookingSubject,
  copy.joinSubject,
  copy.donationSubject,
  copy.otherSubject,
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
  draft.value = formatCopy(copy.emailTemplate, {
    name: v.name,
    email: v.email,
    message: v.message,
    subject: v.subject,
    phone: v.phone || copy.phoneNotProvided,
  })
  mailto.value = `mailto:${site.value?.email}?subject=${encodeURIComponent(v.subject)}&body=${encodeURIComponent(draft.value)}`
}
async function copyDraft() {
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
    <h2 id="contact-title">{{ copy.formTitle }}</h2>
    <p>{{ copy.formIntro }}</p>
    <UForm
      :schema="schema"
      :state="state"
      novalidate
      class="form-fields"
      @submit="submit"
    >
      <div class="form-row">
        <UFormField name="name" :label="copy.nameLabel" required
          ><UInput
            v-model="state.name"
            autocomplete="name"
            size="xl" /></UFormField
        ><UFormField name="email" :label="copy.emailLabel" required
          ><UInput
            v-model="state.email"
            type="email"
            autocomplete="email"
            size="xl"
        /></UFormField>
      </div>
      <div class="form-row">
        <UFormField name="phone" :label="copy.phoneLabel"
          ><UInput
            v-model="state.phone"
            type="tel"
            autocomplete="tel"
            size="xl" /></UFormField
        ><UFormField name="subject" :label="copy.subjectLabel"
          ><USelect v-model="state.subject" :items="subjects" size="xl"
        /></UFormField>
      </div>
      <UFormField
        name="message"
        :label="copy.messageLabel"
        :description="
          purpose === 'booking' ? copy.bookingMessageHint : copy.joinMessageHint
        "
        required
        ><UTextarea v-model="state.message" :rows="5" autoresize size="xl"
      /></UFormField>
      <UFormField name="consent"
        ><UCheckbox
          v-model="state.consent"
          :label="copy.consentLabel"
        /><NuxtLink to="/privacy" class="privacy-link">{{
          copy.privacyLink
        }}</NuxtLink></UFormField
      >
      <UButton
        type="submit"
        class="button button-ink"
        trailing-icon="i-lucide-arrow-right"
        >{{ copy.formSubmit }}</UButton
      >
    </UForm>
    <div v-if="draft" class="email-draft" role="status">
      <h3>{{ copy.draftTitle }}</h3>
      <p>
        {{ copy.draftIntro }}
        <a :href="`mailto:${site?.email}`">{{ site?.email }}</a
        >{{ copy.draftSentenceEnd }}
      </p>
      <div class="draft-actions">
        <a :href="mailto" class="button button-ink"
          >{{ copy.draftOpenLink }}<UIcon name="i-lucide-mail" /></a
        ><UButton color="neutral" variant="outline" @click="copyDraft">{{
          copied ? copy.copiedLabel : copy.copyLabel
        }}</UButton>
      </div>
      <p v-if="copyError">{{ copy.clipboardError }}</p>
      <details>
        <summary>{{ copy.draftPreview }}</summary>
        <pre>{{ draft }}</pre>
      </details>
    </div>
  </section>
</template>
