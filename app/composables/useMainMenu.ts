export const useMainMenu = () =>
  useAsyncData('main-menu', () => queryCollection('menu').first())
