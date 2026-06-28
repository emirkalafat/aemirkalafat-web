<template>
  <article class="border border-outline bg-surface-container-lowest flex flex-col">
    <!-- Card Header -->
    <div class="bg-on-surface text-background px-4 py-2 flex justify-between items-center">
      <h3 class="text-headline-md font-headline-md uppercase tracking-tight">{{ institution }}</h3>
      <span class="material-symbols-outlined">school</span>
    </div>

    <!-- Card Body -->
    <div class="p-gutter flex flex-col gap-4">
      <div>
        <h4 class="text-headline-sm font-headline-md uppercase text-on-surface">{{ degree }}</h4>
        <p class="text-body-md font-body-md text-on-surface-variant mt-1">{{ field }}</p>
      </div>

      <div class="flex items-center gap-2 text-label-md font-code text-on-surface-variant">
        <span class="material-symbols-outlined text-[16px]">calendar_today</span>
        {{ period }}
      </div>

      <div v-if="activities" class="text-body-md text-on-surface-variant border-l-4 border-primary pl-3">
        {{ activities }}
      </div>

      <div v-if="skills && skills.length > 0" class="flex flex-wrap gap-2 mt-auto">
        <span
          v-for="skill in skills"
          :key="skill"
          class="px-2 py-0.5 text-label-md font-code text-xs uppercase border border-cyber-purple text-cyber-purple">
          {{ skill }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Education } from '@/data/experience'

defineProps<Education>()
</script>
