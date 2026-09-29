<template>
  <section v-if="state !== 'error'" class="flex flex-col gap-10">
    <SectionHeading index="03" title="Commits.Graph()" accent="tertiary" />

    <div v-reveal class="border border-tertiary bg-surface-container-lowest brutalist-offset shadow-tertiary">
      <div class="bg-on-surface text-background px-4 py-2 flex flex-wrap items-center justify-between gap-2 font-code text-code">
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px]">commit</span>
          github.com/{{ USERNAME }}
        </span>
        <span v-if="stats" class="opacity-80">{{ stats.total }} contributions · last 12 months</span>
      </div>

      <div class="p-5 overflow-x-auto">
        <div v-if="state === 'loading'" class="h-[140px] animate-pulse bg-surface-container"></div>
        <div v-else class="min-w-max">
          <div class="grid gap-[3px] mb-2 font-code text-xs text-on-surface-variant" :style="{ gridTemplateColumns: `repeat(${weeks.length}, 11px)` }">
            <span v-for="m in monthLabels" :key="m.col" class="whitespace-nowrap" :style="{ gridColumnStart: m.col + 1 }">{{ m.label }}</span>
          </div>
          <div class="grid grid-flow-col gap-[3px]" style="grid-template-rows: repeat(7, 11px)">
            <template v-for="(week, w) in weeks" :key="w">
              <span
                v-for="(day, d) in week"
                :key="d"
                class="gh-cell block w-[11px] h-[11px]"
                :class="day ? levelClass[day.level] : 'opacity-0'"
                :style="{ '--col': w }"
                :title="day ? `${day.count} contributions on ${day.date}` : undefined"></span>
            </template>
          </div>
        </div>
      </div>

      <div class="border-t border-outline-variant px-5 py-3 flex flex-wrap items-center justify-between gap-3 font-code text-code text-on-surface-variant">
        <div v-if="stats" class="flex flex-wrap gap-x-6 gap-y-1">
          <span>longest streak <b class="text-tertiary-text">{{ stats.streak }}d</b></span>
          <span>active days <b class="text-tertiary-text">{{ stats.activeDays }}</b></span>
          <span>best day <b class="text-tertiary-text">{{ stats.best }}</b></span>
        </div>
        <div class="flex items-center gap-1 text-xs ml-auto">
          less
          <span v-for="l in 5" :key="l" class="block w-[11px] h-[11px]" :class="levelClass[l - 1]"></span>
          more
        </div>
      </div>

      <div class="border-t border-outline-variant px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p class="font-code text-code text-on-surface-variant">
          Repositories, pull requests and everything behind these squares.
        </p>
        <a
          :href="`https://github.com/${USERNAME}`"
          target="_blank"
          rel="noopener"
          class="shrink-0 flex items-center justify-center gap-2 bg-tertiary text-on-tertiary font-label-md text-label-md px-6 py-3 uppercase border border-primary brutalist-offset shadow-primary brutalist-offset-hover transition-[transform,box-shadow] duration-200"
          @click="trackSocialClick('github', 'activity')">
          <span class="material-symbols-outlined text-[18px]">code</span>
          Open GitHub profile
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SectionHeading from '@/components/home/SectionHeading.vue'
import { vReveal } from '@/composables/useReveal'
import { useAnalytics } from '@/composables/useAnalytics'

interface Day {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

const USERNAME = 'emirkalafat'
const { trackSocialClick } = useAnalytics()

const levelClass = [
  'bg-surface-container-high',
  'bg-tertiary/25',
  'bg-tertiary/50',
  'bg-tertiary/75',
  'bg-tertiary',
]

const state = ref<'loading' | 'ready' | 'error'>('loading')
const days = ref<Day[]>([])

onMounted(async () => {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`)
    if (!res.ok) throw new Error(String(res.status))
    const json = (await res.json()) as { contributions: Day[] }
    if (!json.contributions?.length) throw new Error('empty')
    days.value = json.contributions
    state.value = 'ready'
  } catch {
    state.value = 'error'
  }
})

const weeks = computed<(Day | null)[][]>(() => {
  const first = days.value[0]
  if (!first) return []
  const padded: (Day | null)[] = Array(new Date(`${first.date}T00:00:00`).getDay()).fill(null)
  padded.push(...days.value)
  const out: (Day | null)[][] = []
  for (let i = 0; i < padded.length; i += 7) {
    const week = padded.slice(i, i + 7)
    while (week.length < 7) week.push(null)
    out.push(week)
  }
  return out
})

const monthLabels = computed(() => {
  const labels: { col: number; label: string }[] = []
  let lastMonth = -1
  weeks.value.forEach((week, col) => {
    const day = week.find(Boolean)
    if (!day) return
    const month = new Date(`${day.date}T00:00:00`).getMonth()
    if (month !== lastMonth) {
      lastMonth = month
      labels.push({ col, label: new Date(`${day.date}T00:00:00`).toLocaleString('en', { month: 'short' }) })
    }
  })
  return labels.filter((l, i) => {
    const next = labels[i + 1]
    return !next || next.col - l.col >= 3
  })
})

const stats = computed(() => {
  if (!days.value.length) return null
  let streak = 0
  let run = 0
  let best = 0
  let activeDays = 0
  let total = 0
  for (const d of days.value) {
    total += d.count
    best = Math.max(best, d.count)
    if (d.count > 0) {
      activeDays++
      run++
      streak = Math.max(streak, run)
    } else {
      run = 0
    }
  }
  return { total, streak, activeDays, best }
})
</script>
