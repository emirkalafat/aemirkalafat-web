<template>
  <div class="flex-1 flex flex-col lg:h-screen lg:overflow-hidden">
    <PageHeader :title="analysisTitle">
      <template #filters>
        <div v-if="card" class="flex flex-wrap items-center gap-3">
          <span class="font-code text-code border border-primary px-3 py-1 text-on-surface-variant">ID: {{ card.id }}</span>
          <span class="font-code text-code border border-primary px-3 py-1 text-on-surface-variant">{{ card.type }}{{ card.kind === 'SEASON' ? ` · S${card.seasonNumber}` : '' }}</span>
          <span
            class="font-code text-code border px-3 py-1 flex items-center gap-2"
            :class="card.isCompleted ? 'border-tertiary text-tertiary-text' : 'border-on-surface-variant text-on-surface-variant'"
          >
            <span class="w-2 h-2 inline-block" :class="card.isCompleted ? 'bg-tertiary' : 'bg-on-surface-variant opacity-50'"></span>
            STATE: {{ card.isCompleted ? 'COMPLETED' : 'IN_PROGRESS' }}
          </span>
          <span
            class="font-code text-code border px-3 py-1"
            :class="card.rating >= 9 ? 'border-tertiary text-tertiary-text' : 'border-primary text-primary'"
          >{{ card.ratingLabel }}</span>
        </div>
      </template>
    </PageHeader>

    <section
      class="flex-1 lg:min-h-0 flex flex-col gap-gutter p-margin-mobile lg:p-margin-desktop bg-surface-container-lowest"
      :class="card?.kind === 'SEASON' && siblings.length ? 'pt-gutter lg:pt-gutter' : ''">
      <!-- Not found -->
      <div v-if="!card" class="border border-primary bg-surface p-8 text-center">
        <p class="font-code text-body-md text-on-surface-variant">{{ ready ? '[RECORD_NOT_FOUND]' : 'LOADING_RECORD...' }}</p>
      </div>

      <template v-else>
        <SeasonSwitcher
          v-if="card.kind === 'SEASON' && siblings.length"
          :series-id="card.seriesId!"
          :seasons="siblings"
          :current="card.seasonNumber" />

        <!-- Main 2-column grid (viewport-height locked on lg+) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-1 lg:min-h-0">

          <!-- LEFT COLUMN: Poster -->
          <div class="lg:col-span-4 border border-primary flex flex-col h-full lg:min-h-0">
            <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase">VISUAL_DATA_STREAM</div>
            <div class="flex-1 lg:min-h-0 flex items-center justify-center bg-surface-variant overflow-hidden">
              <img
                :src="card.imageUrl"
                :alt="card.title"
                class="max-h-full max-w-full w-auto h-auto object-contain grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          <!-- RIGHT COLUMN: Metadata, Score, Metrics, Review -->
          <div class="lg:col-span-8 flex flex-col gap-gutter h-full lg:min-h-0">

            <!-- Top Row: Metadata + Score (2-col sub-grid on md+) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">

              <!-- SYS_METADATA -->
              <div class="md:col-span-2 border border-primary bg-surface-container-lowest flex flex-col">
                <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase flex justify-between items-center">
                  <span>SYS_METADATA</span>
                  <a v-if="sourceUrl" :href="sourceUrl" target="_blank" rel="noopener noreferrer"
                    @click="trackMediaSourceClick(card.id, card.title, sourceUrl)"
                    class="bg-tertiary text-on-tertiary px-3 py-1 font-code text-xs uppercase hover:bg-on-tertiary hover:text-tertiary-text transition-colors">
                    VIEW_SOURCE
                  </a>
                </div>
                <div class="p-6 flex-1 flex flex-col">
                  <div class="grid grid-cols-2 gap-x-gutter gap-y-4">
                    <div v-for="[label, value] in metaEntries" :key="label" class="flex flex-col">
                      <p class="font-code text-code text-on-surface-variant uppercase text-xs mb-1">{{ label }}</p>
                      <p class="font-code text-on-surface text-sm">{{ value }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- AGGREGATE_SCORE -->
              <ScoreMeter :key="card.id" :rating="card.rating" :label="card.ratingLabel" class="md:col-span-1" />

            </div>

            <!-- PERFORMANCE_METRICS (if present) -->
            <div v-if="card.metrics" class="border border-primary bg-surface-container-lowest flex flex-col">
              <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase">PERFORMANCE_METRICS</div>
              <div class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
                  <div v-for="[label, value] in metricEntries" :key="label" class="flex flex-col">
                    <div class="flex justify-between font-code text-code mb-2 mb-3">
                      <span class="text-on-surface-variant uppercase text-xs">{{ label }}</span>
                      <span class="text-tertiary-text font-bold">{{ value }}%</span>
                    </div>
                    <div class="h-2 bg-surface-container-high w-full">
                      <div class="h-2 bg-tertiary" :style="`width: ${value}%`"></div>
                    </div>
                  </div>
                </div>
                <div class="border-t border-primary mt-6 pt-4 font-code text-code text-on-surface-variant flex flex-col gap-1 text-xs">
                  <p>LAST_ACCESS: {{ card.date }}</p>
                  <p :class="card.isCompleted ? 'text-tertiary-text' : 'text-on-surface-variant'">
                    STATE: {{ card.isCompleted ? 'COMPLETED ✓' : 'IN_PROGRESS' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- CORE_REVIEW.LOG (flex-1 to fill remaining space with internal scroll) -->
            <div class="flex-1 lg:min-h-0 border border-primary bg-surface-container-lowest flex flex-col" style="border-left-width: 4px; border-left-color: #BD00FF;">

              <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase">CORE_REVIEW.LOG</div>
              <div class="flex-1 lg:min-h-0 overflow-y-auto p-6 flex flex-col gap-4">
                <p
                  v-for="(line, i) in descriptionLines"
                  :key="i"
                  class="font-body-md text-body-md text-on-surface leading-[1.8]"
                >
                  {{ line }}
                </p>
              </div>
            </div>

          </div>

        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/ui/PageHeader.vue'
import ScoreMeter from '@/components/ui/ScoreMeter.vue'
import SeasonSwitcher from '@/components/media/SeasonSwitcher.vue'
import { useMedia } from '@/composables/useMedia'
import { useAnalytics } from '@/composables/useAnalytics'
import { seasonDocId, seasonsOf } from '@/utils/media'

const route = useRoute()
const media = useMedia()
const { ready } = media

// /media/:id/s/:season maps to the flat season document `${id}-s${season}`.
const cardId = computed(() =>
  route.params.season ? seasonDocId(String(route.params.id), Number(route.params.season)) : String(route.params.id),
)
const card = computed(() => media.items.value.find(c => c.id === cardId.value))
const series = computed(() => (card.value?.kind === 'SEASON' ? media.getById(card.value.seriesId ?? '') : undefined))
const siblings = computed(() =>
  card.value?.kind === 'SEASON' ? seasonsOf(media.items.value, card.value.seriesId ?? '') : [],
)
const sourceUrl = computed(() => series.value?.externalUrl ?? card.value?.externalUrl)

const { trackMediaView, trackMediaSourceClick } = useAnalytics()
watch(card, c => {
  if (c) trackMediaView(c.id, c.title, c.type, c.seasonNumber)
}, { immediate: true })

const analysisTitle = computed(() => {
  const c = card.value
  if (!c) return 'MEDIA_ANALYSIS'
  return c.kind === 'SEASON' ? `${c.title} · S${c.seasonNumber}` : c.title
})

const descriptionLines = computed(() => {
  if (!card.value) return []
  return card.value.description.split(/\n+/).map(s => s.trim()).filter(Boolean)
})

const metricEntries = computed((): [string, number][] => {
  if (!card.value?.metrics) return []
  return [
    ['NARRATIVE_ARCH', card.value.metrics.narrativeArch],
    ['AESTHETIC_EXEC', card.value.metrics.aestheticExec],
    ['COHERENCE_RATING', card.value.metrics.coherenceRating],
  ]
})

const metaEntries = computed((): [string, string][] => {
  const c = card.value
  if (!c) return []
  const entries: [string, string][] = []
  const isSeason = c.kind === 'SEASON'

  if (isSeason) {
    entries.push(['SERIES', c.title])
    entries.push(['SEASON', `${c.seasonNumber}${c.seasonTitle ? ` — ${c.seasonTitle}` : ''}`])
    if (c.episodeCount) entries.push(['EPISODES', String(c.episodeCount)])
  }
  for (const item of isSeason ? series.value?.meta ?? [] : c.meta) {
    const colonIndex = item.indexOf(': ')
    if (colonIndex !== -1) entries.push([item.substring(0, colonIndex), item.substring(colonIndex + 2)])
    else entries.push(['', item])
  }
  entries.push(['TYPE', c.type])
  entries.push([isSeason ? 'WATCHED' : 'DATE', c.date])
  return entries
})
</script>
