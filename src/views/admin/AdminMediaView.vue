<template>
  <div class="flex h-full bg-surface">
    <!-- Left Panel: Media List -->
    <div class="w-full max-w-sm border-r border-on-surface bg-surface-dim flex flex-col">
      <!-- Header -->
      <div class="px-4 py-4 border-b border-on-surface">
        <h2 class="font-code text-on-surface font-bold uppercase text-sm mb-4">INDEX // MEDIA</h2>

        <!-- Search -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search title or ID"
          class="w-full bg-surface border-b border-on-surface text-on-surface font-code text-sm px-2 py-2 outline-none focus:border-tertiary mb-3"
        />

        <!-- Type Filter -->
        <select
          v-model="typeFilter"
          class="w-full bg-surface border-b border-on-surface text-on-surface font-code text-sm px-2 py-2 outline-none focus:border-tertiary"
        >
          <option value="ALL">ALL TYPES</option>
          <option value="MOVIE">MOVIE</option>
          <option value="TV_SERIES">TV_SERIES</option>
          <option value="TEXT">TEXT</option>
        </select>
      </div>

      <!-- Media List -->
      <div class="flex-1 overflow-y-auto">
        <div
          v-for="card in filteredCards"
          :key="card.id"
          @click="selectCard(card)"
          :class="[
            'px-4 py-3 border-b border-on-surface/20 cursor-pointer transition-colors hover:bg-surface',
            selectedCard?.id === card.id ? 'bg-surface-container-highest' : 'bg-surface-dim'
          ]"
        >
          <div class="flex justify-between items-start gap-2">
            <div class="flex-1 min-w-0">
              <p class="font-code text-sm text-on-surface truncate font-bold">{{ card.title }}</p>
              <p class="font-code text-xs text-on-surface-variant">{{ card.type }}</p>
            </div>
            <span class="font-code text-xs text-tertiary whitespace-nowrap">{{ card.rating }}</span>
          </div>
        </div>
      </div>

      <!-- New Button -->
      <div class="border-t border-on-surface p-4">
        <button
          @click="newCard"
          class="w-full bg-on-surface text-surface border border-on-surface px-4 py-2 font-code font-bold uppercase text-sm hover:bg-tertiary hover:text-on-tertiary transition-colors flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-lg">add</span>
          <span>NEW</span>
        </button>
      </div>
    </div>

    <!-- Right Panel: Editor -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <div v-if="editingCard" class="flex-1 overflow-y-auto bg-surface">
        <div class="max-w-4xl mx-auto">
          <!-- API Lookup Section -->
          <section class="border-b border-on-surface">
            <div class="px-6 py-4 border-b border-on-surface/50 bg-surface-dim">
              <h3 class="font-code text-xs text-on-surface-variant font-bold uppercase mb-3">API_LOOKUP</h3>
              <div class="flex gap-2">
                <input
                  v-model="lookupQuery"
                  type="text"
                  :placeholder="editingCard.type === 'TEXT' ? 'Book title...' : 'Movie/TV title...'"
                  class="flex-1 bg-surface border-b border-on-surface text-on-surface font-code text-sm px-2 py-2 outline-none focus:border-tertiary"
                  @keyup.enter="performLookup"
                />
                <button
                  @click="performLookup"
                  :disabled="lookupLoading || !lookupQuery.trim()"
                  class="bg-on-surface text-surface px-4 py-2 font-code font-bold uppercase text-sm hover:bg-tertiary disabled:opacity-50 transition-colors"
                >
                  {{ lookupLoading ? 'SEARCHING...' : 'SEARCH' }}
                </button>
              </div>
            </div>

            <!-- Lookup Results -->
            <div v-if="lookupResults.length > 0" class="max-h-48 overflow-y-auto">
              <div
                v-for="(result, idx) in lookupResults"
                :key="idx"
                @click="applyLookupResult(result)"
                class="px-4 py-3 border-b border-on-surface/20 cursor-pointer hover:bg-surface-container-lowest transition-colors flex gap-3"
              >
                <img
                  v-if="'posterUrl' in result && result.posterUrl"
                  :src="result.posterUrl"
                  :alt="result.title"
                  class="w-10 h-14 object-cover"
                />
                <img
                  v-else-if="'imageUrl' in result && result.imageUrl"
                  :src="result.imageUrl"
                  :alt="result.title"
                  class="w-10 h-14 object-cover"
                />
                <div class="flex-1">
                  <p class="font-code text-sm font-bold text-on-surface">{{ result.title }}</p>
                  <p class="font-code text-xs text-on-surface-variant">{{ result.year }}</p>
                </div>
              </div>
            </div>

            <!-- Error/Info -->
            <div v-if="lookupError" class="px-4 py-3 bg-error/10 border-t border-error/30">
              <p class="font-code text-xs text-error">{{ lookupError }}</p>
            </div>
          </section>

          <!-- Overview Section -->
          <section class="border-b border-on-surface">
            <div class="px-6 py-4">
              <h3 class="font-code text-xs text-on-surface-variant font-bold uppercase mb-4">OVERVIEW</h3>
              <div class="space-y-4">
                <div>
                  <label class="block font-code text-xs text-on-surface-variant uppercase mb-1">ID</label>
                  <input
                    v-model="editingCard.id"
                    type="text"
                    :readonly="!!selectedCard"
                    class="w-full bg-surface border-b border-on-surface text-on-surface font-code px-2 py-2 outline-none focus:border-tertiary disabled:opacity-50"
                  />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block font-code text-xs text-on-surface-variant uppercase mb-1">TITLE</label>
                    <input
                      v-model="editingCard.title"
                      type="text"
                      class="w-full bg-surface border-b border-on-surface text-on-surface font-code px-2 py-2 outline-none focus:border-tertiary"
                    />
                  </div>
                  <div>
                    <label class="block font-code text-xs text-on-surface-variant uppercase mb-1">TYPE</label>
                    <select
                      v-model="editingCard.type"
                      class="w-full bg-surface border-b border-on-surface text-on-surface font-code px-2 py-2 outline-none focus:border-tertiary"
                    >
                      <option value="MOVIE">MOVIE</option>
                      <option value="TV_SERIES">TV_SERIES</option>
                      <option value="TEXT">TEXT</option>
                    </select>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block font-code text-xs text-on-surface-variant uppercase mb-1">DATE</label>
                    <input
                      v-model="editingCard.date"
                      type="date"
                      class="w-full bg-surface border-b border-on-surface text-on-surface font-code px-2 py-2 outline-none focus:border-tertiary"
                    />
                  </div>
                  <div>
                    <label class="block font-code text-xs text-on-surface-variant uppercase mb-1">RATING (0-10)</label>
                    <input
                      v-model.number="editingCard.rating"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      class="w-full bg-surface border-b border-on-surface text-on-surface font-code px-2 py-2 outline-none focus:border-tertiary"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block font-code text-xs text-on-surface-variant uppercase mb-1">RATING_LABEL</label>
                    <input
                      v-model="editingCard.ratingLabel"
                      type="text"
                      placeholder="EXCELLENT, SOLID, etc."
                      class="w-full bg-surface border-b border-on-surface text-on-surface font-code px-2 py-2 outline-none focus:border-tertiary"
                    />
                  </div>
                  <div class="flex items-end">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input v-model="editingCard.isCompleted" type="checkbox" class="w-4 h-4" />
                      <span class="font-code text-sm text-on-surface">COMPLETED</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label class="block font-code text-xs text-on-surface-variant uppercase mb-1">EXTERNAL_URL</label>
                  <input
                    v-model="editingCard.externalUrl"
                    type="url"
                    placeholder="https://..."
                    class="w-full bg-surface border-b border-on-surface text-on-surface font-code px-2 py-2 outline-none focus:border-tertiary"
                  />
                </div>
              </div>
            </div>
          </section>

          <!-- Image Section -->
          <section class="border-b border-on-surface">
            <div class="px-6 py-4">
              <h3 class="font-code text-xs text-on-surface-variant font-bold uppercase mb-4">IMAGE</h3>
              <div class="mb-4">
                <img
                  v-if="editingCard.imageUrl"
                  :src="editingCard.imageUrl"
                  :alt="editingCard.title"
                  class="w-full max-w-xs max-h-64 object-cover border border-on-surface/30"
                />
                <div v-else class="w-full max-w-xs h-48 bg-surface-dim border border-on-surface/30 flex items-center justify-center">
                  <span class="font-code text-xs text-on-surface-variant">NO_IMAGE</span>
                </div>
              </div>
              <label class="block font-code text-xs text-on-surface-variant uppercase mb-1">IMAGE_URL</label>
              <input
                v-model="editingCard.imageUrl"
                type="url"
                placeholder="https://..."
                class="w-full bg-surface border-b border-on-surface text-on-surface font-code px-2 py-2 outline-none focus:border-tertiary"
              />
            </div>
          </section>

          <!-- Meta Section -->
          <section class="border-b border-on-surface">
            <div class="px-6 py-4">
              <h3 class="font-code text-xs text-on-surface-variant font-bold uppercase mb-4">META</h3>
              <div class="flex flex-wrap gap-2 mb-4">
                <div
                  v-for="(meta, idx) in editingCard.meta"
                  :key="idx"
                  class="bg-on-surface/10 border border-on-surface/30 px-3 py-1 font-code text-sm text-on-surface flex items-center gap-2"
                >
                  <span>{{ meta }}</span>
                  <button
                    @click="removeMeta(idx)"
                    class="text-error hover:text-error-container transition-colors"
                  >
                    <span class="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="newMeta"
                  type="text"
                  placeholder="KEY: VALUE"
                  class="flex-1 bg-surface border-b border-on-surface text-on-surface font-code text-sm px-2 py-2 outline-none focus:border-tertiary"
                  @keyup.enter="addMeta"
                />
                <button
                  @click="addMeta"
                  class="bg-on-surface text-surface px-4 py-2 font-code font-bold uppercase text-sm hover:bg-tertiary transition-colors disabled:opacity-50"
                  :disabled="!newMeta.trim()"
                >
                  ADD
                </button>
              </div>
            </div>
          </section>

          <!-- Metrics Section -->
          <section class="border-b border-on-surface">
            <div class="px-6 py-4">
              <h3 class="font-code text-xs text-on-surface-variant font-bold uppercase mb-4">METRICS</h3>
              <div class="space-y-3">
                <div>
                  <label class="block font-code text-xs text-on-surface-variant uppercase mb-1">NARRATIVE_ARCH (0-100)</label>
                  <input
                    v-model.number="metricsData.narrativeArch"
                    type="number"
                    min="0"
                    max="100"
                    class="w-full bg-surface border-b border-on-surface text-on-surface font-code px-2 py-2 outline-none focus:border-tertiary"
                  />
                </div>
                <div>
                  <label class="block font-code text-xs text-on-surface-variant uppercase mb-1">AESTHETIC_EXEC (0-100)</label>
                  <input
                    v-model.number="metricsData.aestheticExec"
                    type="number"
                    min="0"
                    max="100"
                    class="w-full bg-surface border-b border-on-surface text-on-surface font-code px-2 py-2 outline-none focus:border-tertiary"
                  />
                </div>
                <div>
                  <label class="block font-code text-xs text-on-surface-variant uppercase mb-1">COHERENCE_RATING (0-100)</label>
                  <input
                    v-model.number="metricsData.coherenceRating"
                    type="number"
                    min="0"
                    max="100"
                    class="w-full bg-surface border-b border-on-surface text-on-surface font-code px-2 py-2 outline-none focus:border-tertiary"
                  />
                </div>
              </div>
            </div>
          </section>

          <!-- Review Section -->
          <section class="border-b border-on-surface">
            <div class="px-6 py-4">
              <h3 class="font-code text-xs text-on-surface-variant font-bold uppercase mb-2">REVIEW</h3>
              <textarea
                v-model="editingCard.description"
                rows="6"
                class="w-full bg-surface border border-on-surface text-on-surface font-code text-sm px-3 py-2 outline-none focus:border-tertiary resize-y"
                placeholder="Enter review text..."
              />
            </div>
          </section>

          <!-- Action Buttons -->
          <section class="px-6 py-4 border-t border-on-surface flex gap-4 bg-surface-dim">
            <button
              @click="saveCard"
              :disabled="saving"
              class="flex-1 bg-on-surface text-surface border border-on-surface px-6 py-3 font-code font-bold uppercase hover:bg-tertiary hover:text-on-tertiary transition-colors disabled:opacity-50"
            >
              {{ saving ? 'SAVING...' : 'SAVE' }}
            </button>
            <button
              v-if="selectedCard"
              @click="deleteCard"
              class="bg-error text-surface border border-error px-6 py-3 font-code font-bold uppercase hover:bg-error-container transition-colors"
            >
              DELETE
            </button>
          </section>
        </div>
      </div>

      <!-- No Selection -->
      <div v-else class="flex-1 flex items-center justify-center text-center">
        <div>
          <p class="font-code text-on-surface-variant uppercase mb-4">SELECT_OR_CREATE_MEDIA</p>
          <button
            @click="newCard"
            class="bg-on-surface text-surface px-6 py-3 font-code font-bold uppercase hover:bg-tertiary hover:text-on-tertiary transition-colors"
          >
            CREATE NEW
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMedia } from '@/composables/useMedia'
import { useMediaLookup } from '@/composables/useMediaLookup'
import type { MediaCardData, MediaMetrics } from '@/data/media'

const media = useMedia()
const { searchTMDB, searchBooks } = useMediaLookup()

const searchQuery = ref('')
const typeFilter = ref('ALL')
const selectedCard = ref<MediaCardData | null>(null)
const editingCard = ref<MediaCardData | null>(null)
const lookupQuery = ref('')
const lookupResults = ref<any[]>([])
const lookupLoading = ref(false)
const lookupError = ref('')
const newMeta = ref('')
const saving = ref(false)
const metricsData = ref<MediaMetrics>({
  narrativeArch: 0,
  aestheticExec: 0,
  coherenceRating: 0,
})

const filteredCards = computed(() => {
  return media.items.value.filter(card => {
    const matchesSearch = !searchQuery.value ||
      card.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      card.id.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesType = typeFilter.value === 'ALL' || card.type === typeFilter.value

    return matchesSearch && matchesType
  })
})

function selectCard(card: MediaCardData) {
  selectedCard.value = card
  editingCard.value = structuredClone(card)
  metricsData.value = card.metrics || { narrativeArch: 0, aestheticExec: 0, coherenceRating: 0 }
  lookupQuery.value = ''
  lookupResults.value = []
  lookupError.value = ''
}

function newCard() {
  selectedCard.value = null
  editingCard.value = {
    id: '',
    type: 'MOVIE' as const,
    title: '',
    imageUrl: '',
    rating: 5,
    meta: [],
    description: '',
    ratingLabel: '',
    date: new Date().toISOString().split('T')[0],
    isCompleted: false,
  } as MediaCardData
  metricsData.value = { narrativeArch: 0, aestheticExec: 0, coherenceRating: 0 }
  lookupQuery.value = ''
  lookupResults.value = []
  lookupError.value = ''
}

async function performLookup() {
  if (!lookupQuery.value.trim() || !editingCard.value) return

  lookupLoading.value = true
  lookupError.value = ''
  lookupResults.value = []

  try {
    if (editingCard.value.type === 'TEXT') {
      lookupResults.value = await searchBooks(lookupQuery.value)
    } else {
      lookupResults.value = await searchTMDB(
        lookupQuery.value,
        editingCard.value.type as 'MOVIE' | 'TV_SERIES'
      )
    }
  } catch (e) {
    lookupError.value = (e as Error).message
  } finally {
    lookupLoading.value = false
  }
}

function applyLookupResult(result: any) {
  if (!editingCard.value) return

  editingCard.value.title = result.title
  editingCard.value.description = result.overview || result.description || ''

  if ('posterUrl' in result && result.posterUrl) {
    editingCard.value.imageUrl = result.posterUrl
  } else if ('imageUrl' in result && result.imageUrl) {
    editingCard.value.imageUrl = result.imageUrl
  }

  if (result.externalUrl) {
    editingCard.value.externalUrl = result.externalUrl
  }

  editingCard.value.meta = result.meta || []

  lookupResults.value = []
  lookupQuery.value = ''
}

function addMeta() {
  if (!newMeta.value.trim() || !editingCard.value) return
  if (!editingCard.value.meta.includes(newMeta.value)) {
    editingCard.value.meta.push(newMeta.value)
  }
  newMeta.value = ''
}

function removeMeta(idx: number) {
  if (!editingCard.value) return
  editingCard.value.meta.splice(idx, 1)
}

async function saveCard() {
  if (!editingCard.value || !editingCard.value.id || !editingCard.value.title) {
    alert('ID and Title are required')
    return
  }

  saving.value = true
  try {
    const cardData: MediaCardData = {
      ...editingCard.value,
      metrics: {
        narrativeArch: metricsData.value.narrativeArch || 0,
        aestheticExec: metricsData.value.aestheticExec || 0,
        coherenceRating: metricsData.value.coherenceRating || 0,
      },
    }

    if (selectedCard.value) {
      await media.update(selectedCard.value.id, cardData)
    } else {
      await media.add(cardData)
    }

    selectedCard.value = null
    editingCard.value = null
  } catch (e) {
    alert('Failed to save: ' + (e as Error).message)
  } finally {
    saving.value = false
  }
}

async function deleteCard() {
  if (!selectedCard.value) return
  if (!confirm(`Delete "${selectedCard.value.title}"?`)) return

  saving.value = true
  try {
    await media.del(selectedCard.value.id)
    selectedCard.value = null
    editingCard.value = null
  } catch (e) {
    alert('Failed to delete: ' + (e as Error).message)
  } finally {
    saving.value = false
  }
}
</script>
