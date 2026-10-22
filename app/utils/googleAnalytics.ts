export const GOOGLE_TAG_ID = 'G-LM6FZLK9NE'

// Basic consent mode: do not even request gtag.js before permission.
export function enableGoogleAnalytics() {
  const browser = window as typeof window & {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
  if (document.getElementById('google-analytics')) return
  browser.dataLayer = browser.dataLayer || []
  browser.gtag = function () {
    browser.dataLayer!.push(arguments)
  }
  browser.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  browser.gtag('consent', 'update', { analytics_storage: 'granted' })
  browser.gtag('js', new Date())
  browser.gtag('config', GOOGLE_TAG_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
  const script = document.createElement('script')
  script.id = 'google-analytics'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`
  document.head.appendChild(script)
}

export function disableGoogleAnalytics() {
  // Stop collection immediately, including while the clean page reloads.
  ;(window as unknown as Record<string, unknown>)[
    `ga-disable-${GOOGLE_TAG_ID}`
  ] = true
  const hostname = window.location.hostname
  const labels = hostname.split('.')
  const domains = [
    '',
    ...labels.map((_, index) => labels.slice(index).join('.')),
  ]
  for (const entry of document.cookie.split(';')) {
    const name = entry.trim().split('=')[0] || ''
    if (name !== '_ga' && !name.startsWith('_ga_')) continue
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ''}; SameSite=Lax`
    }
  }
}
