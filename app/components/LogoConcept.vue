<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'signature' | 'stage' | 'emblem' }>(), {
  variant: 'signature',
})
</script>

<template>
  <svg
    class="logo-concept"
    :class="`logo-concept-${variant}`"
    :viewBox="variant === 'emblem' ? '0 0 240 180' : '0 0 340 140'"
    role="img"
    aria-label="Amstel Gospel Choir"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Original vector clef, with its two loops and descending stem. -->
    <g
      v-if="variant === 'signature'"
      transform="translate(123 0) scale(1.1)"
      class="logo-symbol logo-symbol-soft"
    >
      <path
        d="M30 112 C44 115 49 104 42 94 L24 35 C18 16 22 5 29 5 C41 6 39 23 27 35 L15 48 C-5 67 6 91 26 88 C44 85 47 64 32 59 C17 54 8 67 15 76"
      />
    </g>
    <g
      v-else-if="variant === 'stage'"
      transform="translate(4 4) scale(1.05)"
      class="logo-symbol"
    >
      <path
        d="M30 112 C44 115 49 104 42 94 L24 35 C18 16 22 5 29 5 C41 6 39 23 27 35 L15 48 C-5 67 6 91 26 88 C44 85 47 64 32 59 C17 54 8 67 15 76"
      />
    </g>
    <g v-else transform="translate(88 1) scale(.9)" class="logo-symbol">
      <path
        d="M30 112 C44 115 49 104 42 94 L24 35 C18 16 22 5 29 5 C41 6 39 23 27 35 L15 48 C-5 67 6 91 26 88 C44 85 47 64 32 59 C17 54 8 67 15 76"
      />
    </g>
    <template v-if="variant === 'signature'">
      <text x="170" y="74" text-anchor="middle" class="logo-signature-name">
        AMSTEL
      </text>
      <text x="170" y="105" text-anchor="middle" class="logo-signature-sub">
        GOSPEL CHOIR
      </text>
    </template>
    <template v-else-if="variant === 'stage'">
      <text x="78" y="76" class="logo-stage-name">AMSTEL</text>
      <path d="M80 91 H324" class="logo-rule" />
      <text x="80" y="118" class="logo-stage-sub">GOSPEL CHOIR</text>
    </template>
    <template v-else>
      <path
        d="M50 48 C50 14 190 14 190 48 M50 96 C50 119 190 119 190 96"
        class="logo-rule"
      />
      <text x="120" y="139" text-anchor="middle" class="logo-emblem-name">
        AMSTEL
      </text>
      <text x="120" y="163" text-anchor="middle" class="logo-emblem-sub">
        GOSPEL CHOIR
      </text>
    </template>
  </svg>
</template>

<style scoped>
/* Hallmark · pre-emit critique: P4 H4 E4 S5 R5 V4 · component exploration */
.logo-concept {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.logo-concept text {
  fill: var(--logo-wordmark, currentColor);
}
.logo-symbol {
  fill: none;
  stroke: var(--logo-clef, currentColor);
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.logo-symbol-soft {
  opacity: 0.6;
}
.logo-rule {
  fill: none;
  stroke: var(--logo-clef, currentColor);
  stroke-width: 1.5;
}
.logo-signature-name {
  font-family: var(--font-body);
  font-size: 48px;
  font-weight: 400;
  letter-spacing: 8px;
}
.logo-signature-sub {
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 5px;
}
.logo-stage-name {
  font-family: var(--font-display);
  font-size: 76px;
  font-weight: 800;
  letter-spacing: 1px;
}
.logo-stage-sub {
  font-family: var(--font-body);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 3px;
}
.logo-emblem-name {
  font-family: var(--font-body);
  font-size: 30px;
  font-weight: 650;
  letter-spacing: 6px;
}
.logo-emblem-sub {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 3px;
}
</style>
