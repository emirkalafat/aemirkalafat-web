<template>
  <header class="px-margin-mobile lg:px-margin-desktop py-12 border-b-2 border-primary bg-surface-dim relative overflow-hidden">
    <!-- Background accent line -->
    <div class="absolute bottom-0 left-0 right-0 h-px opacity-30" style="background: linear-gradient(90deg, rgb(59 130 246), rgb(168 85 247), transparent);"></div>

    <h1
      class="text-headline-lg-mobile lg:text-headline-lg font-headline-lg-mobile lg:font-headline-lg text-primary tracking-tight mb-6 flex items-center gap-4">
      <span class="w-4 h-8 animate-pulse inline-block" style="background: linear-gradient(to bottom, rgb(59 130 246), rgb(168 85 247));"></span>
      {{ title }}
    </h1>
    <p v-if="description"
      class="text-body-lg font-body-lg text-on-surface-variant max-w-3xl mb-8 pl-4"
      style="border-left: 4px solid rgb(59 130 246 / 0.4);">
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
