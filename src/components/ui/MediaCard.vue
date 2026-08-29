<template>
  <RouterLink :to="`/media/${id}`" class="block">
    <article
      class="border border-primary bg-surface group flex flex-col relative transition-transform duration-200 brutalist-offset shadow-primary hover:shadow-tertiary brutalist-offset-hover cursor-pointer">
    <div class="h-10 bg-primary flex items-center justify-between px-4">
      <span class="font-code text-label-md text-on-primary">ID: {{ id }}</span>
      <span class="font-code text-label-md text-on-primary flex items-center gap-1">
        <span class="material-symbols-outlined text-[14px]">{{ typeIcon }}</span>
        {{ type }}
      </span>
    </div>
    <div class="p-4 flex gap-4 flex-1">
      <!-- Poster (left, fixed) -->
      <div
        class="w-28 sm:w-36 shrink-0 aspect-[2/3] border border-primary bg-surface-variant relative overflow-hidden group-hover:border-tertiary transition-colors">
        <img :src="imageUrl" :alt="title"
          class="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
      </div>

      <!-- Content (right, flex) -->
      <div class="flex-1 min-w-0 flex flex-col">
        <h2
          class="text-headline-md font-headline-md text-primary mb-1 truncate group-hover:text-tertiary transition-colors">
          {{ title }}
        </h2>
        <div
          class="text-label-md font-code text-on-surface-variant mb-2 flex flex-wrap gap-x-3 gap-y-0.5">
          <span v-for="(item, idx) in meta" :key="idx">{{ item }}</span>
        </div>
        <p class="text-body-md font-body-md text-on-surface-variant line-clamp-2 min-h-[3.25rem]">
          {{ description }}
        </p>
        <div class="mt-auto pt-3 border-t border-primary">
          <div class="flex items-center justify-between mb-2">
            <span class="font-code text-[10px] tracking-widest text-on-surface-variant uppercase">SYSTEM_RATING</span>
            <span
              class="font-code text-[10px] font-bold uppercase px-2 py-0.5 border"
              :class="[tierColor.text, tierColor.border]"
            >{{ ratingLabel }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span
              class="font-code font-bold leading-none shrink-0 tabular-nums"
              style="font-size: 2rem;"
              :class="[tierColor.text, isPerfect && 'rating-perfect-text']"
            >{{ rating.toFixed(1) }}<span class="text-on-surface-variant text-sm font-normal">/10</span></span>
            <RatingBar :rating="rating" class="flex-1" :class="isPerfect && 'rating-perfect'" />
          </div>
          <div class="mt-2 flex items-center justify-end gap-1 font-code text-code text-on-surface-variant group-hover:text-tertiary transition-colors uppercase">
            ANALYZE <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </div>
        </div>
      </div>
    </div>
  </article>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import RatingBar from './RatingBar.vue'

interface Props {
  id: string
  type: 'MOVIE' | 'TV_SERIES' | 'TEXT'
  title: string
  imageUrl: string
  rating: number
  meta: string[]
  description: string
  ratingLabel: string
}

const props = defineProps<Props>()

const typeIcon = computed(() => {
  switch (props.type) {
    case 'MOVIE':
      return 'movie'
    case 'TV_SERIES':
      return 'tv'
    case 'TEXT':
      return 'book'
    default:
      return 'movie'
  }
})

const isPerfect = computed(() => props.rating >= 9.5)

const tierColor = computed(() => {
  if (props.rating >= 9) {
    return { text: 'text-tertiary', border: 'border-tertiary' }
  } else if (props.rating >= 7) {
    return { text: 'text-rating-good', border: 'border-rating-good' }
  } else if (props.rating >= 5) {
    return { text: 'text-rating-average', border: 'border-rating-average' }
  } else {
    return { text: 'text-error', border: 'border-error' }
  }
})
</script>
