export function useAnalyticsConsent() {
  const consent = useCookie<string | null>('agc-analytics-consent-v1', {
    maxAge: 60 * 60 * 24 * 180,
    sameSite: 'lax',
    path: '/',
    secure: !import.meta.dev,
  })
  const settingsOpen = useState('analytics-settings-open', () => false)

  async function choose(accepted: boolean) {
    const wasAccepted = consent.value === 'accepted'
    consent.value = accepted ? 'accepted' : 'rejected'
    settingsOpen.value = false
    if (accepted) enableGoogleAnalytics()
    else if (wasAccepted) {
      disableGoogleAnalytics()
      // Unload Google's listeners too; a denied consent update still sends pings.
      await nextTick()
      window.location.reload()
    }
  }

  return { consent, settingsOpen, choose }
}
