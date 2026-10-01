<script setup lang="ts">
defineProps<{ error: { statusCode?: number } }>()
</script>
<template>
  <UApp
    ><main class="error-page page-pad">
      <ChoirMark />
      <p class="eyebrow">{{ error.statusCode || 'Oeps' }}</p>
      <h1>Even de draad kwijt.</h1>
      <p>
        Deze pagina kunnen we niet vinden. De muziek gaat verder op de homepage.
      </p>
      <UButton class="button button-ink" @click="clearError({ redirect: '/' })"
        >Terug naar de homepage<UIcon name="i-lucide-arrow-right"
      /></UButton></main
  ></UApp>
</template>
