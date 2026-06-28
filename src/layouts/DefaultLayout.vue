<template>
  <div
    class="bg-surface-container-lowest text-on-surface font-body-md min-h-screen flex flex-col lg:flex-row antialiased selection:bg-tertiary selection:text-on-tertiary">
    <DesktopSideNav />
    <MobileTopNav />
    <main class="flex-1 lg:ml-64 flex flex-col min-h-screen">
      <RouterView v-slot="{ Component }">
        <Transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
      <AppFooter />
    </main>
  </div>
</template>

<script setup lang="ts">
import DesktopSideNav from '@/components/nav/DesktopSideNav.vue'
import MobileTopNav from '@/components/nav/MobileTopNav.vue'
import AppFooter from '@/components/AppFooter.vue'
import { RouterView } from 'vue-router'
</script>
