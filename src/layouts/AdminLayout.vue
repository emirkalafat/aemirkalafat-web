<template>
  <div class="bg-surface-container-lowest text-on-surface font-body-md min-h-screen flex flex-col lg:flex-row">
    <!-- Admin Sidebar -->
    <nav class="hidden lg:flex flex-col h-screen fixed left-0 top-0 z-40 w-64 bg-surface-container-lowest border-r-2 border-primary">
      <div class="p-gutter border-b-2 border-primary flex items-center gap-4">
        <div class="w-12 h-12 bg-primary flex items-center justify-center">
          <span class="material-symbols-outlined text-on-primary">terminal</span>
        </div>
        <div>
          <h1 class="text-headline-md font-headline-md text-on-surface text-base uppercase">KALAFAT</h1>
          <p class="text-label-md font-code text-on-surface-variant text-xs">ADMIN_v1.0.0</p>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-4">
        <RouterLink
          to="/admin"
          class="flex items-center gap-4 p-3 text-label-md font-code text-on-surface-variant hover:bg-surface-container-high transition-colors router-link-active:bg-primary router-link-active:text-on-primary router-link-active:font-bold router-link-active:border-l-4 router-link-active:border-tertiary"
        >
          <span class="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink
          to="/admin/blog"
          class="flex items-center gap-4 p-3 text-label-md font-code text-on-surface-variant hover:bg-surface-container-high transition-colors router-link-active:bg-primary router-link-active:text-on-primary router-link-active:font-bold router-link-active:border-l-4 router-link-active:border-tertiary"
        >
          <span class="material-symbols-outlined">article</span>
          <span>Blog</span>
        </RouterLink>
        <RouterLink
          to="/admin/projects"
          class="flex items-center gap-4 p-3 text-label-md font-code text-on-surface-variant hover:bg-surface-container-high transition-colors router-link-active:bg-primary router-link-active:text-on-primary router-link-active:font-bold router-link-active:border-l-4 router-link-active:border-tertiary"
        >
          <span class="material-symbols-outlined">engineering</span>
          <span>Projects</span>
        </RouterLink>
        <RouterLink
          to="/admin/media"
          class="flex items-center gap-4 p-3 text-label-md font-code text-on-surface-variant hover:bg-surface-container-high transition-colors router-link-active:bg-primary router-link-active:text-on-primary router-link-active:font-bold router-link-active:border-l-4 router-link-active:border-tertiary"
        >
          <span class="material-symbols-outlined">subscriptions</span>
          <span>Media</span>
        </RouterLink>
      </div>

      <div class="p-4 border-t-2 border-primary flex flex-col gap-2">
        <button
          @click="handleLogout"
          class="w-full bg-error text-on-error py-2 text-label-md font-code flex justify-center items-center gap-2 hover:bg-error-container transition-colors"
        >
          <span class="material-symbols-outlined text-base">logout</span>
          <span>LOGOUT</span>
        </button>
      </div>
    </nav>

    <!-- Admin Content -->
    <main class="flex-1 lg:ml-64 flex flex-col h-screen">
      <!-- Top Bar -->
      <header class="sticky top-0 z-30 bg-surface-container-lowest border-b-2 border-primary px-gutter py-4 flex justify-between items-center">
        <div class="text-headline-md font-headline-md text-on-surface uppercase">ROOT_ACCESS</div>
        <button
          @click="handleLogout"
          class="lg:hidden text-on-surface-variant hover:text-error transition-colors"
        >
          <span class="material-symbols-outlined">logout</span>
        </button>
      </header>

      <!-- Router View -->
      <div class="flex-1 min-h-0">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { logout } = useAuth()

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>
