<template>
  <div class="flex-1 flex flex-col">
    <PageHeader :title="card.title">
      <template #filters>
        <div class="flex flex-wrap items-center gap-3">
          <span class="font-code text-code border border-primary px-3 py-1 text-on-surface-variant">TV_SERIES</span>
          <span class="font-code text-code border border-primary px-3 py-1 text-on-surface-variant">
            {{ seasons.length }}{{ card.totalSeasons ? ` / ${card.totalSeasons}` : '' }} SEASONS
          </span>
          <span
            class="font-code text-code border px-3 py-1 flex items-center gap-2"
            :class="card.isCompleted ? 'border-tertiary text-tertiary-text' : 'border-on-surface-variant text-on-surface-variant'">
            <span class="w-2 h-2 inline-block" :class="card.isCompleted ? 'bg-tertiary' : 'bg-on-surface-variant opacity-50'"></span>
            STATE: {{ card.isCompleted ? 'COMPLETED' : 'IN_PROGRESS' }}
          </span>
          <a
            v-if="card.externalUrl"
            :href="card.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            @click="trackMediaSourceClick(card.id, card.title, card.externalUrl)"
            class="bg-tertiary text-on-tertiary px-3 py-1 font-code text-xs uppercase hover:bg-on-tertiary hover:text-tertiary-text transition-colors">
            VIEW_SOURCE
          </a>
        </div>
      </template>
    </PageHeader>

    <section class="flex-1 p-margin-mobile lg:p-margin-desktop bg-surface-container-lowest">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <!-- Poster -->
        <div class="lg:col-span-4 border border-primary flex flex-col self-start">
          <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase">VISUAL_DATA_STREAM</div>
          <div class="bg-surface-variant flex items-center justify-center overflow-hidden">
            <img
              :src="card.imageUrl"
              :alt="card.title"
              class="w-full h-auto object-contain grayscale hover:grayscale-0 transition-all duration-500" />
          </div>
        </div>

        <div class="lg:col-span-8 flex flex-col gap-gutter min-w-0">
          <!-- Stats + overall score -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div class="md:col-span-2 border border-primary bg-surface-container-lowest flex flex-col">
              <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase">SERIES_STATS</div>
              <div class="p-6 flex flex-col gap-5">
                <div class="grid grid-cols-2 gap-x-gutter gap-y-4">
                  <div v-for="[label, value] in statEntries" :key="label" class="flex flex-col">
                    <p class="font-code text-on-surface-variant uppercase text-xs mb-1">{{ label }}</p>
                    <p class="font-code text-on-surface text-sm">{{ value }}</p>
                  </div>
                </div>
                <div v-if="card.totalSeasons">
                  <div class="flex justify-between font-code text-xs text-on-surface-variant uppercase mb-2">
                    <span>WATCH_PROGRESS</span>
                    <span>{{ seasons.length }} / {{ card.totalSeasons }}</span>
                  </div>
                  <div class="h-2 bg-surface-container-high w-full">
                    <div
                      class="h-2 bg-tertiary transition-[width] duration-700"
                      :style="{ width: `${Math.min(100, (seasons.length / card.totalSeasons) * 100)}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
            <ScoreMeter
              :key="card.id + overall"
              :rating="overall"
              :label="card.ratingLabel || tierLabel(overall)"
              class="md:col-span-1" />
          </div>

          <!-- Season trajectory -->
          <div v-if="seasons.length" class="border border-primary bg-surface-container-lowest flex flex-col">
            <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase">SEASON_TRAJECTORY</div>
            <div class="p-6">
              <div class="flex items-end gap-3 h-48">
                <template v-for="col in trajectory" :key="col.number">
                  <RouterLink
                    v-if="col.season"
                    :to="mediaRoute(col.season)"
                    class="group flex-1 min-w-0 max-w-[6rem] h-full flex flex-col justify-end items-center gap-1"
                    :title="`Season ${col.number}: ${col.season.rating}`">
                    <span class="font-code text-xs font-bold tabular-nums" :class="tierOf(col.season.rating).text">
                      {{ col.season.rating.toFixed(1) }}
                    </span>
                    <span
                      class="w-full transition-[height] duration-700 ease-out group-hover:brightness-125"
                      :class="tierOf(col.season.rating).bg"
                      :style="{
                        height: grown ? `${Math.max(col.season.rating * 10, 6)}%` : '0%',
                        transitionDelay: `${col.number * 80}ms`,
                      }"></span>
                  </RouterLink>
                  <div
                    v-else
                    class="flex-1 min-w-0 max-w-[6rem] h-full flex flex-col justify-end items-center gap-1"
                    :title="`Season ${col.number}: not watched yet`">
                    <span class="font-code text-xs text-on-surface-variant">—</span>
                    <span class="w-full h-[12%] border border-dashed border-outline-variant"></span>
                  </div>
                </template>
              </div>
              <div class="flex gap-3 mt-2">
                <div
                  v-for="col in trajectory"
                  :key="col.number"
                  class="flex-1 min-w-0 max-w-[6rem] text-center font-code text-xs text-on-surface-variant">
                  <p class="font-bold text-on-surface">S{{ col.number }}</p>
                  <p>{{ col.season ? year(col.season.date) : '' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Verdict -->
          <div
            v-if="verdictLines.length"
            class="border border-primary bg-surface-container-lowest flex flex-col"
            style="border-left-width: 4px; border-left-color: rgb(var(--color-cyber-purple));">
            <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase">SERIES_VERDICT</div>
            <div class="p-6 flex flex-col gap-4">
              <p v-for="(line, i) in verdictLines" :key="i" class="font-body-md text-body-md text-on-surface leading-[1.8]">
                {{ line }}
              </p>
            </div>
          </div>

          <!-- Seasons -->
          <div class="flex flex-col gap-gutter">
            <h2 class="font-code text-code text-on-surface-variant uppercase tracking-widest">SEASON_NOTES</h2>
            <RouterLink
              v-for="s in seasons"
              :key="s.id"
              :to="mediaRoute(s)"
              class="group flex gap-4 border border-primary bg-surface p-4 brutalist-offset shadow-primary hover:shadow-tertiary brutalist-offset-hover transition-[transform,box-shadow] duration-200">
              <div
                class="w-20 md:w-24 shrink-0 aspect-[2/3] border border-primary bg-surface-variant overflow-hidden group-hover:border-tertiary transition-colors">
                <img
                  :src="s.imageUrl || card.imageUrl"
                  :alt="`Season ${s.seasonNumber}`"
                  loading="lazy"
                  class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <div class="flex-1 min-w-0 flex flex-col gap-2">
                <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 class="font-headline-md text-[20px] uppercase tracking-tight group-hover:text-tertiary-text transition-colors">
                    S{{ s.seasonNumber }} — {{ s.seasonTitle || `Season ${s.seasonNumber}` }}
                  </h3>
                  <p class="font-code text-xs text-on-surface-variant uppercase flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">calendar_month</span>
                    Watched {{ formatMonthYear(s.date) }}<template v-if="s.episodeCount"> · {{ s.episodeCount }} eps</template>
                  </p>
                </div>
                <p class="font-body-md text-body-md text-on-surface-variant line-clamp-3">
                  {{ s.summary || firstParagraph(s.description) }}
                </p>
                <div class="mt-auto pt-3 border-t border-outline-variant flex flex-wrap items-center gap-4">
                  <span class="font-display font-bold text-[32px] leading-none tabular-nums" :class="tierOf(s.rating).text">
                    {{ s.rating.toFixed(1) }}<span class="font-code text-sm font-normal text-on-surface-variant">/10</span>
                  </span>
                  <span
                    v-if="s.ratingLabel"
                    class="font-code text-[10px] font-bold uppercase px-2 py-0.5 border"
                    :class="[tierOf(s.rating).text, tierOf(s.rating).border]">
                    {{ s.ratingLabel }}
                  </span>
                  <RatingBar :rating="s.rating" class="flex-1 min-w-[6rem]" />
                  <span class="font-code text-code uppercase text-on-surface-variant group-hover:text-tertiary-text transition-colors flex items-center gap-1">
                    Full review <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </RouterLink>
            <div v-if="!seasons.length" class="border border-primary bg-surface p-8 text-center">
              <p class="font-code text-body-md text-on-surface-variant">[NO_SEASONS_RATED_YET]</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import ScoreMeter from '@/components/ui/ScoreMeter.vue'
import RatingBar from '@/components/ui/RatingBar.vue'
import { useMedia } from '@/composables/useMedia'
import { useAnalytics } from '@/composables/useAnalytics'
import type { MediaCardData } from '@/data/media'
import { averageRating, formatMonthYear, mediaRoute, seasonsOf, tierLabel, tierOf } from '@/utils/media'

const props = defineProps<{ card: MediaCardData }>()

const { items } = useMedia()
const { trackMediaView, trackMediaSourceClick } = useAnalytics()

watch(() => props.card.id, () => trackMediaView(props.card.id, props.card.title, props.card.type), { immediate: true })

const seasons = computed(() => seasonsOf(items.value, props.card.id))
const avg = computed(() => averageRating(seasons.value))
const overall = computed(() => props.card.ratingOverride ?? avg.value ?? props.card.rating)

const grown = ref(false)
onMounted(() => setTimeout(() => (grown.value = true), 60))

const year = (date: string) => (date ?? '').slice(0, 4)

const trajectory = computed(() => {
  const total = Math.max(props.card.totalSeasons ?? 0, ...seasons.value.map(s => s.seasonNumber ?? 0))
  return Array.from({ length: total }, (_, i) => ({
    number: i + 1,
    season: seasons.value.find(s => s.seasonNumber === i + 1),
  }))
})

const statEntries = computed((): [string, string][] => {
  const list = seasons.value
  const entries: [string, string][] = []
  if (avg.value != null) entries.push(['AVG_OF_SEASONS', `${avg.value.toFixed(1)} / 10`])
  if (props.card.ratingOverride != null) entries.push(['MY_OVERALL', `${props.card.ratingOverride.toFixed(1)} / 10`])
  if (list.length) {
    const best = list.reduce((a, b) => (b.rating > a.rating ? b : a))
    const worst = list.reduce((a, b) => (b.rating < a.rating ? b : a))
    entries.push(['BEST_SEASON', `S${best.seasonNumber} · ${best.rating.toFixed(1)}`])
    entries.push(['WEAKEST_SEASON', `S${worst.seasonNumber} · ${worst.rating.toFixed(1)}`])
    const years = list.map(s => Number(year(s.date))).filter(Boolean)
    if (years.length) {
      const min = Math.min(...years)
      const max = Math.max(...years)
      entries.push(['WATCHED_SPAN', min === max ? String(min) : `${min} – ${max}`])
    }
  }
  entries.push(['SEASONS_RATED', String(list.length)])
  return entries
})

const verdictLines = computed(() =>
  (props.card.description ?? '').split(/\n+/).map(s => s.trim()).filter(Boolean),
)

const firstParagraph = (text: string) => (text ?? '').split(/\n+/).find(Boolean) ?? ''
</script>
