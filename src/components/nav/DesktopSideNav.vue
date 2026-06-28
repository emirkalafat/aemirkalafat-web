<template>
  <nav
    class="hidden lg:flex flex-col h-full fixed left-0 top-0 z-40 w-64 bg-surface-container-lowest border-r-2 border-primary">
    <div class="p-gutter border-b-2 border-primary flex items-center gap-4">
      <div class="w-12 h-12 bg-primary flex items-center justify-center border border-surface-container-lowest">
        <span class="material-symbols-outlined text-on-primary">terminal</span>
      </div>
      <div>
        <h1 class="text-headline-md font-headline-md text-on-surface text-[20px] leading-tight">KALAFAT</h1>
        <p class="text-label-md font-code text-on-surface-variant">v6.0.0-july</p>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-4">
      <NavLink to="/" icon="home" label="Home" />
      <NavLink to="/media" icon="movie" label="Media" />
      <NavLink to="/projects" icon="developer_board" label="Projects" />
      <NavLink to="/blog" icon="article" label="Blog" />
      <!-- <NavLink to="/status" icon="sensors" label="Status" /> -->
    </div>
    <div class="p-4 border-t-2 border-primary flex flex-col gap-2">
      <RouterLink
        to="/contact"
        class="w-full bg-surface border border-primary text-primary hover:bg-secondary-container hover:text-on-secondary-container transition-colors py-2 text-label-md font-code flex justify-center items-center gap-2 brutalist-offset shadow-tertiary hover:shadow-tertiary">
        <span class="material-symbols-outlined text-[16px]">mail</span>
        CONTACT
      </RouterLink>
      <button
        @click="toggleTheme"
        class="w-full bg-surface border border-primary text-primary hover:bg-secondary-container hover:text-on-secondary-container transition-colors py-2 text-label-md font-code flex justify-center items-center gap-2 brutalist-offset shadow-tertiary hover:shadow-tertiary">
        <span class="material-symbols-outlined text-[16px]">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
        {{ isDark ? 'LIGHT' : 'DARK' }}
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import NavLink from './NavLink.vue'

const { theme, toggle } = useTheme()

const isDark = computed(() => theme.value === 'dark')
const toggleTheme = toggle
</script>
