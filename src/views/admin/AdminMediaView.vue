<template>
  <div class="p-gutter md:p-margin-desktop overflow-x-hidden">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
      <div>
        <h1 class="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface uppercase tracking-tighter mb-2">MEDIA_REVIEWS</h1>
        <p class="font-code text-code text-on-surface-variant border-l-2 border-tertiary pl-3">SYSTEM_LOG: Indexing media entities.</p>
      </div>
      <button
        @click="showForm = !showForm"
        class="bg-on-surface text-surface py-2 px-6 font-label-md text-label-md uppercase tracking-wider hover:bg-tertiary hover:border-tertiary transition-all border border-transparent flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        ADD_RECORD
      </button>
    </div>

    <!-- Add/Edit Form -->
    <div v-if="showForm" class="border border-on-surface bg-surface-container-lowest p-6 mb-8">
      <h3 class="font-headline-md text-headline-md mb-6">NEW_RECORD</h3>
      <form @submit.prevent="saveMedia" class="grid grid-cols-2 gap-gutter">
        <div class="col-span-1 flex flex-col">
          <label class="font-code text-xs text-on-surface-variant uppercase mb-1">ID</label>
          <input v-model="formData.id" placeholder="MR-001" class="bg-primary-container text-on-surface border-b border-on-surface focus:border-tertiary font-body-md py-2 outline-none" />
        </div>
        <div class="col-span-1 flex flex-col">
          <label class="font-code text-xs text-on-surface-variant uppercase mb-1">TITLE</label>
          <input v-model="formData.title" placeholder="Title" class="bg-primary-container text-on-surface border-b border-on-surface focus:border-tertiary font-body-md py-2 outline-none" />
        </div>
        <div class="col-span-2 flex flex-col">
          <label class="font-code text-xs text-on-surface-variant uppercase mb-1">TYPE</label>
          <select v-model="formData.type" class="bg-primary-container text-on-surface border-b border-on-surface focus:border-tertiary font-body-md py-2 outline-none">
            <option value="MOVIE">MOVIE</option>
            <option value="TV_SERIES">TV_SERIES</option>
            <option value="TEXT">TEXT</option>
          </select>
        </div>
        <div class="col-span-1 flex flex-col">
          <label class="font-code text-xs text-on-surface-variant uppercase mb-1">RATING</label>
          <input v-model.number="formData.rating" type="number" min="0" max="10" step="0.1" class="bg-primary-container text-on-surface border-b border-on-surface focus:border-tertiary font-body-md py-2 outline-none" />
        </div>
        <div class="col-span-1 flex flex-col">
          <label class="font-code text-xs text-on-surface-variant uppercase mb-1">DATE</label>
          <input v-model="formData.date" type="date" class="bg-primary-container text-on-surface border-b border-on-surface focus:border-tertiary font-body-md py-2 outline-none" />
        </div>
        <div class="col-span-2 flex gap-4">
          <button type="submit" :disabled="media.loading.value" class="flex-1 bg-on-surface text-surface py-3 font-label-md uppercase hover:bg-tertiary transition-colors disabled:opacity-50">
            {{ media.loading.value ? 'SAVING...' : 'SAVE' }}
          </button>
          <button type="button" @click="showForm = false" class="flex-1 bg-surface-container-highest text-on-surface py-3 font-label-md uppercase hover:bg-surface-container transition-colors">
            CANCEL
          </button>
        </div>
      </form>
    </div>

    <!-- Media Table -->
    <div class="border border-on-surface bg-background">
      <div class="border-b border-on-surface p-4 flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-low">
        <div class="relative w-full sm:w-64">
          <input
            v-model="searchQuery"
            placeholder="SEARCH..."
            type="text"
            class="bg-background text-on-surface border border-on-surface py-1.5 pl-3 pr-8 font-code text-code focus:outline-none focus:border-tertiary w-full rounded-none outline-none"
          />
          <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">search</span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left font-code text-code whitespace-nowrap">
          <thead class="bg-surface-container-highest text-on-surface border-b border-on-surface uppercase font-label-md text-label-md">
            <tr>
              <th class="p-4">ID</th>
              <th class="p-4">TITLE</th>
              <th class="p-4">TYPE</th>
              <th class="p-4">RATING</th>
              <th class="p-4">DATE</th>
              <th class="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-on-surface/30">
            <tr v-for="card in filteredCards" :key="card.id" class="hover:bg-surface-container-low transition-colors">
              <td class="p-4 text-tertiary">#{{ card.id }}</td>
              <td class="p-4 font-bold text-on-surface">{{ card.title }}</td>
              <td class="p-4">
                <span class="border border-outline px-2 py-0.5 text-xs">{{ card.type }}</span>
              </td>
              <td class="p-4">{{ card.rating }}</td>
              <td class="p-4 text-on-surface-variant">{{ card.date }}</td>
              <td class="p-4 text-right">
                <button @click="editMedia(card)" class="text-on-surface-variant hover:text-tertiary px-2 transition-colors uppercase text-xs font-bold mr-2">EDIT</button>
                <button @click="deleteMedia(card.id)" class="text-on-surface-variant hover:text-error px-2 transition-colors uppercase text-xs font-bold">DEL</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMedia } from '@/composables/useMedia'
import type { MediaCardData } from '@/data/media'

const media = useMedia()
const showForm = ref(false)
const searchQuery = ref('')

const formData = ref<MediaCardData>({
  id: `MR-${Date.now()}`,
  type: 'MOVIE' as const,
  title: '',
  imageUrl: '',
  rating: 5,
  meta: [],
  description: '',
  ratingLabel: 'NEUTRAL',
  date: new Date().toISOString().split('T')[0],
} as MediaCardData)

const filteredCards = computed(() => {
  return media.items.value.filter(
    card => card.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || card.id.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

function editMedia(card: MediaCardData) {
  formData.value = { ...card }
  showForm.value = true
}

async function saveMedia() {
  try {
    const existing = media.items.value.find(c => c.id === formData.value.id)
    if (existing) {
      await media.update(formData.value.id, formData.value)
    } else {
      await media.add(formData.value)
    }
    showForm.value = false
    formData.value = {
      id: `MR-${Date.now()}`,
      type: 'MOVIE' as const,
      title: '',
      imageUrl: '',
      rating: 5,
      meta: [],
      description: '',
      ratingLabel: 'NEUTRAL',
      date: new Date().toISOString().split('T')[0],
    } as MediaCardData
  } catch (e) {
    console.error('Save failed:', e)
  }
}

async function deleteMedia(id: string) {
  if (confirm('Delete this media?')) {
    try {
      await media.del(id)
    } catch (e) {
      console.error('Delete failed:', e)
    }
  }
}
</script>
