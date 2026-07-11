<template>
  <div
    class="border-2 bg-surface-container-lowest p-6 flex flex-col items-center justify-center gap-3 brutalist-offset"
    :class="[
      tierColor.border,
      tierColor.shadow,
    ]"
  >
    <p class="font-code text-code text-on-surface-variant uppercase tracking-widest text-xs">AGGREGATE_SCORE</p>

    <div class="flex items-end gap-1 leading-none">
      <span :class="tierColor.text" class="font-code font-bold" style="font-size: 3.5rem; line-height: 1;">{{ displayRating }}</span>
      <span class="font-code text-on-surface-variant text-lg">/10</span>
    </div>

    <div v-if="label" :class="[tierColor.border, tierColor.fill]" class="px-4 py-2 border-2 font-code font-bold uppercase text-sm tracking-wide text-on-surface">
      {{ label }}
    </div>

    <div class="w-full flex gap-[3px]">
      <div
        v-for="(segment, idx) in segments"
        :key="idx"
        class="flex-1 h-7 border border-outline-variant bg-surface-container-high relative overflow-hidden"
      >
        <div
          :class="tierColor.fill"
          class="absolute inset-y-0 left-0 transition-[width] duration-150"
          :style="{ width: segment + '%' }"
        />
      </div>
    </div>

    <div class="w-full flex justify-between font-code text-[10px] text-on-surface-variant">
      <span>0</span>
      <span>10</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  rating: number
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
})

const animatedRating = ref(0)

const displayRating = computed(() => animatedRating.value.toFixed(1))

const tierColor = computed(() => {
  const tier = props.rating >= 9 ? 'high' : props.rating >= 7 ? 'mid' : 'low'

  if (tier === 'high') {
    return {
      text: 'text-tertiary',
      border: 'border-tertiary',
      shadow: 'shadow-tertiary',
      fill: 'bg-tertiary',
    }
  } else if (tier === 'mid') {
    return {
      text: 'text-primary-fixed-dim',
      border: 'border-primary-fixed-dim',
      shadow: 'shadow-primary-fixed-dim',
      fill: 'bg-primary-fixed-dim',
    }
  } else {
    return {
      text: 'text-error',
      border: 'border-error',
      shadow: 'shadow-error',
      fill: 'bg-error',
    }
  }
})

const segments = computed(() => {
  const segs: number[] = []
  for (let i = 0; i < 10; i++) {
    const fillPct = Math.min(Math.max(animatedRating.value - i, 0), 1) * 100
    segs.push(fillPct)
  }
  return segs
})

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced) {
    animatedRating.value = props.rating
  } else {
    const startTime = performance.now()
    const duration = 1200
    const startValue = 0

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeOut = 1 - Math.pow(1 - progress, 3)
      animatedRating.value = startValue + (props.rating - startValue) * easeOut

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        animatedRating.value = props.rating
      }
    }

    requestAnimationFrame(animate)
  }
})
</script>
