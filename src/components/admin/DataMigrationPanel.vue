<template>
  <section class="border border-on-surface bg-surface-container-lowest">
    <div class="bg-on-surface text-surface font-bold font-code px-4 py-2 border-b border-on-surface flex justify-between items-center">
      <span>DATA_MIGRATION</span>
      <span class="material-symbols-outlined text-sm">sync_alt</span>
    </div>

    <div class="p-6 space-y-6">

      <!-- Export from old collection -->
      <div class="flex flex-col gap-2">
        <p class="font-code text-code text-on-surface-variant uppercase">1. Eski koleksiyonu indir</p>
        <div class="flex flex-wrap gap-3 items-center">
          <input
            v-model="sourceCollection"
            placeholder="showcase_apps"
            class="bg-surface-dim border border-on-surface/40 text-code font-code text-on-surface focus:border-tertiary px-3 py-2 outline-none w-48"
          />
          <div class="flex items-center gap-2 text-on-surface-variant font-code text-code">
            <span>alt koleksiyon:</span>
            <input
              v-model="subcollectionName"
              placeholder="versions (opsiyonel)"
              class="bg-surface-dim border border-on-surface/40 text-code font-code text-on-surface focus:border-tertiary px-3 py-2 outline-none w-48"
            />
          </div>
          <button
            @click="exportCollection"
            :disabled="exporting"
            class="flex items-center gap-2 bg-on-surface text-surface border border-on-surface px-5 py-2 font-code font-bold uppercase hover:bg-tertiary hover:text-on-tertiary transition-colors disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-lg">download</span>
            {{ exporting ? `EXPORTING... (${exportProgress})` : 'EXPORT_JSON' }}
          </button>
        </div>
        <p v-if="exportMsg" class="font-code text-code" :class="exportMsg.startsWith('✗') ? 'text-error' : 'text-tertiary'">{{ exportMsg }}</p>
      </div>

      <div class="border-t border-on-surface/20"></div>

      <!-- Download example template -->
      <div class="flex flex-col gap-2">
        <p class="font-code text-code text-on-surface-variant uppercase">2. Örnek şablonu indir ve düzenle</p>
        <button
          @click="downloadTemplate"
          class="self-start flex items-center gap-2 border border-on-surface text-on-surface px-5 py-2 font-code font-bold uppercase hover:bg-on-surface hover:text-surface transition-colors"
        >
          <span class="material-symbols-outlined text-lg">description</span>
          DOWNLOAD_TEMPLATE
        </button>
      </div>

      <div class="border-t border-on-surface/20"></div>

      <!-- Import JSON to target collection -->
      <div class="flex flex-col gap-2">
        <p class="font-code text-code text-on-surface-variant uppercase">3. Düzenlenmiş JSON'ı yükle</p>
        <div class="flex flex-wrap gap-3 items-center">
          <input
            v-model="targetCollection"
            placeholder="projects"
            class="bg-surface-dim border border-on-surface/40 text-code font-code text-on-surface focus:border-tertiary px-3 py-2 outline-none w-48"
          />
          <label class="flex items-center gap-2 bg-surface-dim border border-on-surface text-on-surface px-5 py-2 font-code font-bold uppercase hover:bg-on-surface hover:text-surface transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-lg">upload_file</span>
            SEÇ_DOSYA
            <input type="file" accept=".json" class="hidden" @change="onFileSelected" />
          </label>
          <span v-if="selectedFile" class="font-code text-code text-on-surface-variant">{{ selectedFile.name }}</span>
        </div>

        <div v-if="previewItems.length > 0" class="border border-on-surface/30 bg-surface-dim p-4 space-y-2 max-h-40 overflow-y-auto">
          <p class="font-code text-code text-on-surface-variant uppercase mb-2">{{ previewItems.length }} kayıt bulundu</p>
          <div v-for="(item, i) in previewItems" :key="i" class="font-code text-code text-on-surface flex gap-3">
            <span class="text-tertiary select-none">{{ i + 1 }}</span>
            <span>{{ item.name ?? item.id ?? JSON.stringify(item).slice(0, 60) + '...' }}</span>
          </div>
        </div>

        <button
          v-if="previewItems.length > 0"
          @click="importToFirestore"
          :disabled="importing"
          class="self-start flex items-center gap-2 bg-on-surface text-surface border border-on-surface px-5 py-2 font-code font-bold uppercase hover:bg-tertiary hover:text-on-tertiary transition-colors disabled:opacity-50"
        >
          <span class="material-symbols-outlined text-lg">cloud_upload</span>
          {{ importing ? `UPLOADING... (${importProgress}/${previewItems.length})` : `IMPORT_${previewItems.length}_ITEMS` }}
        </button>

        <p v-if="importMsg" class="font-code text-code" :class="importMsg.startsWith('✗') ? 'text-error' : 'text-tertiary'">{{ importMsg }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAll, getSubcollection, upsert } from '@/services/db'
import type { DocumentData } from 'firebase/firestore'

const sourceCollection = ref('showcase_apps')
const subcollectionName = ref('versions')
const targetCollection = ref('projects')
const exporting = ref(false)
const exportMsg = ref('')
const exportProgress = ref(0)
const importing = ref(false)
const importMsg = ref('')
const importProgress = ref(0)
const selectedFile = ref<File | null>(null)
const previewItems = ref<DocumentData[]>([])

const PROJECT_TEMPLATE = [
  {
    name: 'My_Project',
    version: 'v1.0.0',
    status: 'STABLE',
    tags: [
      { label: 'Vue', type: 'software' },
      { label: 'Python', type: 'software' }
    ],
    description: 'Projenin kısa açıklaması buraya gelir.',
    date: '2024-01-01',
    commit: 'abc1234',
    language: 'TypeScript / Python',
    framework: 'Vue 3 / FastAPI',
    license: 'MIT',
    links: [
      { label: 'GITHUB_REPO', icon: 'code', url: 'https://github.com/emirkalafat/my-project' }
    ],
    stats: {
      panelLabel: 'System Status',
      statusColor: 'green',
      metrics: [
        { label: 'Version', value: '1.0.0', valueColor: 'text-tertiary' }
      ],
      barPercent: 100,
      barColor: 'bg-tertiary'
    },
    changelog: [
      {
        version: 'v1.0.0',
        label: 'Initial Release',
        date: '2024-01-01 00:00:00 UTC',
        isLatest: true,
        items: [
          { flag: 'INIT', text: 'Initial release.' }
        ]
      }
    ]
  }
]

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

async function exportCollection() {
  if (!sourceCollection.value.trim()) return
  exporting.value = true
  exportMsg.value = ''
  exportProgress.value = 0
  try {
    const col = sourceCollection.value.trim()
    const sub = subcollectionName.value.trim()
    const docs = await getAll(col)
    if (docs.length === 0) {
      exportMsg.value = '⚠ Koleksiyonda kayıt bulunamadı.'
      return
    }
    let data: DocumentData[]
    if (sub) {
      data = await Promise.all(
        docs.map(async (item) => {
          const docId = String((item as DocumentData & { id?: string }).id ?? '')
          const subDocs = await getSubcollection(col, docId, sub)
          exportProgress.value++
          return { ...item, [sub]: subDocs }
        })
      )
    } else {
      data = docs
    }
    downloadJson(data, `${col}.json`)
    exportMsg.value = `✓ ${data.length} kayıt${sub ? ` (her biri "${sub}" alt koleksiyonuyla)` : ''} indirildi.`
  } catch (e) {
    exportMsg.value = '✗ Export başarısız: ' + (e as Error).message
  } finally {
    exporting.value = false
    setTimeout(() => { exportMsg.value = '' }, 4000)
  }
}

function downloadTemplate() {
  downloadJson(PROJECT_TEMPLATE, 'projects_template.json')
}

function onFileSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  selectedFile.value = file
  importMsg.value = ''
  previewItems.value = []

  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target?.result as string)
      if (!Array.isArray(parsed)) {
        importMsg.value = '✗ JSON bir dizi (array) olmalıdır.'
        return
      }
      previewItems.value = parsed
    } catch {
      importMsg.value = '✗ Geçersiz JSON dosyası.'
    }
  }
  reader.readAsText(file)
}

async function importToFirestore() {
  if (!targetCollection.value.trim() || previewItems.value.length === 0) return
  importing.value = true
  importMsg.value = ''
  importProgress.value = 0

  try {
    const col = targetCollection.value.trim()
    for (const item of previewItems.value) {
      const docId = String(item.name ?? item.id ?? crypto.randomUUID())
      const { id: _id, ...data } = item as DocumentData & { id?: string }
      await upsert(col, docId, data)
      importProgress.value++
    }
    importMsg.value = `✓ ${previewItems.value.length} kayıt "${col}" koleksiyonuna yüklendi.`
    previewItems.value = []
    selectedFile.value = null
  } catch (e) {
    importMsg.value = '✗ Import başarısız: ' + (e as Error).message
  } finally {
    importing.value = false
    setTimeout(() => { importMsg.value = '' }, 5000)
  }
}
</script>
