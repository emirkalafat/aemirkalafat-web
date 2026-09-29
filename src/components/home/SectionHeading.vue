<template>
  <header v-reveal class="relative flex flex-col gap-3">
    <span
      class="absolute right-0 -top-6 md:-top-10 font-display text-[72px] md:text-[120px] leading-none select-none pointer-events-none text-transparent opacity-40"
      style="-webkit-text-stroke: 1px rgb(var(--color-outline-variant));"
      aria-hidden="true">
      {{ index }}
    </span>
    <div class="relative flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <span class="font-code text-code" :class="accentText">{{ index }} //</span>
      <h2 class="font-headline-md text-headline-md uppercase">{{ title }}</h2>
    </div>
    <div class="heading-rule h-[2px] w-full" :class="accentBg"></div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { vReveal } from '@/composables/useReveal'

const props = defineProps<{
  index: string
  title: string
  accent: 'tertiary' | 'purple' | 'primary' | 'amber'
}>()

const accentText = computed(
  () => ({ tertiary: 'text-tertiary-text', purple: 'text-cyber-purple', primary: 'text-primary', amber: 'text-rating-average' })[props.accent],
)
const accentBg = computed(
  () => ({ tertiary: 'bg-tertiary', purple: 'bg-cyber-purple', primary: 'bg-primary', amber: 'bg-rating-average' })[props.accent],
)
</script>
