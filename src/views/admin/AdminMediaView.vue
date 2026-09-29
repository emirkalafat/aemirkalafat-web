<template>
  <div class="flex h-full bg-surface">
    <!-- Left Panel: Media List -->
    <div class="w-full max-w-sm border-r border-on-surface bg-surface-dim flex flex-col">
      <div class="px-4 py-4 border-b border-on-surface">
        <h2 class="font-code text-on-surface font-bold uppercase text-sm mb-4">INDEX // MEDIA</h2>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search title or ID"
          :class="[F.input, 'mb-3']"
        />
        <select v-model="typeFilter" :class="F.input">
          <option value="ALL">ALL TYPES</option>
          <option value="MOVIE">MOVIE</option>
          <option value="TV_SERIES">TV_SERIES</option>
          <option value="TEXT">TEXT</option>
        </select>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div
          v-for="row in listRows"
          :key="row.card.id"
          @click="selectCard(row.card)"
          :class="[
            'py-3 pr-4 border-b border-on-surface/20 cursor-pointer transition-colors hover:bg-surface',
            row.child ? 'pl-10 border-l-4 border-l-tertiary/40' : 'pl-4',
            selectedCard?.id === row.card.id ? 'bg-surface-container-highest' : 'bg-surface-dim'
          ]"
        >
          <div class="flex justify-between items-start gap-2">
            <button
              v-if="row.count"
              type="button"
              :aria-expanded="isExpanded(row.card.id)"
              :aria-label="`${isExpanded(row.card.id) ? 'Collapse' : 'Expand'} seasons of ${row.card.title}`"
              class="shrink-0 -ml-1 text-on-surface-variant hover:text-tertiary-text transition-colors"
              @click.stop="toggleExpanded(row.card.id)"
            >
              <span
                class="material-symbols-outlined text-[20px] block transition-transform"
                :class="isExpanded(row.card.id) ? 'rotate-0' : '-rotate-90'"
              >expand_more</span>
            </button>
            <div class="flex-1 min-w-0">
              <p class="font-code text-sm text-on-surface truncate font-bold">
                {{ row.child ? `S${row.card.seasonNumber}${row.card.seasonTitle ? ' · ' + row.card.seasonTitle : ''}` : row.card.title }}
              </p>
              <p class="font-code text-xs text-on-surface-variant">
                {{ row.card.kind === 'SERIES' ? `SERIES · ${row.count} SEASONS` : row.child ? 'SEASON' : row.card.type }}
              </p>
            </div>
            <span class="font-code text-xs text-tertiary-text whitespace-nowrap">{{ row.card.rating }}</span>
          </div>
        </div>
      </div>

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

          <!-- Legacy series banner -->
          <section v-if="isLegacySeries" class="border-b border-on-surface bg-tertiary/10">
            <div class="px-6 py-4 flex flex-wrap items-end gap-4">
              <div class="flex-1 min-w-[16rem]">
                <h3 class="font-code text-xs text-tertiary-text font-bold uppercase mb-1">LEGACY_SERIES</h3>
                <p class="font-code text-xs text-on-surface-variant">
                  This show has a single rating. Convert it into a series: the current rating, review and date move to one season, and you can add the others.
                </p>
              </div>
              <div>
                <label :class="F.label">SEASON_NUMBER</label>
                <input v-model.number="convertSeason" type="number" min="1" :class="[F.input, 'w-24']" />
              </div>
              <button
                @click="convertLegacy"
                :disabled="saving"
                class="bg-tertiary text-on-tertiary px-4 py-2 font-code font-bold uppercase text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {{ saving ? 'CONVERTING...' : 'CONVERT TO SEASONS' }}
              </button>
            </div>
          </section>

          <!-- Season: link back to series -->
          <section v-if="editingCard.kind === 'SEASON'" class="border-b border-on-surface bg-surface-dim">
            <div class="px-6 py-3 flex items-center justify-between gap-4">
              <p class="font-code text-xs text-on-surface-variant uppercase">
                SEASON OF <span class="text-on-surface font-bold">{{ parentSeries?.title ?? editingCard.seriesId }}</span>
              </p>
              <button
                v-if="parentSeries"
                @click="selectCard(parentSeries)"
                class="font-code text-xs uppercase text-tertiary-text hover:underline flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-sm">arrow_back</span> BACK TO SERIES
              </button>
            </div>
          </section>

          <!-- API Lookup Section -->
          <section v-if="editingCard.kind !== 'SEASON'" class="border-b border-on-surface">
            <div class="px-6 py-4 border-b border-on-surface/50 bg-surface-dim">
              <h3 class="font-code text-xs text-on-surface-variant font-bold uppercase mb-3">API_LOOKUP</h3>
              <div class="flex gap-2">
                <input
                  v-model="lookupQuery"
                  type="text"
                  :placeholder="editingCard.type === 'TEXT' ? 'Book title...' : 'Movie/TV title...'"
                  :class="['flex-1', F.input]"
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
                  <label :class="F.label">ID</label>
                  <input
                    v-model="editingCard.id"
                    type="text"
                    :readonly="!!selectedCard || editingCard.kind === 'SEASON'"
                    :class="F.input"
                  />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label :class="F.label">TITLE</label>
                    <input
                      v-model="editingCard.title"
                      type="text"
                      :readonly="editingCard.kind === 'SEASON'"
                      :class="[F.input, editingCard.kind === 'SEASON' && 'opacity-60']"
                    />
                  </div>
                  <div>
                    <label :class="F.label">TYPE</label>
                    <select
                      v-model="editingCard.type"
                      :disabled="editingCard.kind === 'SEASON' || !!selectedCard"
                      :class="[F.input, (editingCard.kind === 'SEASON' || !!selectedCard) && 'opacity-60']"
                    >
                      <option value="MOVIE">MOVIE</option>
                      <option value="TV_SERIES">TV_SERIES</option>
                      <option value="TEXT">TEXT</option>
                    </select>
                  </div>
                </div>

                <!-- SEASON fields -->
                <template v-if="editingCard.kind === 'SEASON'">
                  <div class="grid grid-cols-3 gap-4">
                    <div>
                      <label :class="F.label">SEASON_NUMBER</label>
                      <input
                        v-model.number="editingCard.seasonNumber"
                        type="number"
                        min="1"
                        :readonly="!!selectedCard"
                        :class="[F.input, !!selectedCard && 'opacity-60']"
                      />
                    </div>
                    <div>
                      <label :class="F.label">SEASON_TITLE (optional)</label>
                      <input v-model="editingCard.seasonTitle" type="text" :class="F.input" />
                    </div>
                    <div>
                      <label :class="F.label">EPISODES</label>
                      <input v-model.number="editingCard.episodeCount" type="number" min="0" :class="F.input" />
                    </div>
                  </div>
                </template>

                <!-- SERIES fields -->
                <template v-else-if="editingCard.kind === 'SERIES'">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label :class="F.label">TMDB_ID</label>
                      <div class="flex gap-2">
                        <input v-model.number="editingCard.tmdbId" type="number" :class="['flex-1', F.input]" />
                        <button
                          @click="syncTmdb"
                          :disabled="!editingCard.tmdbId || tmdbLoading"
                          class="bg-on-surface text-surface px-3 font-code font-bold uppercase text-xs hover:bg-tertiary disabled:opacity-50 transition-colors"
                        >
                          {{ tmdbLoading ? '...' : 'SYNC' }}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label :class="F.label">TOTAL_SEASONS</label>
                      <input v-model.number="editingCard.totalSeasons" type="number" min="0" :class="F.input" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="border border-on-surface/30 px-3 py-2">
                      <p :class="F.label">AUTO_AVERAGE</p>
                      <p class="font-code text-on-surface">
                        {{ autoAverage ?? '—' }}
                        <span class="text-xs text-on-surface-variant">({{ mySeasons.length }} seasons)</span>
                      </p>
                    </div>
                    <div>
                      <label :class="F.label">RATING_OVERRIDE (0-10, empty = auto)</label>
                      <div class="flex gap-2">
                        <input v-model="overrideText" type="number" min="0" max="10" step="0.1" placeholder="auto" :class="['flex-1', F.input]" />
                        <button
                          v-if="overrideText !== ''"
                          @click="overrideText = ''"
                          class="px-3 font-code text-xs uppercase text-on-surface-variant hover:text-error"
                        >
                          CLEAR
                        </button>
                      </div>
                    </div>
                  </div>
                </template>

                <div class="grid grid-cols-2 gap-4">
                  <div v-if="editingCard.kind !== 'SERIES'">
                    <label :class="F.label">{{ editingCard.kind === 'SEASON' ? 'WATCHED_DATE' : 'DATE' }}</label>
                    <input v-model="editingCard.date" type="date" :class="F.input" />
                  </div>
                  <div v-if="editingCard.kind !== 'SERIES'">
                    <label :class="F.label">RATING (0-10)</label>
                    <input v-model.number="editingCard.rating" type="number" min="0" max="10" step="0.1" :class="F.input" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label :class="F.label">RATING_LABEL</label>
                    <input
                      v-model="editingCard.ratingLabel"
                      type="text"
                      placeholder="EXCELLENT, SOLID, etc."
                      :class="F.input"
                    />
                  </div>
                  <div class="flex items-end">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input v-model="editingCard.isCompleted" type="checkbox" class="w-4 h-4" />
                      <span class="font-code text-sm text-on-surface">COMPLETED</span>
                    </label>
                  </div>
                </div>
                <div v-if="editingCard.kind === 'SEASON'">
                  <label :class="F.label">SUMMARY (short, shown on the series page)</label>
                  <textarea
                    v-model="editingCard.summary"
                    rows="2"
                    maxlength="220"
                    placeholder="One or two sentences on this season..."
                    :class="[F.input, 'border border-on-surface px-3 resize-y']"
                  />
                </div>
                <div v-if="editingCard.kind !== 'SEASON'">
                  <label :class="F.label">EXTERNAL_URL</label>
                  <input v-model="editingCard.externalUrl" type="url" placeholder="https://..." :class="F.input" />
                </div>
              </div>
            </div>
          </section>

          <!-- Seasons Section (series) -->
          <section v-if="editingCard.kind === 'SERIES'" class="border-b border-on-surface">
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-code text-xs text-on-surface-variant font-bold uppercase">SEASONS ({{ mySeasons.length }})</h3>
                <button
                  @click="newSeason"
                  :disabled="!selectedCard || seasonsFull"
                  :title="!selectedCard ? 'Save the series first' : seasonsFull ? `All ${editingCard.totalSeasons} seasons are added` : ''"
                  class="bg-on-surface text-surface px-3 py-1.5 font-code font-bold uppercase text-xs hover:bg-tertiary disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  <span class="material-symbols-outlined text-sm">add</span> ADD SEASON
                </button>
              </div>
              <div v-if="mySeasons.length" class="border border-on-surface/30">
                <div
                  v-for="s in mySeasons"
                  :key="s.id"
                  @click="selectCard(s)"
                  class="px-4 py-3 border-b border-on-surface/20 last:border-b-0 cursor-pointer hover:bg-surface-container-lowest transition-colors flex items-center gap-4"
                >
                  <span class="font-code font-bold text-sm w-8">S{{ s.seasonNumber }}</span>
                  <span class="flex-1 font-code text-sm text-on-surface truncate">{{ s.seasonTitle || `Season ${s.seasonNumber}` }}</span>
                  <span class="font-code text-xs text-on-surface-variant">{{ s.date }}</span>
                  <span class="font-code text-sm text-tertiary-text w-10 text-right">{{ s.rating }}</span>
                </div>
              </div>
              <p v-else class="font-code text-xs text-on-surface-variant">
                {{ selectedCard ? 'No seasons yet. Add the first one.' : 'Save the series, then add its seasons.' }}
              </p>
            </div>
          </section>

          <!-- Image Section -->
          <section class="border-b border-on-surface">
            <div class="px-6 py-4">
              <h3 class="font-code text-xs text-on-surface-variant font-bold uppercase mb-4">
                {{ editingCard.kind === 'SEASON' ? 'SEASON_POSTER' : 'IMAGE' }}
              </h3>
              <div class="mb-4">
                <div class="w-40 aspect-[2/3] bg-surface-dim border border-on-surface/30 overflow-hidden flex items-center justify-center">
                  <img
                    v-if="editingCard.imageUrl"
                    :src="editingCard.imageUrl"
                    :alt="editingCard.title"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="font-code text-xs text-on-surface-variant">NO_IMAGE</span>
                </div>
              </div>
              <label :class="F.label">IMAGE_URL</label>
              <input v-model="editingCard.imageUrl" type="url" placeholder="https://..." :class="F.input" />
            </div>
          </section>

          <!-- Meta Section -->
          <section v-if="editingCard.kind !== 'SEASON'" class="border-b border-on-surface">
            <div class="px-6 py-4">
              <h3 class="font-code text-xs text-on-surface-variant font-bold uppercase mb-4">META</h3>
              <div class="flex flex-wrap gap-2 mb-4">
                <div
                  v-for="(meta, idx) in editingCard.meta"
                  :key="idx"
                  class="bg-on-surface/10 border border-on-surface/30 px-3 py-1 font-code text-sm text-on-surface flex items-center gap-2"
                >
                  <span>{{ meta }}</span>
                  <button @click="removeMeta(idx)" class="text-error hover:text-error-container transition-colors">
                    <span class="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="newMeta"
                  type="text"
                  placeholder="KEY: VALUE"
                  :class="['flex-1', F.input]"
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
          <section v-if="editingCard.kind !== 'SERIES'" class="border-b border-on-surface">
            <div class="px-6 py-4">
              <h3 class="font-code text-xs text-on-surface-variant font-bold uppercase mb-4">METRICS</h3>
              <div class="space-y-3">
                <div v-for="m in METRIC_FIELDS" :key="m.key">
                  <label :class="F.label">{{ m.label }} (0-100)</label>
                  <input v-model.number="metricsData[m.key]" type="number" min="0" max="100" :class="F.input" />
                </div>
              </div>
            </div>
          </section>

          <!-- Review Section -->
          <section class="border-b border-on-surface">
            <div class="px-6 py-4">
              <h3 class="font-code text-xs text-on-surface-variant font-bold uppercase mb-2">
                {{ editingCard.kind === 'SERIES' ? 'SERIES_VERDICT (overall thoughts)' : 'REVIEW' }}
              </h3>
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
import { ref, computed, watch } from 'vue'
import { useMedia } from '@/composables/useMedia'
import { useMediaLookup, type TmdbSeason } from '@/composables/useMediaLookup'
import type { MediaCardData, MediaMetrics } from '@/data/media'
import { averageRating, seasonDocId, seasonsOf, slugify } from '@/utils/media'

const F = {
  input: 'w-full bg-surface border-b border-on-surface text-on-surface font-code text-sm px-2 py-2 outline-none focus:border-tertiary',
  label: 'block font-code text-xs text-on-surface-variant uppercase mb-1',
}

const METRIC_FIELDS: { key: keyof MediaMetrics; label: string }[] = [
  { key: 'narrativeArch', label: 'NARRATIVE_ARCH' },
  { key: 'aestheticExec', label: 'AESTHETIC_EXEC' },
  { key: 'coherenceRating', label: 'COHERENCE_RATING' },
]

const media = useMedia()
const { searchTMDB, searchBooks, getTvSeasons } = useMediaLookup()

// structuredClone rejects reactive proxies; the data here is plain JSON, so a JSON round-trip is safe.
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

const today = () => new Date().toISOString().split('T')[0]!
const emptyMetrics = (): MediaMetrics => ({ narrativeArch: 0, aestheticExec: 0, coherenceRating: 0 })

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
const metricsData = ref<MediaMetrics>(emptyMetrics())
const overrideText = ref<string | number>('')
const convertSeason = ref(1)
const tmdbLoading = ref(false)
const tmdbSeasons = ref<TmdbSeason[]>([])

const expanded = ref<Record<string, boolean>>({})
const isExpanded = (id: string) => !!expanded.value[id]
const toggleExpanded = (id: string) => {
  expanded.value[id] = !expanded.value[id]
}

const listRows = computed(() => {
  const all = media.items.value
  const q = searchQuery.value.toLowerCase()
  const matches = (c: MediaCardData) =>
    !q || c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)

  const rows: { card: MediaCardData; child: boolean; count: number }[] = []
  for (const top of all) {
    if (top.kind === 'SEASON') continue
    if (!matches(top) || (typeFilter.value !== 'ALL' && top.type !== typeFilter.value)) continue
    const seasons = top.kind === 'SERIES' ? seasonsOf(all, top.id) : []
    rows.push({ card: top, child: false, count: seasons.length })
    if (isExpanded(top.id)) {
      for (const s of seasons) rows.push({ card: s, child: true, count: 0 })
    }
  }
  const rootIds = new Set(all.filter(c => c.kind !== 'SEASON').map(c => c.id))
  for (const s of all) {
    if (s.kind === 'SEASON' && !rootIds.has(s.seriesId ?? '') && matches(s)) rows.push({ card: s, child: false, count: 0 })
  }
  return rows
})

const isLegacySeries = computed(() => !!selectedCard.value && selectedCard.value.type === 'TV_SERIES' && !selectedCard.value.kind)
const parentSeries = computed(() =>
  editingCard.value?.kind === 'SEASON' ? media.getById(editingCard.value.seriesId ?? '') : undefined,
)
const mySeasons = computed(() =>
  editingCard.value?.kind === 'SERIES' ? seasonsOf(media.items.value, editingCard.value.id) : [],
)
const autoAverage = computed(() => averageRating(mySeasons.value))
const seasonsFull = computed(() => {
  const total = editingCard.value?.totalSeasons
  return !!total && mySeasons.value.length >= total
})

function resetLookup() {
  lookupQuery.value = ''
  lookupResults.value = []
  lookupError.value = ''
}

function selectCard(card: MediaCardData) {
  if (card.kind === 'SEASON' && card.seriesId) expanded.value[card.seriesId] = true
  selectedCard.value = card
  editingCard.value = clone(card)
  metricsData.value = card.metrics ? clone(card.metrics) : emptyMetrics()
  overrideText.value = card.ratingOverride ?? ''
  convertSeason.value = 1
  tmdbSeasons.value = []
  resetLookup()
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
    date: today(),
    isCompleted: false,
  } as MediaCardData
  metricsData.value = emptyMetrics()
  overrideText.value = ''
  tmdbSeasons.value = []
  resetLookup()
}

// New TV entries are series roots; switching back to another type makes it a plain entry again.
watch(
  () => editingCard.value?.type,
  type => {
    const c = editingCard.value
    if (!c || selectedCard.value || c.kind === 'SEASON') return
    c.kind = type === 'TV_SERIES' ? 'SERIES' : undefined
  },
)

async function performLookup() {
  if (!lookupQuery.value.trim() || !editingCard.value) return

  lookupLoading.value = true
  lookupError.value = ''
  lookupResults.value = []

  try {
    if (editingCard.value.type === 'TEXT') {
      lookupResults.value = await searchBooks(lookupQuery.value)
    } else {
      lookupResults.value = await searchTMDB(lookupQuery.value, editingCard.value.type as 'MOVIE' | 'TV_SERIES')
    }
  } catch (e) {
    lookupError.value = (e as Error).message
  } finally {
    lookupLoading.value = false
  }
}

function applyLookupResult(result: any) {
  const c = editingCard.value
  if (!c) return

  c.title = result.title
  if (!selectedCard.value && !c.id) c.id = slugify(result.title)
  if (c.kind !== 'SERIES') c.description = result.overview || result.description || ''

  if ('posterUrl' in result && result.posterUrl) c.imageUrl = result.posterUrl
  else if ('imageUrl' in result && result.imageUrl) c.imageUrl = result.imageUrl

  if (result.externalUrl) c.externalUrl = result.externalUrl
  c.meta = result.meta || []

  if (c.kind === 'SERIES' && result.tmdbId) {
    c.tmdbId = result.tmdbId
    syncTmdb()
  }

  lookupResults.value = []
  lookupQuery.value = ''
}

async function syncTmdb() {
  const c = editingCard.value
  if (!c?.tmdbId) return
  tmdbLoading.value = true
  lookupError.value = ''
  try {
    const { totalSeasons, seasons } = await getTvSeasons(c.tmdbId)
    c.totalSeasons = totalSeasons
    tmdbSeasons.value = seasons
  } catch (e) {
    lookupError.value = (e as Error).message
  } finally {
    tmdbLoading.value = false
  }
}

async function newSeason() {
  const root = editingCard.value
  if (!root || root.kind !== 'SERIES' || !selectedCard.value || seasonsFull.value) return

  const used = new Set(mySeasons.value.map(s => s.seasonNumber))
  let n = 1
  while (used.has(n)) n++

  const season: MediaCardData = {
    id: seasonDocId(root.id, n),
    kind: 'SEASON',
    seriesId: root.id,
    seasonNumber: n,
    type: root.type,
    title: root.title,
    imageUrl: root.imageUrl,
    rating: 7,
    ratingLabel: '',
    meta: [],
    description: '',
    summary: '',
    date: today(),
    isCompleted: true,
  }

  if (root.tmdbId && !tmdbSeasons.value.length) {
    try {
      tmdbSeasons.value = (await getTvSeasons(root.tmdbId)).seasons
    } catch {
      // TMDB is optional; the season can still be filled in by hand.
    }
  }
  const t = tmdbSeasons.value.find(s => s.seasonNumber === n)
  if (t) {
    if (t.name && t.name !== `Season ${n}`) season.seasonTitle = t.name
    season.episodeCount = t.episodeCount
    if (t.posterUrl) season.imageUrl = t.posterUrl
  }

  selectedCard.value = null
  editingCard.value = season
  metricsData.value = emptyMetrics()
  resetLookup()
}

function addMeta() {
  if (!newMeta.value.trim() || !editingCard.value) return
  if (!editingCard.value.meta.includes(newMeta.value)) editingCard.value.meta.push(newMeta.value)
  newMeta.value = ''
}

function removeMeta(idx: number) {
  editingCard.value?.meta.splice(idx, 1)
}

async function convertLegacy() {
  const card = selectedCard.value
  if (!card || !convertSeason.value || convertSeason.value < 1) return
  if (!confirm(`Convert "${card.title}" to a series with Season ${convertSeason.value}?`)) return

  saving.value = true
  try {
    await media.convertLegacySeries(card, convertSeason.value)
    const root = media.getById(card.id)
    if (root) selectCard({ ...root, kind: 'SERIES' })
  } catch (e) {
    alert('Failed to convert: ' + (e as Error).message)
  } finally {
    saving.value = false
  }
}

async function saveCard() {
  const c = editingCard.value
  if (!c || !c.id || !c.title) {
    alert('ID and Title are required')
    return
  }

  saving.value = true
  try {
    const metrics = {
      narrativeArch: metricsData.value.narrativeArch || 0,
      aestheticExec: metricsData.value.aestheticExec || 0,
      coherenceRating: metricsData.value.coherenceRating || 0,
    }

    if (c.kind === 'SEASON') {
      if (!c.seasonNumber || c.seasonNumber < 1) {
        alert('Season number must be 1 or higher')
        return
      }
      const id = seasonDocId(c.seriesId!, c.seasonNumber)
      if (!selectedCard.value && media.getById(id)) {
        alert(`Season ${c.seasonNumber} already exists`)
        return
      }
      await media.saveSeason({ ...c, id, metrics })
      const root = media.getById(c.seriesId!)
      expanded.value[c.seriesId!] = true
      if (root) selectCard(root)
      return
    }

    if (c.kind === 'SERIES') {
      const ov = parseFloat(String(overrideText.value))
      const ratingOverride = Number.isFinite(ov) ? Math.min(10, Math.max(0, ov)) : null
      await media.saveSeries({ ...c, ratingOverride })
      const saved = media.getById(c.id)
      if (saved) selectCard({ ...saved, ...c, ratingOverride })
      return
    }

    const cardData: MediaCardData = { ...c, metrics }
    if (selectedCard.value) await media.update(selectedCard.value.id, cardData)
    else await media.add(cardData)

    selectedCard.value = null
    editingCard.value = null
  } catch (e) {
    alert('Failed to save: ' + (e as Error).message)
  } finally {
    saving.value = false
  }
}

async function deleteCard() {
  const card = selectedCard.value
  if (!card) return

  const count = card.kind === 'SERIES' ? seasonsOf(media.items.value, card.id).length : 0
  const message =
    card.kind === 'SERIES' && count
      ? `Delete "${card.title}" and its ${count} season(s)?`
      : `Delete "${card.title}"?`
  if (!confirm(message)) return

  saving.value = true
  try {
    if (card.kind === 'SEASON') {
      await media.deleteSeason(card)
      const root = media.getById(card.seriesId ?? '')
      if (root) {
        selectCard(root)
        return
      }
    } else if (card.kind === 'SERIES') {
      await media.deleteSeries(card.id)
    } else {
      await media.del(card.id)
    }
    selectedCard.value = null
    editingCard.value = null
  } catch (e) {
    alert('Failed to delete: ' + (e as Error).message)
  } finally {
    saving.value = false
  }
}
</script>
