<template>
  <!-- Top Bar -->
  <nav
    class="flex lg:hidden justify-between items-center w-full px-margin-mobile py-4 bg-background border-b-2 border-primary sticky top-0 z-50">
    <div class="text-label-md font-code text-primary tracking-tighter">
      ROOT@PORTFOLIO:~#
    </div>
    <div class="flex gap-4 items-center">
      <button @click="toggleTheme" class="text-primary hover:text-tertiary transition-colors">
        <span class="material-symbols-outlined">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
      </button>
      <button @click="isOpen = !isOpen" class="text-primary hover:text-tertiary transition-colors lg:hidden">
        <span class="material-symbols-outlined">{{ isOpen ? 'close' : 'menu' }}</span>
      </button>
    </div>
  </nav>

  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 bg-black/60 z-40 lg:hidden"
    />
  </Transition>

  <!-- Drawer Menu -->
  <div
    :class="[
      'fixed top-0 left-0 h-full w-72 z-50 lg:hidden',
      'bg-background border-r-2 border-primary',
      'flex flex-col',
      'transition-transform duration-200',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <!-- Header -->
    <div class="p-gutter border-b-2 border-primary flex items-center gap-4">
      <div class="w-12 h-12 bg-primary flex items-center justify-center border border-surface-container-lowest">
        <span class="material-symbols-outlined text-on-primary">terminal</span>
      </div>
      <div>
        <h1 class="text-headline-md font-headline-md text-on-surface text-[20px] leading-tight">KALAFAT</h1>
        <p class="text-label-md font-code text-on-surface-variant">v6.0.0-july</p>
      </div>
    </div>

    <!-- Nav Links -->
    <div class="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-4">
      <NavLink to="/" icon="home" label="Home" @navigate="isOpen = false" />
      <NavLink to="/media" icon="movie" label="Media" @navigate="isOpen = false" />
      <NavLink to="/projects" icon="developer_board" label="Projects" @navigate="isOpen = false" />
      <NavLink to="/blog" icon="article" label="Blog" @navigate="isOpen = false" />
      <NavLink to="/status" icon="sensors" label="Status" @navigate="isOpen = false" />
    </div>

    <!-- Footer -->
    <div class="p-4 border-t-2 border-primary flex flex-col gap-2">
      <RouterLink
        to="/contact"
        @click="isOpen = false"
        class="w-full bg-surface border border-primary text-primary hover:bg-secondary-container hover:text-on-secondary-container transition-colors py-2 text-label-md font-code flex justify-center items-center gap-2 brutalist-offset shadow-tertiary hover:shadow-tertiary"
      >
        <span class="material-symbols-outlined text-[16px]">mail</span>
        CONTACT
      </RouterLink>

      <button
        @click="toggleTheme"
        class="w-full bg-surface border border-primary text-primary hover:bg-secondary-container hover:text-on-secondary-container transition-colors py-2 text-label-md font-code flex justify-center items-center gap-2 brutalist-offset shadow-tertiary hover:shadow-tertiary"
      >
        <span class="material-symbols-outlined text-[16px]">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
        {{ isDark ? 'LIGHT' : 'DARK' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import NavLink from './NavLink.vue'

const { theme, toggle } = useTheme()

const isDark = computed(() => theme.value === 'dark')
const toggleTheme = toggle

const isOpen = ref(false)
const route = useRoute()

watch(route, () => {
  isOpen.value = false
})

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})

watch(isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
