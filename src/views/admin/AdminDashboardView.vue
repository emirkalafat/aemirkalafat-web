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
        @click="showCategoryManager = !showCategoryManager"
        class="bg-surface-container-highest text-on-surface border border-on-surface px-6 py-3 font-code font-bold uppercase hover:bg-tertiary hover:text-on-tertiary flex items-center space-x-2 transition-colors"
      >
        <span class="material-symbols-outlined text-lg">label</span>
        <span>MANAGE_CATEGORIES</span>
      </button>
      <button
        @click="migrateBlog"
        :disabled="migrating"
        class="bg-surface-container-highest text-on-surface border border-on-surface px-6 py-3 font-code font-bold uppercase hover:bg-tertiary hover:text-on-tertiary flex items-center space-x-2 transition-colors disabled:opacity-50 ml-auto"
      >
        <span class="material-symbols-outlined text-lg">drive_file_move</span>
        <span>{{ migrating ? 'MIGRATING...' : 'MIGRATE_BLOG' }}</span>
      </button>
      <button
        @click="seedDb"
        :disabled="seeding"
        class="bg-surface-container-highest text-on-surface border border-on-surface px-6 py-3 font-code font-bold uppercase hover:bg-tertiary hover:text-on-tertiary flex items-center space-x-2 transition-colors disabled:opacity-50"
      >
        <span class="material-symbols-outlined text-lg">cloud_upload</span>
        <span>{{ seeding ? 'SEEDING...' : 'SEED_DB' }}</span>
      </button>
    </section>

    <!-- Category Manager -->
    <section v-if="showCategoryManager" class="border border-on-surface bg-surface-container-lowest p-6">
      <div class="flex justify-between items-center mb-4 pb-4 border-b border-on-surface">
        <h3 class="font-code text-on-surface font-bold uppercase">MANAGE_CATEGORIES</h3>
        <button @click="showCategoryManager = false" class="hover:text-tertiary transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="space-y-4">
        <!-- Add Category -->
        <div class="flex gap-2">
          <input
            v-model="newCategory"
            placeholder="New category name"
            @keyup.enter="addNewCategory"
            class="flex-1 bg-surface-dim border-b border-on-surface text-code font-code text-on-surface focus:ring-0 focus:border-tertiary px-2 py-2 outline-none"
          />
          <button
            @click="addNewCategory"
            class="bg-on-surface text-surface px-4 py-2 font-code font-bold uppercase hover:bg-tertiary transition-colors"
          >
            ADD
          </button>
        </div>
        <!-- Category List -->
        <div class="space-y-2">
          <div
            v-for="cat in categories"
            :key="cat"
            class="flex justify-between items-center bg-surface-dim border border-on-surface/20 px-4 py-2 font-code text-on-surface"
          >
            <span>{{ cat }}</span>
            <button
              @click="removeCategory(cat)"
              class="text-error hover:text-error-container transition-colors"
            >
              <span class="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- System Info -->
    <section v-if="seedMessage || migrateMessage" class="border border-tertiary bg-surface-container-lowest p-4">
      <p v-if="seedMessage" class="font-code text-code text-tertiary">{{ seedMessage }}</p>
      <p v-if="migrateMessage" class="font-code text-code text-tertiary">{{ migrateMessage }}</p>
    </section>

    <!-- Data Migration -->
    <DataMigrationPanel />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBlog } from '@/composables/useBlog'
import { useProjects } from '@/composables/useProjects'
import { useMedia } from '@/composables/useMedia'
import { useCategories } from '@/composables/useCategories'
import DataMigrationPanel from '@/components/admin/DataMigrationPanel.vue'

const blog = useBlog()
const projects = useProjects()
const media = useMedia()
const { categories, addCategory, removeCategory } = useCategories()

const seeding = ref(false)
const seedMessage = ref('')
const migrating = ref(false)
const migrateMessage = ref('')
const showCategoryManager = ref(false)
const newCategory = ref('')

async function seedDb() {
  seeding.value = true
  seedMessage.value = ''
  try {
    const { seedFirestore } = await import('@/firebase/seed')
    await seedFirestore()
    seedMessage.value = '✓ Database seeded successfully'
    setTimeout(() => { seedMessage.value = '' }, 3000)
  } catch (e) {
    seedMessage.value = '✗ Seeding failed: ' + (e as any).message
  } finally {
    seeding.value = false
  }
}

async function migrateBlog() {
  migrating.value = true
  migrateMessage.value = ''
  try {
    const { migrateBlogContent } = await import('@/firebase/migrate')
    const { migrated, skipped } = await migrateBlogContent()
    migrateMessage.value = `✓ Migration complete — ${migrated} migrated, ${skipped} already up to date`
    setTimeout(() => { migrateMessage.value = '' }, 5000)
  } catch (e) {
    migrateMessage.value = '✗ Migration failed: ' + (e as any).message
  } finally {
    migrating.value = false
  }
}

async function addNewCategory() {
  if (!newCategory.value.trim()) return
  try {
    await addCategory(newCategory.value.toUpperCase())
    newCategory.value = ''
  } catch (e) {
    console.error('Failed to add category:', e)
  }
}
</script>
