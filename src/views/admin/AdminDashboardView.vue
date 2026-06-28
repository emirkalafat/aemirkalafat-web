<template>
  <div class="p-gutter md:p-margin-desktop space-y-column-gap max-w-7xl">
    <!-- Summary Cards -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="border border-on-surface bg-surface-container-lowest flex flex-col">
        <div class="bg-on-surface text-surface font-bold font-code px-4 py-2 border-b border-on-surface flex justify-between items-center">
          <span>MEDIA_REVIEWS</span>
          <span class="material-symbols-outlined text-sm">subscriptions</span>
        </div>
        <div class="p-6 flex flex-col space-y-2">
          <span class="font-display text-display text-on-surface leading-none">{{ media.items.value.length }}</span>
          <div class="flex items-center space-x-2 text-on-surface-variant text-sm font-code">
            <span class="w-2 h-2 bg-tertiary rounded-none"></span>
            <span>TOTAL_ITEMS</span>
          </div>
        </div>
      </div>

      <div class="border border-on-surface bg-surface-container-lowest flex flex-col">
        <div class="bg-on-surface text-surface font-bold font-code px-4 py-2 border-b border-on-surface flex justify-between items-center">
          <span>PROJECT_REGISTRY</span>
          <span class="material-symbols-outlined text-sm">engineering</span>
        </div>
        <div class="p-6 flex flex-col space-y-2">
          <span class="font-display text-display text-on-surface leading-none">{{ projects.items.value.length }}</span>
          <div class="flex items-center space-x-2 text-on-surface-variant text-sm font-code">
            <span class="w-2 h-2 bg-tertiary rounded-none"></span>
            <span>TOTAL_PROJECTS</span>
          </div>
        </div>
      </div>

      <div class="border border-on-surface bg-surface-container-lowest flex flex-col">
        <div class="bg-on-surface text-surface font-bold font-code px-4 py-2 border-b border-on-surface flex justify-between items-center">
          <span>BLOG_ENTRIES</span>
          <span class="material-symbols-outlined text-sm">article</span>
        </div>
        <div class="p-6 flex flex-col space-y-2">
          <span class="font-display text-display text-on-surface leading-none">{{ blog.items.value.length }}</span>
          <div class="flex items-center space-x-2 text-on-surface-variant text-sm font-code">
            <span class="w-2 h-2 bg-tertiary rounded-none"></span>
            <span>TOTAL_POSTS</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="flex flex-wrap gap-4 border-t border-on-surface pt-8">
      <RouterLink
        to="/admin/media"
        class="bg-on-surface text-surface border border-on-surface px-6 py-3 font-code font-bold uppercase hover:bg-tertiary hover:text-on-tertiary flex items-center space-x-2 transition-colors"
      >
        <span class="material-symbols-outlined text-lg">add</span>
        <span>ADD_MEDIA</span>
      </RouterLink>
      <RouterLink
        to="/admin/projects"
        class="bg-surface-container-highest text-on-surface border border-on-surface px-6 py-3 font-code font-bold uppercase hover:bg-tertiary hover:text-on-tertiary flex items-center space-x-2 transition-colors"
      >
        <span class="material-symbols-outlined text-lg">add</span>
        <span>ADD_PROJECT</span>
      </RouterLink>
      <RouterLink
        to="/admin/blog"
        class="bg-surface-container-highest text-on-surface border border-on-surface px-6 py-3 font-code font-bold uppercase hover:bg-tertiary hover:text-on-tertiary flex items-center space-x-2 transition-colors"
      >
        <span class="material-symbols-outlined text-lg">add</span>
        <span>ADD_POST</span>
      </RouterLink>
      <button
        @click="seedDb"
        :disabled="seeding"
        class="bg-surface-container-highest text-on-surface border border-on-surface px-6 py-3 font-code font-bold uppercase hover:bg-tertiary hover:text-on-tertiary flex items-center space-x-2 transition-colors disabled:opacity-50 ml-auto"
      >
        <span class="material-symbols-outlined text-lg">cloud_upload</span>
        <span>{{ seeding ? 'SEEDING...' : 'SEED_DB' }}</span>
      </button>
    </section>

    <!-- System Info -->
    <section v-if="seedMessage" class="border border-tertiary bg-surface-container-lowest p-4">
      <p class="font-code text-code text-tertiary">{{ seedMessage }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBlog } from '@/composables/useBlog'
import { useProjects } from '@/composables/useProjects'
import { useMedia } from '@/composables/useMedia'
import { seedFirestore } from '@/firebase/seed'

const blog = useBlog()
const projects = useProjects()
const media = useMedia()

const seeding = ref(false)
const seedMessage = ref('')

async function seedDb() {
  seeding.value = true
  seedMessage.value = ''
  try {
    await seedFirestore()
    seedMessage.value = '✓ Database seeded successfully'
    setTimeout(() => {
      seedMessage.value = ''
    }, 3000)
  } catch (e) {
    seedMessage.value = '✗ Seeding failed: ' + (e as any).message
  } finally {
    seeding.value = false
  }
}
</script>
