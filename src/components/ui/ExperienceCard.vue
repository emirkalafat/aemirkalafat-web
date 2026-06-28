<template>
  <article class="border border-outline bg-surface-container-lowest flex flex-col">
    <!-- Card Header -->
    <div class="bg-on-surface text-background px-4 py-2 flex justify-between items-center">
      <div class="flex flex-col gap-1 flex-1">
        <h3 class="text-headline-md font-headline-md uppercase tracking-tight">{{ company }}</h3>
        <div class="flex items-center gap-2 text-label-md font-code text-background opacity-90">
          <span v-if="totalDuration" class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">schedule</span>
            {{ totalDuration }}
          </span>
          <span v-if="locationType" class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">location_on</span>
            {{ locationType }}
          </span>
        </div>
      </div>
    </div>

    <!-- Card Body - Timeline of roles -->
    <div class="p-gutter flex flex-col gap-6">
      <div v-for="(role, idx) in roles" :key="idx" class="flex gap-4">
        <!-- Timeline dot and line -->
        <div class="flex flex-col items-center">
          <div class="w-3 h-3 bg-primary rounded-full"></div>
          <div v-if="idx < roles.length - 1" class="w-px h-12 bg-primary opacity-40 mt-2"></div>
        </div>

        <!-- Role details -->
        <div class="flex-1 pb-2">
          <h4 class="text-headline-sm font-headline-md uppercase text-on-surface">{{ role.title }}</h4>
          <div class="flex items-center gap-2 text-label-md font-code text-on-surface-variant mt-1 mb-3">
            <span class="font-bold">{{ role.employmentType }}</span>
            <span class="opacity-50">·</span>
            <span>{{ role.period }}</span>
            <span class="opacity-50">·</span>
            <span>{{ role.duration }}</span>
          </div>
          <p v-if="role.location" class="text-body-md text-on-surface-variant mb-3">{{ role.location }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in role.skills"
              :key="skill"
              class="px-2 py-0.5 text-label-md font-code text-xs uppercase border border-tertiary text-tertiary">
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { WorkExperience } from '@/data/experience'

defineProps<WorkExperience>()
</script>
