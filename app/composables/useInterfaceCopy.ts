export async function useInterfaceCopy() {
  const { data } = await useAsyncData('interface-copy', () =>
    queryCollection('interfaceCopy').first(),
  )
  if (!data.value)
    throw createError({
      statusCode: 500,
      statusMessage: 'Interface content is missing',
    })
  return { copy: data.value.copy }
}
