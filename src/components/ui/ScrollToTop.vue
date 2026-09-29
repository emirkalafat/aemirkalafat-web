<template>
  <Transition name="scroll-top">
    <button
      v-if="visible"
      type="button"
      aria-label="Scroll to top"
      class="fixed z-30 right-5 bottom-5 md:right-8 md:bottom-8 w-12 h-14 flex flex-col items-center justify-center gap-0.5 overflow-hidden border border-primary bg-on-surface text-background brutalist-offset shadow-tertiary brutalist-offset-hover transition-transform duration-200"
      @click="toTop">
      <span class="material-symbols-outlined text-[20px]">arrow_upward</span>
      <span class="font-code text-[9px] leading-none tracking-widest">TOP</span>
      <span class="absolute left-0 bottom-0 h-[3px] bg-tertiary" :style="{ width: `${progress}%` }"></span>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const SHOW_AFTER = 800

const visible = ref(false)
const progress = ref(0)
let raf = 0

function update() {
  raf = 0
  const y = window.scrollY
  const max = document.documentElement.scrollHeight - window.innerHeight
  visible.value = y > SHOW_AFTER
  progress.value = max > 0 ? Math.min(100, Math.round((y / max) * 100)) : 0
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(update)
}

function toTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  update()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<style scoped>
.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: opacity 0.25s ease, translate 0.25s ease;
}

.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  translate: 0 12px;
}
</style>
