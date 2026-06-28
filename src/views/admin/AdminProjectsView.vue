<template>
  <div class="p-gutter md:p-margin-desktop flex gap-gutter min-h-[calc(100vh-80px)]">
    <!-- Left: Projects List -->
    <div class="flex-1 md:max-w-sm border border-on-surface bg-surface-container-lowest flex flex-col">
      <div class="bg-on-surface text-surface px-4 py-3 border-b border-on-surface flex justify-between items-center font-label-md">
        <span>INDEX // PROJECTS</span>
        <button @click="newProject" class="hover:text-tertiary transition-colors">
          <span class="material-symbols-outlined">add_box</span>
        </button>
      </div>
      <input
        v-model="searchQuery"
        placeholder="grep 'project'..."
        class="p-2 border-b border-on-surface bg-surface-dim font-code text-code text-on-surface focus:outline-none focus:ring-0 px-2 py-2"
      />
      <div class="flex-1 overflow-y-auto flex flex-col">
        <div
          v-for="project in filteredProjects"
          :key="project.name"
          @click="selectProject(project)"
          :class="[
            'p-4 border-b border-on-surface border-l-4 cursor-pointer transition-colors',
            selectedProject?.name === project.name ? 'border-l-tertiary bg-surface-container' : 'border-l-transparent hover:bg-surface-container',
          ]"
        >
          <h3 class="font-code text-code text-tertiary mb-2 line-clamp-2 leading-tight">&gt; {{ project.name }}</h3>
          <div class="flex justify-between items-end">
            <span class="border border-tertiary text-tertiary px-1.5 py-0.5 text-xs font-code uppercase">{{ project.status }}</span>
            <span class="text-xs font-code text-on-surface-variant">{{ project.version }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Editor -->
    <div class="flex-1 flex flex-col gap-gutter min-h-[calc(100vh-80px)] overflow-y-auto pb-8">
      <div v-if="editingProject" class="space-y-gutter">
        <!-- Overview -->
        <div class="border border-on-surface bg-surface-dim p-6 flex flex-col gap-6">
          <h3 class="font-headline-md text-on-surface uppercase border-b border-on-surface pb-2">OVERVIEW</h3>

          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2 flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">NAME</label>
              <input
                v-model="editingProject.name"
                class="bg-transparent border-b border-on-surface focus:border-tertiary text-code font-code text-on-surface px-0 py-2 focus:ring-0 outline-none"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">STATUS</label>
              <select v-model="editingProject.status" class="bg-transparent border-b border-on-surface text-code font-code text-on-surface focus:ring-0 focus:border-tertiary px-0 py-2 cursor-pointer outline-none">
                <option value="STABLE">STABLE</option>
                <option value="BETA">BETA</option>
              </select>
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">VERSION</label>
              <input
                v-model="editingProject.version"
                class="bg-transparent border-b border-on-surface focus:border-tertiary text-code font-code text-on-surface px-0 py-2 focus:ring-0 outline-none"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">DATE</label>
              <input
                v-model="editingProject.date"
                type="date"
                class="bg-transparent border-b border-on-surface focus:border-tertiary text-code font-code text-on-surface px-0 py-2 focus:ring-0 outline-none"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">COMMIT</label>
              <input
                v-model="editingProject.commit"
                class="bg-transparent border-b border-on-surface focus:border-tertiary text-code font-code text-on-surface px-0 py-2 focus:ring-0 outline-none"
              />
            </div>

            <div class="col-span-2 flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">DESCRIPTION</label>
              <textarea
                v-model="editingProject.description"
                class="bg-transparent border-b border-on-surface focus:border-tertiary text-code font-code text-on-surface px-0 py-2 focus:ring-0 outline-none resize-none"
                rows="3"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">LANGUAGE</label>
              <input
                v-model="editingProject.language"
                class="bg-transparent border-b border-on-surface focus:border-tertiary text-code font-code text-on-surface px-0 py-2 focus:ring-0 outline-none"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">FRAMEWORK</label>
              <input
                v-model="editingProject.framework"
                class="bg-transparent border-b border-on-surface focus:border-tertiary text-code font-code text-on-surface px-0 py-2 focus:ring-0 outline-none"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">LICENSE</label>
              <input
                v-model="editingProject.license"
                class="bg-transparent border-b border-on-surface focus:border-tertiary text-code font-code text-on-surface px-0 py-2 focus:ring-0 outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div class="border border-on-surface bg-surface-dim p-6 flex flex-col gap-4">
          <h3 class="font-headline-md text-on-surface uppercase border-b border-on-surface pb-2">TAGS</h3>
          <div class="flex flex-wrap gap-2 mb-4">
            <div v-for="(tag, i) in editingProject.tags" :key="i" class="flex items-center gap-2 bg-surface-container border border-on-surface/20 px-2 py-1 font-code text-code">
              <span>{{ tag.label }} ({{ tag.type }})</span>
              <button @click="removeTag(i)" class="text-error hover:text-error-container transition-colors">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>
          <div class="flex gap-2">
            <input v-model="newTag.label" placeholder="Label" class="flex-1 bg-transparent border-b border-on-surface text-code font-code text-on-surface px-0 py-2 focus:ring-0 focus:border-tertiary outline-none" />
            <select v-model="newTag.type" class="bg-transparent border-b border-on-surface text-code font-code text-on-surface focus:ring-0 focus:border-tertiary px-0 py-2 cursor-pointer outline-none w-32">
              <option value="software">software</option>
              <option value="hardware">hardware</option>
            </select>
            <button @click="addTag" class="bg-on-surface text-surface px-3 py-1 font-code text-xs uppercase hover:bg-tertiary transition-colors">ADD</button>
          </div>
        </div>

        <!-- Links -->
        <div class="border border-on-surface bg-surface-dim p-6 flex flex-col gap-4">
          <h3 class="font-headline-md text-on-surface uppercase border-b border-on-surface pb-2">LINKS</h3>
          <div class="space-y-2">
            <div v-for="(link, i) in editingProject.links" :key="i" class="flex gap-2 items-end">
              <input v-model="link.icon" placeholder="Icon" class="w-20 bg-transparent border-b border-on-surface text-code font-code text-on-surface px-0 py-2 focus:ring-0 focus:border-tertiary outline-none text-xs" />
              <input v-model="link.label" placeholder="Label" class="flex-1 bg-transparent border-b border-on-surface text-code font-code text-on-surface px-0 py-2 focus:ring-0 focus:border-tertiary outline-none text-sm" />
              <input v-model="link.url" placeholder="URL" class="flex-1 bg-transparent border-b border-on-surface text-code font-code text-on-surface px-0 py-2 focus:ring-0 focus:border-tertiary outline-none text-sm" />
              <button @click="removeLink(i)" class="text-error hover:text-error-container transition-colors p-1">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>
          <button @click="addLink" class="self-start bg-on-surface text-surface px-3 py-1 font-code text-xs uppercase hover:bg-tertiary transition-colors">+ ADD_LINK</button>
        </div>

        <!-- Stats -->
        <div class="border border-on-surface bg-surface-dim p-6 flex flex-col gap-4">
          <h3 class="font-headline-md text-on-surface uppercase border-b border-on-surface pb-2">STATS</h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">PANEL_LABEL</label>
              <input v-model="editingProject.stats.panelLabel" class="bg-transparent border-b border-on-surface text-code font-code text-on-surface px-0 py-2 focus:ring-0 focus:border-tertiary outline-none" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">STATUS_COLOR</label>
              <select v-model="editingProject.stats.statusColor" class="bg-transparent border-b border-on-surface text-code font-code text-on-surface focus:ring-0 focus:border-tertiary px-0 py-2 cursor-pointer outline-none">
                <option value="green">green</option>
                <option value="yellow">yellow</option>
                <option value="red">red</option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">BAR_PERCENT</label>
              <input v-model.number="editingProject.stats.barPercent" type="number" min="0" max="100" class="bg-transparent border-b border-on-surface text-code font-code text-on-surface px-0 py-2 focus:ring-0 focus:border-tertiary outline-none" />
            </div>
            <div class="col-span-3 flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">BAR_COLOR (Tailwind)</label>
              <input v-model="editingProject.stats.barColor" placeholder="e.g. bg-tertiary" class="bg-transparent border-b border-on-surface text-code font-code text-on-surface px-0 py-2 focus:ring-0 focus:border-tertiary outline-none" />
            </div>
          </div>
          <div class="mt-4 space-y-2">
            <div v-for="(metric, i) in editingProject.stats.metrics" :key="i" class="flex gap-2 items-end">
              <input v-model="metric.label" placeholder="Label" class="flex-1 bg-transparent border-b border-on-surface text-code font-code text-on-surface px-0 py-2 focus:ring-0 focus:border-tertiary outline-none" />
              <input v-model="metric.value" placeholder="Value" class="w-24 bg-transparent border-b border-on-surface text-code font-code text-on-surface px-0 py-2 focus:ring-0 focus:border-tertiary outline-none" />
              <input v-model="metric.valueColor" placeholder="Color" class="w-32 bg-transparent border-b border-on-surface text-code font-code text-on-surface px-0 py-2 focus:ring-0 focus:border-tertiary outline-none text-xs" />
              <button @click="removeMetric(i)" class="text-error hover:text-error-container transition-colors p-1">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>
          <button @click="addMetric" class="self-start bg-on-surface text-surface px-3 py-1 font-code text-xs uppercase hover:bg-tertiary transition-colors">+ ADD_METRIC</button>
        </div>

        <!-- Changelog -->
        <div class="border border-on-surface bg-surface-dim p-6 flex flex-col gap-4">
          <h3 class="font-headline-md text-on-surface uppercase border-b border-on-surface pb-2">CHANGELOG</h3>

          <!-- Custom Flags -->
          <div class="border-b border-on-surface/30 pb-4">
            <div class="flex flex-wrap gap-2 mb-3">
              <div v-for="flag in flags" :key="flag" class="bg-surface-container border border-on-surface/20 px-2 py-1 font-code text-code text-xs uppercase flex items-center gap-1">
                {{ flag }}
              </div>
            </div>
            <div class="flex gap-2">
              <input v-model="newFlag" placeholder="New flag..." class="flex-1 bg-transparent border-b border-on-surface text-code font-code text-on-surface px-0 py-2 focus:ring-0 focus:border-tertiary outline-none" />
              <button @click="addFlag" class="bg-on-surface text-surface px-3 py-1 font-code text-xs uppercase hover:bg-tertiary transition-colors">ADD</button>
            </div>
          </div>

          <!-- Versions -->
          <div class="space-y-3">
            <div v-for="(entry, i) in editingProject.changelog" :key="i" class="border border-on-surface/20 bg-surface-container">
              <!-- Header -->
              <div @click="toggleVersion(i)" class="p-3 cursor-pointer hover:bg-surface-container-highest transition-colors flex justify-between items-center border-b border-on-surface/20">
                <div class="flex items-center gap-3 flex-1">
                  <span class="material-symbols-outlined text-lg">{{ openVersions.has(i) ? 'expand_less' : 'expand_more' }}</span>
                  <span class="font-code text-code font-bold">{{ entry.version }}</span>
                  <span class="text-on-surface-variant text-sm">{{ entry.label }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <label class="flex items-center gap-1 cursor-pointer text-xs">
                    <input type="checkbox" :checked="entry.isLatest" @change="setLatest(i)" class="cursor-pointer" />
                    <span class="font-code uppercase">LATEST</span>
                  </label>
                  <button @click.stop="removeVersion(i)" class="text-error hover:text-error-container transition-colors p-1">
                    <span class="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div v-if="openVersions.has(i)" class="p-4 space-y-3">
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-2">
                    <label class="font-code text-xs text-on-surface-variant uppercase">DATE</label>
                    <input v-model="entry.date" type="datetime-local" class="bg-transparent border-b border-on-surface text-code font-code text-on-surface px-0 py-2 focus:ring-0 focus:border-tertiary outline-none text-sm" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="font-code text-xs text-on-surface-variant uppercase">LABEL</label>
                    <input v-model="entry.label" class="bg-transparent border-b border-on-surface text-code font-code text-on-surface px-0 py-2 focus:ring-0 focus:border-tertiary outline-none" />
                  </div>
                </div>

                <!-- Items -->
                <div class="border-t border-on-surface/20 pt-3">
                  <div v-for="(item, j) in entry.items" :key="j" class="flex gap-2 mb-2 items-start">
                    <select v-model="item.flag" class="bg-transparent border-b border-on-surface text-code font-code text-on-surface focus:ring-0 focus:border-tertiary px-0 py-2 cursor-pointer outline-none w-24 text-sm">
                      <option v-for="f in flags" :key="f" :value="f">{{ f }}</option>
                    </select>
                    <input v-model="item.text" class="flex-1 bg-transparent border-b border-on-surface text-code font-code text-on-surface px-0 py-2 focus:ring-0 focus:border-tertiary outline-none text-sm" />
                    <button @click="removeItem(i, j)" class="text-error hover:text-error-container transition-colors p-1 mt-1">
                      <span class="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>
                <button @click="addItem(i)" class="self-start bg-on-surface text-surface px-3 py-1 font-code text-xs uppercase hover:bg-tertiary transition-colors">+ ADD_ITEM</button>
              </div>
            </div>
          </div>
          <button @click="addVersion" class="self-start bg-on-surface text-surface px-3 py-1 font-code text-xs uppercase hover:bg-tertiary transition-colors mt-2">+ ADD_VERSION</button>
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
          <button
            @click="saveProject"
            :disabled="projects.loading.value"
            class="flex-1 bg-on-surface text-surface py-3 font-label-md px-6 uppercase tracking-widest border border-on-surface hover:bg-tertiary hover:border-tertiary transition-colors disabled:opacity-50"
          >
            {{ projects.loading.value ? 'SAVING...' : 'SAVE' }}
          </button>
          <button
            @click="deleteProject"
            :disabled="!selectedProject || projects.loading.value"
            class="bg-error text-on-error py-3 font-label-md px-6 uppercase tracking-widest border border-error hover:bg-error-container transition-colors disabled:opacity-50"
          >
            DELETE
          </button>
        </div>
      </div>
      <div v-else class="flex items-center justify-center flex-1 text-on-surface-variant font-code">
        Select a project or create a new one
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjects } from '@/composables/useProjects'
import { useProjectSettings } from '@/composables/useProjectSettings'
import type { Project, Tag, ChangelogEntry } from '@/data/projects'

const projects = useProjects()
const { flags, addFlag: addFlagToSettings } = useProjectSettings()

const searchQuery = ref('')
const selectedProject = ref<Project | null>(null)
const editingProject = ref<Project | null>(null)
const openVersions = ref<Set<number>>(new Set())
const newTag = ref<Tag>({ label: '', type: 'software' })
const newFlag = ref('')

const filteredProjects = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return projects.items.value.filter(p => p.name.toLowerCase().includes(q) || p.version.toLowerCase().includes(q))
})

function selectProject(project: Project) {
  selectedProject.value = project
  editingProject.value = JSON.parse(JSON.stringify(project)) as Project
  openVersions.value.clear()
}

function newProject() {
  selectedProject.value = null
  editingProject.value = {
    name: '',
    version: 'v0.0.1',
    status: 'BETA' as const,
    tags: [],
    description: '',
    date: new Date().toISOString().split('T')[0],
    commit: '',
    language: '' as string | undefined,
    framework: '' as string | undefined,
    license: '' as string | undefined,
    stats: {
      panelLabel: 'Status',
      statusColor: 'green' as const,
      metrics: [],
      barPercent: 0,
      barColor: 'bg-tertiary',
    },
    changelog: [],
    links: [],
  }
  openVersions.value.clear()
}

function addTag() {
  if (!editingProject.value || !newTag.value.label) return
  editingProject.value.tags.push({ ...newTag.value })
  newTag.value = { label: '', type: 'software' }
}

function removeTag(i: number) {
  if (!editingProject.value) return
  editingProject.value.tags.splice(i, 1)
}

function addLink() {
  if (!editingProject.value) return
  editingProject.value.links!.push({ label: '', icon: '', url: '' })
}

function removeLink(i: number) {
  if (!editingProject.value) return
  editingProject.value.links!.splice(i, 1)
}

function addMetric() {
  if (!editingProject.value) return
  editingProject.value.stats.metrics.push({ label: '', value: '' })
}

function removeMetric(i: number) {
  if (!editingProject.value) return
  editingProject.value.stats.metrics.splice(i, 1)
}

function toggleVersion(i: number) {
  if (openVersions.value.has(i)) {
    openVersions.value.delete(i)
  } else {
    openVersions.value.add(i)
  }
}

function setLatest(i: number) {
  if (!editingProject.value || !editingProject.value.changelog) return
  editingProject.value.changelog.forEach((entry, idx) => {
    entry.isLatest = idx === i
  })
}

function addVersion() {
  if (!editingProject.value) return
  const newVersion: ChangelogEntry = {
    version: 'v0.0.1',
    label: 'New Release',
    date: new Date().toISOString(),
    isLatest: false,
    items: [],
  }
  if (!editingProject.value.changelog) {
    editingProject.value.changelog = []
  }
  editingProject.value.changelog.push(newVersion)
}

function removeVersion(i: number) {
  if (!editingProject.value) return
  editingProject.value.changelog.splice(i, 1)
}

function addItem(i: number) {
  if (!editingProject.value) return
  editingProject.value.changelog[i].items.push({ flag: flags.value[0] || 'ADDED', text: '' })
}

function removeItem(versionIdx: number, itemIdx: number) {
  if (!editingProject.value) return
  editingProject.value.changelog[versionIdx].items.splice(itemIdx, 1)
}

async function addFlag() {
  if (!newFlag.value.trim()) return
  try {
    await addFlagToSettings(newFlag.value.toUpperCase())
    newFlag.value = ''
  } catch (e) {
    console.error('Failed to add flag:', e)
  }
}

async function saveProject() {
  if (!editingProject.value) return
  try {
    const data = editingProject.value
    const existing = projects.items.value.find(p => p.name === data.name)
    if (existing) {
      await projects.update(data.name, data)
    } else {
      await projects.add(data)
    }
    selectedProject.value = null
    editingProject.value = null
  } catch (e) {
    console.error('Save failed:', e)
  }
}

async function deleteProject() {
  if (!selectedProject.value) return
  if (confirm(`Delete project "${selectedProject.value.name}"?`)) {
    try {
      await projects.del(selectedProject.value.name)
      selectedProject.value = null
      editingProject.value = null
    } catch (e) {
      console.error('Delete failed:', e)
    }
  }
}
</script>
