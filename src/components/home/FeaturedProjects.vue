<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
    <template v-if="featured.length">
      <RouterLink
        v-for="(p, i) in featured"
        :key="p.name"
        v-reveal="i * 100"
        :to="`/projects/${p.name}`"
        class="group block">
        <article
          class="h-full border border-primary bg-surface-container-lowest flex flex-col brutalist-offset shadow-primary transition-[transform,box-shadow] duration-200 group-hover:shadow-tertiary group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
          <div class="bg-on-surface text-background px-4 py-2 flex items-center justify-between gap-3">
            <h3 class="font-headline-md text-[18px] uppercase tracking-tight truncate flex items-center gap-2">
              {{ p.name }}
              <span v-if="p.status === 'BETA'" class="w-2.5 h-2.5 bg-[#ffaa00] shrink-0 animate-pulse"></span>
            </h3>
            <span class="font-code text-code shrink-0">{{ p.version }}</span>
          </div>
          <div class="p-5 flex flex-col gap-4 flex-1">
            <div class="flex gap-4 items-start">
              <div
                v-if="p.logoUrl"
                class="w-14 h-14 shrink-0 border border-outline-variant bg-surface-dim overflow-hidden">
                <img :src="p.logoUrl" :alt="`${p.name} logo`" loading="lazy" class="w-full h-full object-contain" />
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in p.tags"
                  :key="tag.label"
                  class="px-2 py-0.5 font-code text-xs uppercase border"
                  :class="tag.type === 'software' ? 'border-tertiary text-tertiary-text' : 'border-cyber-purple text-cyber-purple'">
                  {{ tag.label }}
                </span>
              </div>
            </div>
            <p class="font-body-md text-body-md text-on-surface-variant line-clamp-3">{{ p.description }}</p>
            <div class="mt-auto flex items-center justify-between font-code text-code text-on-surface-variant">
              <span>{{ p.date }}</span>
              <span class="flex items-center gap-1 uppercase group-hover:text-tertiary-text transition-colors">
                Open <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>
        </article>
      </RouterLink>
    </template>
    <template v-else>
      <div v-for="n in 3" :key="n" class="h-56 border border-outline-variant bg-surface-container animate-pulse"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProjects } from '@/composables/useProjects'
import { vReveal } from '@/composables/useReveal'

const { items } = useProjects()

const featured = computed(() =>
  [...items.value].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')).slice(0, 3),
)
</script>
