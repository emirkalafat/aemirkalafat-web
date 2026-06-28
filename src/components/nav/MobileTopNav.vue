<template>
  <nav
    class="flex lg:hidden justify-between items-center w-full px-margin-mobile py-4 bg-background border-b-2 border-primary sticky top-0 z-50">
    <div class="text-label-md font-code text-primary tracking-tighter">
      ROOT@PORTFOLIO:~#
    </div>
    <div class="flex gap-4">
      <RouterLink to="/media"
        class="text-label-md font-code text-on-surface hover:text-primary hidden sm:block transition-colors router-link-active:text-tertiary">
        MEDIA</RouterLink>
      <RouterLink to="/projects"
        class="text-label-md font-code text-on-surface hover:text-primary hidden sm:block transition-colors router-link-active:text-tertiary">
        PROJECTS</RouterLink>
      <button @click="toggleTheme" class="text-primary hover:text-tertiary transition-colors">
        <span class="material-symbols-outlined">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const { theme, toggle } = useTheme()
const isDark = computed(() => theme.value === 'dark')
const toggleTheme = toggle
</script>
