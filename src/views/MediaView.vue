<template>
  <div class="flex-1 flex flex-col">
    <PageHeader
      title="MEDIA_REVIEWS.LOG"
      description="Structured analysis of visual and textual data streams. Evaluating narrative architecture, aesthetic execution, and systemic coherence across multiple media formats."
    >
      <template #filters>
        <div class="flex flex-wrap gap-4 items-center font-code text-label-md">
          <button
            @click="activeFilter = null"
            :class="[
              'border border-primary text-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase',
              { 'bg-tertiary text-on-tertiary border-tertiary': activeFilter === null }
            ]"
          >[*] ALL_RECORDS</button>
          <button
            @click="activeFilter = 'MOVIE'"
            :class="[
              'border border-primary text-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase flex items-center gap-2',
              { 'bg-tertiary text-on-tertiary border-tertiary': activeFilter === 'MOVIE' }
            ]"
          ><span class="material-symbols-outlined text-[16px]">movie</span> MOVIES</button>
          <button
            @click="activeFilter = 'TV_SERIES'"
            :class="[
              'border border-primary text-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase flex items-center gap-2',
              { 'bg-tertiary text-on-tertiary border-tertiary': activeFilter === 'TV_SERIES' }
            ]"
          ><span class="material-symbols-outlined text-[16px]">tv</span> TV_SERIES</button>
          <button
            @click="activeFilter = 'TEXT'"
            :class="[
              'border border-primary text-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase flex items-center gap-2',
              { 'bg-tertiary text-on-tertiary border-tertiary': activeFilter === 'TEXT' }
            ]"
          ><span class="material-symbols-outlined text-[16px]">book</span> TEXT_DATA</button>
          <div class="ml-auto w-full md:w-auto mt-4 md:mt-0 flex border border-primary bg-background focus-within:border-tertiary transition-colors">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="QUERY_RECORDS..."
              class="bg-transparent border-none text-on-surface text-body-md font-code py-2 px-3 focus:ring-0 w-full md:w-64 outline-none"
            />
            <button class="px-3 text-primary hover:text-tertiary transition-colors border-l border-primary">
              <span class="material-symbols-outlined">search</span>
            </button>
          </div>
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
            :class="group.isLatest ? 'text-tertiary' : 'text-on-surface-variant'"
          >{{ group.label }}</div>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
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
import { ref, computed } from 'vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import MediaCard from '@/components/ui/MediaCard.vue'
import { useMedia } from '@/composables/useMedia'
import type { MediaCardData } from '@/data/media'

const media = useMedia()

type FilterType = 'MOVIE' | 'TV_SERIES' | 'TEXT' | null

const activeFilter = ref<FilterType>(null)
const searchQuery = ref('')

const filteredCards = computed(() => {
  return media.items.value.filter(card => {
    const matchesFilter = !activeFilter.value || card.type === activeFilter.value
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = !q || card.title.toLowerCase().includes(q) || card.description.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })
})

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
