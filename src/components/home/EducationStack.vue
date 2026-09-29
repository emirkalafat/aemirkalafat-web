<template>
  <div class="border border-cyber-purple bg-surface-container-lowest font-code text-code brutalist-offset shadow-cyber-purple">
    <div class="flex items-center justify-between gap-4 bg-cyber-purple text-on-cyber-purple px-4 py-2 select-none">
      <span>CALL STACK</span>
      <span class="text-xs opacity-90">{{ items.length }} frames</span>
    </div>
    <ol>
      <li
        v-for="(item, i) in items"
        :key="item.institution + item.degree"
        v-reveal="i * 90"
        class="group relative flex gap-4 px-5 py-5 border-t border-outline-variant first:border-t-0 transition-colors hover:bg-cyber-purple/10">
        <span class="absolute left-0 top-0 bottom-0 w-1 bg-transparent transition-colors group-hover:bg-cyber-purple/60"></span>
        <span class="w-8 shrink-0 pt-1 text-cyber-purple select-none">#{{ i + 1 }}</span>
        <div class="min-w-0 flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-6">
          <div class="min-w-0 flex flex-col gap-2">
            <h3 class="font-headline-md text-[22px] leading-tight uppercase tracking-tight text-on-surface break-words">{{ item.field }}</h3>
            <p class="text-cyber-purple uppercase text-sm">{{ item.degree }}</p>
            <p class="font-body-md text-body-md text-on-surface-variant">{{ item.institution }}</p>
            <p v-if="item.activities" class="font-body-md text-body-md text-on-surface-variant border-l-4 border-primary pl-3">
              {{ item.activities }}
            </p>
            <div v-if="item.skills?.length" class="flex flex-wrap gap-2 mt-1">
              <span
                v-for="skill in item.skills"
                :key="skill"
                class="px-2 py-0.5 text-xs uppercase border border-cyber-purple text-cyber-purple">
                {{ skill }}
              </span>
            </div>
          </div>
          <span class="text-on-surface-variant text-sm whitespace-nowrap md:pt-1.5">{{ item.period }}</span>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import type { Education } from '@/data/experience'
import { vReveal } from '@/composables/useReveal'

defineProps<{ items: Education[] }>()
</script>
