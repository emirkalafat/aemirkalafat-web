<template>
  <article class="border border-primary bg-surface-container-lowest flex flex-col transition-all duration-200">
    <!-- Card Header -->
    <div
      class="bg-on-surface text-surface-container-lowest px-4 py-2 flex justify-between items-center cursor-pointer select-none"
      @click="isOpen = !isOpen">
      <h3 class="text-headline-md font-headline-md uppercase tracking-tight flex items-center gap-3 text-[20px]">
        {{ name }}
        <span v-if="status === 'BETA'" class="w-3 h-3 bg-[#ffaa00] inline-block animate-pulse"></span>
      </h3>
      <div class="flex items-center gap-4">
        <span class="font-code font-bold text-[16px]"
          :class="status === 'BETA' ? 'text-[#ffaa00]' : 'text-on-primary'">{{ version }}</span>
        <span class="material-symbols-outlined transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }">expand_more</span>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-gutter flex flex-col md:flex-row gap-gutter items-start">
      <!-- Left: info -->
      <div class="flex-1 flex flex-col gap-4">
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in tags" :key="tag.label" class="px-2 py-0.5 text-label-md font-code text-xs uppercase"
            :class="tag.type === 'software'
              ? 'border border-tertiary text-tertiary'
              : 'border border-cyber-purple text-cyber-purple'">{{ tag.label }}</span>
          <span class="px-2 py-0.5 text-label-md font-code text-xs uppercase font-bold" :class="status === 'STABLE'
            ? 'bg-primary text-on-primary'
            : 'border border-[#ffaa00] text-[#ffaa00]'">{{ status === 'STABLE' ? 'STABLE' : 'BETA / UNSTABLE'
            }}</span>
        </div>
        <p class="text-body-md font-body-md text-on-surface-variant">{{ description }}</p>
        <RouterLink :to="`/projects/${name}`"
          class="mt-2 inline-flex items-center gap-2 font-code text-code text-primary border border-primary px-4 py-2 hover:bg-primary hover:text-on-primary transition-colors uppercase self-start"
          @click.stop>VIEW_DETAILS <span class="material-symbols-outlined text-[14px]">arrow_forward</span></RouterLink>
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

    </div>

    <!-- Collapsible Changelog — latest entry only -->
    <div v-show="isOpen" class="border-t border-surface-variant bg-surface p-gutter">
      <h4 class="text-label-md font-code text-tertiary mb-4 uppercase flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">history</span> Latest Changes
      </h4>
      <template v-if="latestEntry">
        <div class="flex flex-wrap items-baseline gap-3 mb-3">
          <span class="font-code font-bold text-tertiary text-sm">{{ latestEntry.version }}</span>
          <span class="font-code text-code text-on-surface-variant">{{ latestEntry.label }}</span>
          <span class="font-code text-code text-on-surface-variant opacity-50 text-xs">{{ latestEntry.date }}</span>
        </div>
        <div class="flex flex-col gap-2 border-l border-surface-variant ml-2 pl-4">
          <div v-for="(item, idx) in latestEntry.items" :key="idx" class="flex items-start gap-2 font-code text-code">
            <span class="shrink-0 font-bold" :class="flagClass(item.flag)">[{{ item.flag }}]</span>
            <span class="text-on-surface-variant">{{ item.text }}</span>
          </div>
        </div>
      </template>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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

type ChangelogFlag = 'ADDED' | 'FIXED' | 'IMPRV' | 'INIT' | 'WARN'

interface ChangelogEntry {
  version: string
  label: string
  date: string
  isLatest: boolean
  items: { flag: ChangelogFlag; text: string }[]
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

const props = defineProps<Props>()

const isOpen = ref(false)

const latestEntry = computed(() => props.changelog.find(e => e.isLatest))

function flagClass(flag: ChangelogFlag) {
  const map: Record<ChangelogFlag, string> = {
    ADDED: 'text-tertiary',
    FIXED: 'text-[#4ade80]',
    IMPRV: 'text-primary',
    INIT: 'text-on-surface-variant',
    WARN: 'text-error',
  }
  return map[flag]
}
</script>
