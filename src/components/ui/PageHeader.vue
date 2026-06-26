<template>
  <header class="px-margin-mobile lg:px-margin-desktop py-12 border-b-2 border-primary bg-surface-dim">
    <h1 class="text-headline-lg-mobile lg:text-headline-lg font-headline-lg-mobile lg:font-headline-lg text-primary uppercase tracking-tighter mb-6 flex items-center gap-4">
      <span class="w-4 h-8 bg-tertiary animate-pulse inline-block"></span>
      {{ title }}
    </h1>
    <p v-if="description" class="text-body-lg font-body-lg text-on-surface-variant max-w-3xl mb-8 border-l-2 border-primary pl-4">
      {{ description }}
    </p>
    <slot name="filters"></slot>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>
