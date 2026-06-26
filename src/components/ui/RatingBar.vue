<template>
  <div class="w-full h-2 bg-surface-container border border-primary relative">
    <div
      class="absolute top-0 left-0 h-full transition-all duration-300"
      :class="barColorClass"
      :style="{ width: `${(rating / 10) * 100}%` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  rating: number
}

const props = defineProps<Props>()

const barColorClass = computed(() => {
  if (props.rating >= 9) {
    return 'bg-tertiary'
  } else if (props.rating >= 7) {
    return 'bg-primary-fixed-dim'
  } else {
    return 'bg-error'
  }
})
</script>
