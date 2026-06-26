<template>
  <article class="border border-primary bg-surface group flex flex-col relative transition-transform duration-200 brutalist-offset shadow-primary hover:shadow-tertiary brutalist-offset-hover">
    <div class="h-10 bg-primary flex items-center justify-between px-4">
      <span class="font-code text-label-md text-on-primary">ID: {{ id }}</span>
      <span class="font-code text-label-md text-on-primary flex items-center gap-1">
        <span class="material-symbols-outlined text-[14px]">{{ typeIcon }}</span>
        {{ type }}
      </span>
    </div>
    <div class="p-4 flex flex-col flex-1">
      <div class="aspect-[16/9] w-full border border-primary bg-surface-variant mb-4 relative overflow-hidden group-hover:border-tertiary transition-colors">
        <img
          :src="imageUrl"
          :alt="title"
          class="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        <div class="absolute top-2 right-2 bg-background border border-primary px-2 py-1 font-code text-label-md font-bold text-tertiary">
          {{ rating }}/10
        </div>
      </div>
      <h2 class="text-headline-md font-headline-md text-primary mb-2 truncate group-hover:text-tertiary transition-colors">
        {{ title }}
      </h2>
      <div class="text-label-md font-code text-on-surface-variant mb-4 flex gap-4 border-b border-surface-container-high pb-4">
        <span v-for="(item, idx) in meta" :key="idx">{{ item }}</span>
      </div>
      <p class="text-body-md font-body-md text-on-surface-variant line-clamp-3 mb-6">
        {{ description }}
      </p>
      <div class="mt-auto pt-4 border-t border-primary">
        <div class="flex justify-between font-code text-label-md mb-2">
          <span class="text-primary">SYSTEM_RATING</span>
          <span :class="ratingClass">{{ ratingLabel }}</span>
        </div>
        <RatingBar :rating="rating" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

const ratingClass = computed(() => {
  if (props.rating >= 9) {
    return 'text-tertiary'
  } else if (props.rating >= 7) {
    return 'text-primary-fixed-dim'
  } else {
    return 'text-error'
  }
})
</script>
