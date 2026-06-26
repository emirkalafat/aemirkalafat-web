<template>
  <div class="flex-1 flex flex-col">
    <PageHeader :title="analysisTitle">
      <template #filters>
        <div v-if="card" class="flex flex-wrap items-center gap-3">
          <span class="font-code text-code border border-primary px-3 py-1 text-on-surface-variant">ID: {{ card.id }}</span>
          <span class="font-code text-code border border-primary px-3 py-1 text-on-surface-variant">{{ card.type }}</span>
          <span
            class="font-code text-code border px-3 py-1 flex items-center gap-2"
            :class="card.isCompleted ? 'border-tertiary text-tertiary' : 'border-on-surface-variant text-on-surface-variant'"
          >
            <span class="w-2 h-2 inline-block" :class="card.isCompleted ? 'bg-tertiary' : 'bg-on-surface-variant opacity-50'"></span>
            STATE: {{ card.isCompleted ? 'COMPLETED' : 'IN_PROGRESS' }}
          </span>
          <span
            class="font-code text-code border px-3 py-1"
            :class="card.rating >= 9 ? 'border-tertiary text-tertiary' : 'border-primary text-primary'"
          >{{ card.ratingLabel }}</span>
        </div>
      </template>
    </PageHeader>

    <section class="flex-1 p-margin-mobile lg:p-margin-desktop bg-surface-container-lowest">
      <!-- Not found -->
      <div v-if="!card" class="border border-primary bg-surface p-8 text-center">
        <p class="font-code text-body-md text-on-surface-variant">[RECORD_NOT_FOUND]</p>
      </div>

      <template v-else>
        <!-- Top row: hero (8 col) + metadata (4 col) -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-gutter mb-gutter">

          <!-- Hero image -->
          <div class="xl:col-span-8 border border-primary overflow-hidden">
            <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase">VISUAL_DATA_STREAM</div>
            <div class="aspect-video overflow-hidden">
              <img
                :src="card.imageUrl"
                :alt="card.title"
                class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          <!-- Metadata panel -->
          <div class="xl:col-span-4 border border-primary bg-surface-container-lowest flex flex-col">
            <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase">SYS_METADATA</div>
            <div class="p-6 flex-1 flex flex-col gap-0">
              <div
                v-for="item in card.meta"
                :key="item"
                class="border-b border-dashed border-outline-variant py-3 last:border-0"
              >
                <p class="font-code text-code text-on-surface-variant">{{ item }}</p>
              </div>
              <div class="border-b border-dashed border-outline-variant py-3">
                <p class="font-code text-code text-on-surface-variant">TYPE: {{ card.type }}</p>
              </div>
              <div class="py-3">
                <p class="font-code text-code text-on-surface-variant">DATE: {{ card.date }}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom row: review (8 col) + score+metrics (4 col) -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-gutter">

          <!-- Core Review -->
          <div class="xl:col-span-8 border border-primary bg-surface-container-lowest" style="border-left-width: 4px; border-left-color: #BD00FF;">
            <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase">CORE_REVIEW.LOG</div>
            <div class="p-6 flex flex-col gap-4">
              <p
                v-for="(line, i) in descriptionLines"
                :key="i"
                class="font-code text-body-md text-on-surface-variant flex gap-3"
              >
                <span class="text-on-tertiary-container select-none shrink-0">›</span>
                {{ line }}
              </p>
            </div>
          </div>

          <!-- Right column: two separate cards -->
          <div class="xl:col-span-4 flex flex-col gap-gutter">

            <!-- AGGREGATE_SCORE card — teal accent -->
            <div
              class="border-2 border-tertiary bg-surface-container-lowest p-8 flex flex-col items-center justify-center"
              style="box-shadow: 4px 4px 0px 0px #4cd6ff"
            >
              <p class="font-code text-code text-on-surface-variant uppercase tracking-widest mb-4">AGGREGATE_SCORE</p>
              <div class="flex items-end gap-1 leading-none">
                <span class="font-code font-bold text-tertiary" style="font-size: 5rem; line-height: 1;">{{ card.rating }}</span>
                <span class="font-code text-on-surface-variant text-2xl mb-2">/10</span>
              </div>
              <p class="font-code text-code text-tertiary uppercase mt-4">{{ card.ratingLabel }}</p>
            </div>

            <!-- PERFORMANCE_METRICS card -->
            <div v-if="card.metrics" class="border border-primary bg-surface-container-lowest flex flex-col">
              <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase">PERFORMANCE_METRICS</div>
              <div class="p-6 flex flex-col gap-5 flex-1">
                <div v-for="[label, value] in metricEntries" :key="label">
                  <div class="flex justify-between font-code text-code mb-2">
                    <span class="text-on-surface-variant">{{ label }}</span>
                    <span class="text-tertiary">{{ value }}%</span>
                  </div>
                  <div class="h-2 bg-surface-container-high w-full">
                    <div class="h-2 bg-tertiary" :style="`width: ${value}%`"></div>
                  </div>
                </div>
              </div>
              <div class="border-t border-primary p-4 font-code text-code text-on-surface-variant flex flex-col gap-1">
                <p>LAST_ACCESS: {{ card.date }}</p>
                <p :class="card.isCompleted ? 'text-tertiary' : 'text-on-surface-variant'">
                  STATE: {{ card.isCompleted ? 'COMPLETED ✓' : 'IN_PROGRESS' }}
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/ui/PageHeader.vue'
import { mediaCards } from '@/data/media'

const route = useRoute()
const card = computed(() => mediaCards.find(c => c.id === route.params.id))

const analysisTitle = computed(() => card.value ? `${card.value.title}_ANALYSIS` : 'MEDIA_ANALYSIS')

const descriptionLines = computed(() => {
  if (!card.value) return []
  return card.value.description.split('. ').filter(Boolean).map(s => s.endsWith('.') ? s : s + '.')
})

const metricEntries = computed((): [string, number][] => {
  if (!card.value?.metrics) return []
  return [
    ['NARRATIVE_ARCH', card.value.metrics.narrativeArch],
    ['AESTHETIC_EXEC', card.value.metrics.aestheticExec],
    ['COHERENCE_RATING', card.value.metrics.coherenceRating],
  ]
})
</script>
