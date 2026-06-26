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

type FilterType = 'MOVIE' | 'TV_SERIES' | 'TEXT' | null

const activeFilter = ref<FilterType>(null)
const searchQuery = ref('')

interface MediaCardData {
  id: string
  type: 'MOVIE' | 'TV_SERIES' | 'TEXT'
  title: string
  imageUrl: string
  rating: number
  meta: string[]
  description: string
  ratingLabel: string
  date: string
}

const mediaCards: MediaCardData[] = [
  {
    id: 'MR-992',
    type: 'MOVIE',
    title: 'NEUROMANCER_V2',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRFlyTnLHLDTro8-vjsS8VnN0It0G59eKzggzSHixXSzqDOnRrbMut2N20YqVZ-XZkhao41SacZz07AfJz27YVFZpcIvVuKCXvg7NcrrMdgxswBBqs4UmNJUOmAazPg6XIkNAZrpmsJ3Mt-XF2EaPGMZfaPgza1HIIij9UaHCCKHz4SxeuR1mPqWApMgeJjUHztTvzXwhRhttrBKXEKJkmoMfaq82JtSj59tVnCMTojunQ-haid8iQT6v7sWQ_huwQQHMXF3F7nOA',
    rating: 9.2,
    meta: ['DIR: G. GIBSON', 'YEAR: 2042'],
    description: 'Exceptional execution of the classic source material. The visual architecture relies heavily on stark contrasts and hard-edged polygonal geometries. Pacing algorithms are optimal.',
    ratingLabel: 'EXCELLENT',
    date: '2024-10-12',
  },
  {
    id: 'MR-993',
    type: 'TV_SERIES',
    title: 'SEVERANCE_PROTOCOL',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUMw8B3VhclQKbZhGlPwh5hiGsuCvbzdLUi8SeCM9TdSMLbtlUp39RJBQarmoJ5ZQROJw027v1Ow4fnKGnR5z2KPwvzRO_WqpUGwAAEAAXmDUxfnfI3wAT09Dm7HxxjTWOY3Mwb0_jr_4BcREb4vvtxaXMma4zZgh0aiPD8qwgtedsfMJB5xKNqTR41dr8a9Xx4idiQFS7xDwxE_MXX6ClG6cupabL9xzlPmnw2zibAuXYmrIcLGmehdWCmFFhgx7uqzyP8i1Flxo',
    rating: 7.8,
    meta: ['S1: 9 EPS', 'YEAR: 2024'],
    description: 'Narrative loops are intriguing but exhibit minor memory leaks in the mid-season. Set design effectively leverages liminal aesthetics to induce psychological unease.',
    ratingLabel: 'ACCEPTABLE',
    date: '2024-09-05',
  },
  {
    id: 'MR-994',
    type: 'TEXT',
    title: 'THE_THREE_BODY',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFM9QpAYRs6L243J4Qq413E6_skEwmNXGhVkV3D0Xi9ey0k3oP32-ASzpC6SwaKH_pA7wD8Hf-BLVgBGQmlln860_GuETQArBv-NuueEbfl5OI8QokkYj6MJaN4blvaRipfHYJbHacw2yhfGXMI8ZvMTERfVarNXnK93mOeJwjKxSY6cfIZMclf5iKRfAGQZqiBBoSEIE30IWxriql9ieW4MTG0mep7EvMRS3oEP0Ydv0ucrqNgfb9TXC1LTH8H0DMBmqfG4c2_G8',
    rating: 9.8,
    meta: ['AUTHOR: C. LIU', 'PAGES: 400'],
    description: 'Flawless hard-sci-fi logic framework. The extrapolation of physics into macro-scale societal engineering is rendered with terrifying precision. A must-compile text.',
    ratingLabel: 'CRITICAL',
    date: '2024-10-24',
  },
  {
    id: 'MR-991',
    type: 'MOVIE',
    title: 'BLADE_RUNNER_2049',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIZpsD6YA5sM-VM4ujCUqIfd2svR7EMTTZjFNdKfU50zcrNpu38c9iMxzJReKhD9647Lnjw7p-Md9l2RUvA0CZ22OZHPSh44KUsr5ryZkBLDQSZtS8x3Gs6ENaRceG953UiRc0UBkuP3TH3NQzfkARFwntOLE0Fmy_G0K6ctHX7lAIgiDkYFuh5oNWiFx73juCjMAyHI1Cl07DD7ELM3xRzedxtrKvXhVpTnVLaGJqhvBpai6QI9i2Vt4ZcQQI',
    rating: 8.5,
    meta: ['DIR: D. VILLENEUVE', 'YEAR: 2017'],
    description: 'Color grading audit: High fidelity. Narrative coherence: Sustained. Atmospheric pressure optimal for deep-dive diagnostics.',
    ratingLabel: 'SOLID',
    date: '2024-08-15',
  },
]

const filteredCards = computed(() => {
  return mediaCards.filter(card => {
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
