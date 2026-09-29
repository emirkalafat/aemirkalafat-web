<template>
  <nav aria-label="Seasons" class="border border-primary bg-surface-container-lowest flex flex-wrap items-center gap-2 p-2">
    <RouterLink
      :to="`/media/${seriesId}`"
      class="font-code text-xs uppercase px-3 py-2 border border-primary hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-1">
      <span class="material-symbols-outlined text-[14px]">tv</span>
      Series overview
    </RouterLink>
    <span class="w-px h-6 bg-outline-variant mx-1" aria-hidden="true"></span>
    <RouterLink
      v-for="s in seasons"
      :key="s.id"
      :to="mediaRoute(s)"
      :aria-current="s.seasonNumber === current ? 'page' : undefined"
      class="font-code text-xs uppercase px-3 py-2 border transition-colors flex items-center gap-2"
      :class="s.seasonNumber === current
        ? 'bg-primary text-on-primary border-primary'
        : 'border-outline-variant text-on-surface hover:border-primary'">
      S{{ s.seasonNumber }}
      <span class="w-2 h-2 shrink-0" :class="tierOf(s.rating).bg"></span>
      <span class="tabular-nums">{{ s.rating.toFixed(1) }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import type { MediaCardData } from '@/data/media'
import { mediaRoute, tierOf } from '@/utils/media'

defineProps<{ seriesId: string; seasons: MediaCardData[]; current?: number }>()
</script>
