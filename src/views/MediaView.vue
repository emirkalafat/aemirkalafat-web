<template>
  <div class="flex-1 flex flex-col">
    <PageHeader
      title="MEDIA_REVIEWS.LOG"
      description="My personal log of movies, TV series, and books — rated and reviewed as I watch and read them, with honest notes on what's worth your time."
    >
      <template #filters>
        <div class="flex flex-wrap gap-4 items-center font-code text-label-md">
          <button
            @click="selectFilter(null)"
            :class="[
              'border border-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase flex items-center gap-2',
              activeFilter === null ? 'bg-tertiary border-tertiary text-[#1a1a1a]' : 'text-primary'
            ]"
          ><span class="material-symbols-outlined text-[16px]">select_all</span> ALL_RECORDS</button>
          <button
            @click="selectFilter('MOVIE')"
            :class="[
              'border border-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase flex items-center gap-2',
              activeFilter === 'MOVIE' ? 'bg-tertiary border-tertiary text-[#1a1a1a]' : 'text-primary'
            ]"
          ><span class="material-symbols-outlined text-[16px]">movie</span> MOVIES</button>
          <button
            @click="selectFilter('TV_SERIES')"
            :class="[
              'border border-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase flex items-center gap-2',
              activeFilter === 'TV_SERIES' ? 'bg-tertiary border-tertiary text-[#1a1a1a]' : 'text-primary'
            ]"
          ><span class="material-symbols-outlined text-[16px]">tv</span> TV_SERIES</button>
          <button
            @click="selectFilter('TEXT')"
            :class="[
              'border border-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase flex items-center gap-2',
              activeFilter === 'TEXT' ? 'bg-tertiary border-tertiary text-[#1a1a1a]' : 'text-primary'
            ]"
          ><span class="material-symbols-outlined text-[16px]">book</span> TEXT_DATA</button>
          <div class="ml-auto w-full md:w-auto mt-4 md:mt-0 flex border border-primary bg-background focus-within:border-tertiary transition-colors">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="QUERY_RECORDS..."
              class="bg-transparent border-none text-on-surface text-body-md font-code py-2 px-3 focus:ring-0 w-full md:w-64 outline-none"
            />
            <button class="px-3 text-primary hover:text-tertiary-text transition-colors border-l border-primary">
              <span class="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 items-center font-code text-label-md mt-4 pt-4 border-t border-outline-variant">
          <span class="text-on-surface-variant uppercase text-xs tracking-widest mr-1">SCORE_FILTER:</span>
          <button
            v-for="rf in RATING_FILTERS"
            :key="rf.value"
            @click="selectRatingFilter(rf.value)"
            :title="`Rating ${rf.range}`"
            :class="[
              'border px-3 py-1.5 transition-colors uppercase flex items-center gap-1.5 text-xs',
              activeRatingFilter === rf.value
                ? [rf.activeBg, rf.activeBorder, 'text-[#1a1a1a]']
                : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
            ]"
          >
            <span class="material-symbols-outlined text-[14px]">{{ rf.icon }}</span>
            {{ rf.label }}
            <span class="opacity-60">{{ rf.range }}</span>
          </button>
        </div>
      </template>
    </PageHeader>

    <section class="flex-1 p-margin-mobile lg:p-margin-desktop bg-surface-container-lowest">
      <div class="relative border-l-2 border-primary ml-4 pl-8 flex flex-col gap-16">
        <div v-for="group in groupedCards" :key="group.label" class="relative">
          <div
            class="absolute -left-[41px] top-0 w-4 h-4 border-2 border-primary"
            :class="group.isLatest ? 'bg-tertiary' : 'bg-surface'"
          ></div>
          <div
            class="font-code text-label-md mb-6"
            :class="group.isLatest ? 'text-tertiary-text' : 'text-on-surface-variant'"
          >{{ group.label }}</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <MediaCard
              v-for="card in group.cards"
              :key="card.id"
              :id="card.id"
              :type="card.type"
              :title="card.title"
              :imageUrl="card.imageUrl"
              :rating="card.rating"
              :meta="card.meta"
              :description="card.description"
              :ratingLabel="card.ratingLabel"
            />
          </div>
        </div>
        <div v-if="groupedCards.length === 0" class="border border-primary bg-surface p-8 text-center">
          <p class="text-body-md font-code text-on-surface-variant">[NO_RECORDS_FOUND]</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import MediaCard from '@/components/ui/MediaCard.vue'
import { useMedia } from '@/composables/useMedia'
import { useAnalytics } from '@/composables/useAnalytics'
import type { MediaCardData } from '@/data/media'

const media = useMedia()
const { trackFilterSelect, trackSearch } = useAnalytics()

type FilterType = 'MOVIE' | 'TV_SERIES' | 'TEXT' | null
type RatingTier = 'BAD' | 'AVERAGE' | 'GOOD' | 'GREAT'

const activeFilter = ref<FilterType>(null)
const activeRatingFilter = ref<RatingTier | null>(null)
const searchQuery = ref('')

// Sabit puan aralıkları — admin panelden değiştirilemez, ScoreMeter/RatingBar/MediaCard
// bileşenlerindeki renk kademeleriyle (kötü/ortalama/güzel/harika) birebir eşleşir.
const RATING_FILTERS: { value: RatingTier; label: string; range: string; icon: string; activeBg: string; activeBorder: string }[] = [
  { value: 'BAD', label: 'BAD', range: '1-4', icon: 'sentiment_dissatisfied', activeBg: 'bg-error', activeBorder: 'border-error' },
  { value: 'AVERAGE', label: 'AVERAGE', range: '5-6', icon: 'sentiment_neutral', activeBg: 'bg-rating-average', activeBorder: 'border-rating-average' },
  { value: 'GOOD', label: 'GOOD', range: '7-8', icon: 'sentiment_satisfied', activeBg: 'bg-rating-good', activeBorder: 'border-rating-good' },
  { value: 'GREAT', label: 'GREAT', range: '9-10', icon: 'stars', activeBg: 'bg-tertiary', activeBorder: 'border-tertiary' },
]

function ratingTier(rating: number): RatingTier {
  if (rating >= 9) return 'GREAT'
  if (rating >= 7) return 'GOOD'
  if (rating >= 5) return 'AVERAGE'
  return 'BAD'
}

function selectFilter(value: FilterType) {
  activeFilter.value = value
  trackFilterSelect('media', value ?? 'ALL')
}

function selectRatingFilter(value: RatingTier) {
  activeRatingFilter.value = activeRatingFilter.value === value ? null : value
  trackFilterSelect('media', `rating:${activeRatingFilter.value ?? 'ALL'}`)
}

const filteredCards = computed(() => {
  return media.items.value.filter(card => {
    const matchesFilter = !activeFilter.value || card.type === activeFilter.value
    const matchesRating = !activeRatingFilter.value || ratingTier(card.rating) === activeRatingFilter.value
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = !q || card.title.toLowerCase().includes(q) || card.description.toLowerCase().includes(q)
    return matchesFilter && matchesRating && matchesSearch
  })
})

watch(searchQuery, q => trackSearch('media', q, filteredCards.value.length))

const groupedCards = computed(() => {
  const groups = new Map<string, { label: string; cards: MediaCardData[] }>()
  for (const card of filteredCards.value) {
    const d = new Date(card.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
    if (!groups.has(key)) groups.set(key, { label, cards: [] })
    groups.get(key)!.cards.push(card)
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, val], i) => ({ ...val, isLatest: i === 0 }))
})
</script>
