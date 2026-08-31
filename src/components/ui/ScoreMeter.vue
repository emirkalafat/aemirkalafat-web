<template>
  <div
    class="border-2 bg-surface-container-lowest p-6 flex flex-col items-center justify-center gap-3 brutalist-offset"
    :class="[
      tierColor.border,
      tierColor.shadow,
      isPerfect && 'rating-perfect',
    ]"
  >
    <p class="font-code text-code text-on-surface-variant uppercase tracking-widest text-xs flex items-center gap-1.5">
      AGGREGATE_SCORE
      <span v-if="isPerfect" class="text-tertiary-text rating-perfect-text">★ PERFECT</span>
    </p>

    <div class="flex items-end gap-1 leading-none">
      <span
        :class="[tierColor.text, isPerfect && 'rating-perfect-text']"
        class="font-code font-bold"
        style="font-size: 3.5rem; line-height: 1;"
      >{{ displayRating }}</span>
      <span class="font-code text-on-surface-variant text-lg">/10</span>
    </div>

    <div class="w-full flex gap-[3px]">
      <div
        v-for="(segment, idx) in segments"
        :key="idx"
        class="flex-1 h-7 border border-outline-variant bg-surface-container-high relative overflow-hidden"
      >
        <div
          :class="tierColor.fill"
          class="absolute inset-0 transition-opacity duration-150"
          :style="{ opacity: segment }"
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

const isPerfect = computed(() => props.rating >= 9.5)

const tierColor = computed(() => {
  if (props.rating >= 9) {
    return {
      text: 'text-tertiary-text',
      border: 'border-tertiary',
      shadow: 'shadow-tertiary',
      fill: 'bg-tertiary',
    }
  } else if (props.rating >= 7) {
    return {
      text: 'text-rating-good',
      border: 'border-rating-good',
      shadow: 'shadow-rating-good',
      fill: 'bg-rating-good',
    }
  } else if (props.rating >= 5) {
    return {
      text: 'text-rating-average',
      border: 'border-rating-average',
      shadow: 'shadow-rating-average',
      fill: 'bg-rating-average',
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

// Her kutu ya tam dolu (opaklık 1) ya boş; yalnızca kesirli değere denk gelen
// tek kutu ara opaklık alır. Örn. 5.6 → ilk 5 kutu opaklık 1, 6. kutu 0.6.
// Animasyon sırasında animatedRating 0'dan yükseldikçe kutular sırayla soluktan
// tam opaklığa çıkar (su dolumu değil, opaklık artışı).
const segments = computed(() => {
  const segs: number[] = []
  for (let i = 0; i < 10; i++) {
    segs.push(Math.min(Math.max(animatedRating.value - i, 0), 1))
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
