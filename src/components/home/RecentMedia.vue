<template>
  <div class="film-strip">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-gutter">
      <template v-if="recent.length">
        <RouterLink
          v-for="(m, i) in recent"
          :key="m.id"
          v-reveal="i * 100"
          :to="`/media/${m.id}`"
          class="group block">
          <div
            class="relative aspect-[2/3] border border-primary bg-surface-variant overflow-hidden group-hover:border-rating-average transition-colors">
            <img
              :src="m.imageUrl"
              :alt="m.title"
              loading="lazy"
              class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-500" />
            <span class="absolute top-2 left-2 w-7 h-7 flex items-center justify-center bg-background border border-primary">
              <span class="material-symbols-outlined text-[16px]">{{ icon(m.type) }}</span>
            </span>
          </div>

          <div
            class="border border-t-0 border-primary bg-surface-container-lowest px-3 py-3 flex flex-col gap-2"
            :class="m.rating >= 9.5 && 'rating-perfect'">
            <div class="flex items-center justify-between gap-2">
              <span class="font-code text-[10px] tracking-widest text-on-surface-variant uppercase">Rating</span>
              <span
                v-if="m.ratingLabel"
                class="font-code text-[10px] font-bold uppercase px-1.5 py-0.5 border truncate"
                :class="[tier(m.rating).text, tier(m.rating).border]">
                {{ m.ratingLabel }}
              </span>
            </div>
            <div class="flex items-baseline gap-1 leading-none" :class="tier(m.rating).text">
              <span class="font-display font-bold tabular-nums text-[44px] tracking-tight" :class="m.rating >= 9.5 && 'rating-perfect-text'">
                {{ m.rating.toFixed(1) }}
              </span>
              <span class="font-code text-sm text-on-surface-variant">/10</span>
            </div>
            <RatingBar :rating="m.rating" />
          </div>

          <div class="mt-3 flex flex-col gap-1">
            <h3 class="font-headline-md text-[16px] uppercase tracking-tight truncate group-hover:text-rating-average transition-colors">
              {{ m.title }}
            </h3>
            <p v-if="watched(m.date)" class="font-code text-xs text-on-surface-variant uppercase flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">calendar_month</span>
              {{ m.type === 'TEXT' ? 'Read' : 'Watched' }} {{ watched(m.date) }}
            </p>
          </div>
        </RouterLink>
      </template>
      <template v-else>
        <div v-for="n in 4" :key="n" class="h-[26rem] border border-outline-variant bg-surface-container animate-pulse"></div>
      </template>
    </div>
  </div>
  <div class="flex justify-end mt-4">
    <RouterLink to="/media" class="font-code text-code uppercase flex items-center gap-1 text-on-surface-variant hover:text-rating-average transition-colors">
      All ratings <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RatingBar from '@/components/ui/RatingBar.vue'
import { useMedia } from '@/composables/useMedia'
import { vReveal } from '@/composables/useReveal'
import { formatDateOnly } from '@/utils/date'

const { items } = useMedia()

const recent = computed(() =>
  [...items.value]
    .filter(m => m.imageUrl)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, 4),
)

const icon = (type: string) => (type === 'TV_SERIES' ? 'tv' : type === 'TEXT' ? 'book' : 'movie')

function watched(date?: string) {
  const [y, m] = formatDateOnly(date).split('-').map(Number)
  if (!y || !m) return ''
  return new Date(y, m - 1, 1).toLocaleString('en', { month: 'short', year: 'numeric' })
}

function tier(rating: number) {
  if (rating >= 9) return { text: 'text-tertiary-text', border: 'border-tertiary' }
  if (rating >= 7) return { text: 'text-rating-good', border: 'border-rating-good' }
  if (rating >= 5) return { text: 'text-rating-average', border: 'border-rating-average' }
  return { text: 'text-error', border: 'border-error' }
}
</script>
