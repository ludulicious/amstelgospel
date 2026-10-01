export const useChoir = () =>
  useAsyncData('choir-settings', () => queryCollection('site').first())
