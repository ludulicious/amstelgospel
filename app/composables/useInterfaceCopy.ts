export async function useInterfaceCopy() {
  const { data } = await useChoir()
  if (!data.value)
    throw createError({
      statusCode: 500,
      statusMessage: 'Site settings are missing',
    })
  return { copy: data.value.copy }
}
