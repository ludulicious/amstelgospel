<script setup lang="ts">
const config = useRuntimeConfig()
const props = defineProps<{ action: 'booking' | 'join' | 'donate' }>()
const model = defineModel<string>({ default: '' })

const containerRef = useTemplateRef<HTMLDivElement>('container')
const widgetId = ref<string | null>(null)
let disposed = false

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          action: string
          callback: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
        },
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

const siteKey = computed(() => config.public.turnstileSiteKey as string)

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-turnstile]')
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener(
        'error',
        () => reject(new Error('Turnstile script failed')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.dataset.turnstile = 'true'
    script.onload = () => resolve()
    script.onerror = () => {
      script.remove()
      reject(new Error('Turnstile script failed'))
    }
    document.head.appendChild(script)
  })
}

function renderWidget() {
  if (!containerRef.value || !window.turnstile || !siteKey.value) {
    return
  }

  if (widgetId.value) {
    window.turnstile.remove(widgetId.value)
    widgetId.value = null
  }

  widgetId.value = window.turnstile.render(containerRef.value, {
    sitekey: siteKey.value,
    action: props.action,
    theme: 'auto',
    callback: (token: string) => {
      model.value = token
    },
    'expired-callback': () => {
      model.value = ''
    },
    'error-callback': () => {
      model.value = ''
    },
  })
}

function reset() {
  model.value = ''
  if (widgetId.value && window.turnstile) {
    window.turnstile.reset(widgetId.value)
  }
}

defineExpose({ reset })

onMounted(async () => {
  if (!siteKey.value) {
    return
  }

  try {
    await loadTurnstileScript()
    if (!disposed) renderWidget()
  } catch (error) {
    console.error('Failed to load Turnstile:', error)
  }
})

onBeforeUnmount(() => {
  disposed = true
  if (widgetId.value && window.turnstile) {
    window.turnstile.remove(widgetId.value)
  }
})
</script>

<template>
  <div v-if="siteKey" ref="container" class="flex justify-center" />
</template>
