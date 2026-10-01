export default defineAppConfig({
  ui: {
    colors: { primary: 'violet', neutral: 'stone' },
    button: { slots: { base: 'font-bold rounded-none cursor-pointer' } },
    input: { slots: { root: 'w-full', base: 'rounded-none' } },
    textarea: { slots: { root: 'w-full', base: 'rounded-none' } },
    select: { slots: { base: 'w-full rounded-none' } },
  },
})
