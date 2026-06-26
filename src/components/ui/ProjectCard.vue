<template>
  <article class="border border-primary bg-surface-container-lowest flex flex-col transition-all duration-200">
    <!-- Card Header -->
    <div
      class="bg-on-surface text-surface-container-lowest px-4 py-2 flex justify-between items-center cursor-pointer select-none"
      @click="isOpen = !isOpen"
    >
      <h3 class="text-headline-md font-headline-md uppercase tracking-tight flex items-center gap-3 text-[20px]">
        {{ name }}
        <span v-if="status === 'BETA'" class="w-3 h-3 bg-[#ffaa00] inline-block animate-pulse"></span>
      </h3>
      <div class="flex items-center gap-4">
        <span class="font-code font-bold text-[16px]" :class="status === 'BETA' ? 'text-[#ffaa00]' : 'text-on-primary'">{{ version }}</span>
        <span
          class="material-symbols-outlined transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        >expand_more</span>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-gutter flex flex-col md:flex-row gap-gutter items-start">
      <!-- Left: info -->
      <div class="flex-1 flex flex-col gap-4">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in tags"
            :key="tag.label"
            class="px-2 py-0.5 text-label-md font-code text-xs uppercase"
            :class="tag.type === 'software'
              ? 'border border-tertiary text-tertiary'
              : 'border border-cyber-purple text-cyber-purple'"
          >{{ tag.label }}</span>
          <span
            class="px-2 py-0.5 text-label-md font-code text-xs uppercase font-bold"
            :class="status === 'STABLE'
              ? 'bg-primary text-on-primary'
              : 'border border-[#ffaa00] text-[#ffaa00]'"
          >{{ status === 'STABLE' ? 'STABLE' : 'BETA / UNSTABLE' }}</span>
        </div>
        <p class="text-body-md font-body-md text-on-surface-variant">{{ description }}</p>
        <div class="flex items-center gap-4 text-label-md font-code text-on-surface-variant mt-2">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">calendar_today</span>
            {{ date }}
          </span>
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">commit</span>
            {{ commit }}
          </span>
        </div>
      </div>

      <!-- Right: stats panel -->
      <div class="w-full md:w-1/3 min-w-[240px]">
        <div class="border border-surface-variant bg-background p-3 flex flex-col gap-2 relative overflow-hidden">
          <div
            v-if="stats.statusColor === 'yellow'"
            class="absolute inset-0 opacity-10 pointer-events-none"
            style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, #4cd6ff 2px, #4cd6ff 4px); background-size: 100% 4px;"
          ></div>
          <div class="flex justify-between items-center border-b border-surface-variant pb-2 mb-2 relative z-10">
            <span class="text-label-md font-code text-on-surface-variant">{{ stats.panelLabel }}</span>
            <span
              class="w-2 h-2"
              :class="{
                'bg-[#00ff00] shadow-[0_0_8px_#00ff00]': stats.statusColor === 'green',
                'text-[#ffaa00] font-code text-xs': stats.statusColor === 'yellow',
              }"
            >
              <template v-if="stats.statusColor === 'yellow'">SYNCING...</template>
            </span>
            <span v-if="stats.statusColor === 'green'" class="w-2 h-2 bg-[#00ff00] rounded-none shadow-[0_0_8px_#00ff00]"></span>
          </div>
          <div
            v-for="metric in stats.metrics"
            :key="metric.label"
            class="flex justify-between relative z-10"
          >
            <span class="font-code text-on-surface-variant text-xs">{{ metric.label }}</span>
            <span class="font-code text-xs" :class="metric.valueColor || 'text-tertiary'">{{ metric.value }}</span>
          </div>
          <div class="w-full bg-surface-variant h-1 mt-2 relative z-10">
            <div
              class="h-full"
              :class="stats.barColor"
              :style="{ width: `${stats.barPercent}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Collapsible Changelog -->
    <div v-show="isOpen" class="border-t border-surface-variant bg-surface p-gutter">
      <h4 class="text-label-md font-code text-tertiary mb-4 uppercase flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">history</span> Changelog Segment
      </h4>
      <div class="flex flex-col gap-4 border-l border-surface-variant ml-2 pl-4">
        <div v-for="entry in changelog" :key="entry.version" class="relative">
          <span
            class="absolute -left-[21px] top-1 w-2 h-2 bg-surface"
            :class="entry.isLatest ? 'border border-tertiary' : 'border border-surface-variant'"
          ></span>
          <div
            class="font-code text-xs mb-1"
            :class="entry.isLatest ? 'text-tertiary' : 'text-on-surface'"
          >[{{ entry.version }}] - {{ entry.label }}</div>
          <ul class="list-none text-body-md font-body-md text-on-surface-variant space-y-1">
            <li
              v-for="(item, idx) in entry.items"
              :key="idx"
              class="flex items-start gap-2"
            >
              <span class="text-tertiary mt-1">-</span>
              <span>
                <span v-if="item.isError" class="text-error font-bold">KNOWN ISSUE: </span>{{ item.text }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Tag {
  label: string
  type: 'software' | 'hardware'
}

interface Metric {
  label: string
  value: string
  valueColor?: string
}

interface Stats {
  panelLabel: string
  statusColor: 'green' | 'yellow' | 'red'
  metrics: Metric[]
  barPercent: number
  barColor: string
}

interface ChangelogEntry {
  version: string
  label: string
  isLatest: boolean
  items: { text: string; isError?: boolean }[]
}

interface Props {
  name: string
  version: string
  status: 'STABLE' | 'BETA'
  tags: Tag[]
  description: string
  date: string
  commit: string
  stats: Stats
  changelog: ChangelogEntry[]
}

defineProps<Props>()

const isOpen = ref(false)
</script>
