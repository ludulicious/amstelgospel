<script setup lang="ts">
const { copy } = await useInterfaceCopy()
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { ageGroups, voiceParts } from '#shared/contact'
const props = withDefaults(
  defineProps<{ purpose?: 'booking' | 'join' | 'donate' }>(),
  { purpose: 'booking' },
)

const schema = z
  .object({
    name: z.string().trim().min(2, copy.nameError),
    email: z.email(copy.emailError),
    phone: z.string(),
    choirExperience: z.enum(['yes', 'no']).optional(),
    voicePart: z.enum(voiceParts).optional(),
    ageGroup: z.enum(ageGroups).optional(),
    subject: z.enum(['primary', 'other']),
    message: z.string().trim().min(10, copy.messageError),
    consent: z.boolean().refine(Boolean, copy.consentError),
  })
  .superRefine((data, ctx) => {
    if (props.purpose !== 'join') return
    if (!data.choirExperience) {
      ctx.addIssue({
        code: 'custom',
        path: ['choirExperience'],
        message: copy.choirExperienceError,
      })
    }
    if (!data.voicePart) {
      ctx.addIssue({
        code: 'custom',
        path: ['voicePart'],
        message: copy.voicePartError,
      })
    }
    if (!data.ageGroup) {
      ctx.addIssue({
        code: 'custom',
        path: ['ageGroup'],
        message: copy.ageGroupError,
      })
    }
  })
type FormData = z.output<typeof schema>
const primarySubject = {
  booking: copy.bookingSubject,
  join: copy.joinSubject,
  donate: copy.donationSubject,
}[props.purpose]
const subjects = [
  { value: 'primary', label: primarySubject },
  { value: 'other', label: copy.otherSubject },
]
const state = reactive({
  name: '',
  email: '',
  phone: '',
  choirExperience: undefined as FormData['choirExperience'],
  voicePart: undefined as FormData['voicePart'],
  ageGroup: undefined as FormData['ageGroup'],
  subject: 'primary' as FormData['subject'],
  message: '',
  consent: false,
})
const config = useRuntimeConfig()
const turnstileToken = ref('')
const honeypot = ref('')
const turnstile = useTemplateRef<{ reset: () => void }>('turnstile')
const sending = ref(false)
// Local visual preview only; never enabled in a production build.
const sent = ref(import.meta.dev && useRoute().query.formPreview === 'success')
const error = ref('')
const confirmation = useTemplateRef<HTMLElement>('confirmation')
const formSection = useTemplateRef<HTMLElement>('formSection')
async function sendAnother() {
  state.name = ''
  state.email = ''
  state.phone = ''
  state.choirExperience = undefined
  state.voicePart = undefined
  state.ageGroup = undefined
  state.message = ''
  state.consent = false
  state.subject = 'primary'
  honeypot.value = ''
  error.value = ''
  turnstileToken.value = ''
  sent.value = false
  await nextTick()
  formSection.value
    ?.querySelector<HTMLInputElement>('input:not([type=hidden])')
    ?.focus()
}
watch(
  () => state.subject,
  () => {
    error.value = ''
    sent.value = false
  },
)
async function submit(event: FormSubmitEvent<FormData>) {
  if (sending.value) return
  error.value = ''
  sent.value = false
  if (!turnstileToken.value) {
    error.value = copy.formVerificationError
    return
  }
  sending.value = true
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        ...event.data,
        purpose: props.purpose,
        subject: subjects.find((item) => item.value === event.data.subject)!
          .label,
        honeypot: honeypot.value,
        turnstileToken: turnstileToken.value,
      },
    })
    sent.value = true
    await nextTick()
    confirmation.value?.focus()
  } catch {
    error.value = copy.formSendError
  } finally {
    sending.value = false
    turnstileToken.value = ''
    turnstile.value?.reset()
  }
}
</script>
<template>
  <section
    ref="formSection"
    class="contact-form"
    :aria-labelledby="
      sent ? `contact-success-${purpose}` : `contact-title-${purpose}`
    "
  >
    <div
      v-if="sent"
      ref="confirmation"
      class="form-confirmation"
      role="status"
      tabindex="-1"
    >
      <UIcon
        name="i-lucide-circle-check"
        class="form-confirmation-icon"
        aria-hidden="true"
      />
      <h2 :id="`contact-success-${purpose}`">{{ copy.formSuccessTitle }}</h2>
      <p>{{ copy.formSuccess }}</p>
      <UButton type="button" class="button button-ink" @click="sendAnother">{{
        copy.formSendAnother
      }}</UButton>
    </div>
    <div v-else class="contact-form-content">
      <h2 :id="`contact-title-${purpose}`">{{ copy.formTitle }}</h2>
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
            ><USelect
              v-model="state.subject"
              :items="subjects"
              :disabled="sending"
              size="xl"
          /></UFormField>
        </div>
        <div v-if="purpose === 'join'" class="form-row">
          <div class="form-join-column">
            <UFormField name="voicePart" :label="copy.voicePartLabel" required>
              <USelect
                v-model="state.voicePart"
                :items="[...voiceParts]"
                :placeholder="copy.voicePartPlaceholder"
                :disabled="sending"
                size="xl"
              />
            </UFormField>
            <UFormField
              name="choirExperience"
              :label="copy.choirExperienceLabel"
              required
            >
              <div class="form-radio-control">
                <URadioGroup
                  v-model="state.choirExperience"
                  :items="[
                    { value: 'yes', label: copy.choirExperienceYes },
                    { value: 'no', label: copy.choirExperienceNo },
                  ]"
                  orientation="horizontal"
                  :disabled="sending"
                  size="xl"
                />
              </div>
            </UFormField>
          </div>
          <UFormField name="ageGroup" :label="copy.ageGroupLabel" required>
            <USelect
              v-model="state.ageGroup"
              :items="[...ageGroups]"
              :placeholder="copy.ageGroupPlaceholder"
              :disabled="sending"
              size="xl"
            />
          </UFormField>
        </div>
        <UFormField
          name="message"
          :label="copy.messageLabel"
          :description="
            purpose === 'booking'
              ? copy.bookingMessageHint
              : copy.joinMessageHint
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
        <div hidden aria-hidden="true">
          <label
            >Website<input
              v-model="honeypot"
              name="website"
              tabindex="-1"
              autocomplete="off"
          /></label>
        </div>
        <p v-if="error" role="alert">{{ error }}</p>
        <div class="form-actions">
          <UButton
            :loading="sending"
            :disabled="sending || !config.public.turnstileSiteKey"
            type="submit"
            class="button button-ink"
            trailing-icon="i-lucide-arrow-right"
            >{{ copy.formSubmit }}</UButton
          >
          <ContactTurnstile
            v-if="config.public.turnstileSiteKey"
            :action="purpose"
            ref="turnstile"
            v-model="turnstileToken"
          />
        </div>
      </UForm>
    </div>
  </section>
</template>
