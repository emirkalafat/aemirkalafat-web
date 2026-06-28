<template>
  <div class="p-gutter md:p-margin-desktop space-y-column-gap">
    <div class="mb-8 border-b-2 border-on-surface pb-4">
      <h2 class="font-display text-display uppercase">Project_Registry</h2>
      <p class="font-code text-code text-on-surface-variant">&gt; system.modules.list_all()</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Projects List -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <div v-for="project in projects.items.value" :key="project.name" class="border border-on-surface bg-surface-container-lowest flex flex-col">
          <div class="bg-on-surface text-surface p-2 flex justify-between items-center">
            <span class="font-label-md text-label-md font-bold uppercase">{{ project.name }}</span>
            <span class="font-code text-code text-tertiary bg-tertiary-container px-2 border border-tertiary">{{ project.version }}</span>
          </div>
          <div class="p-6">
            <p class="font-body-md text-body-md text-on-surface-variant mb-4">{{ project.description }}</p>
            <div class="flex gap-2 mb-4 flex-wrap">
              <span v-for="tag in project.tags" :key="tag.label" class="border border-tertiary-fixed-dim text-tertiary-fixed-dim font-code text-code px-2 py-1 text-xs">
                {{ tag.label }}
              </span>
            </div>
            <div class="flex justify-between items-center border-t border-surface-variant pt-4">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                <span class="font-code text-code text-on-surface">STATUS: {{ project.status }}</span>
              </div>
              <button @click="editProject(project)" class="font-code text-code text-tertiary hover:underline">EDIT -></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Register Form -->
      <div class="border border-on-surface bg-surface-container-lowest p-6 flex flex-col h-fit">
        <h3 class="font-headline-md text-headline-md mb-6 border-b border-on-surface pb-2">&gt; REGISTER_NEW_MODULE</h3>
        <form @submit.prevent="saveProject" class="flex flex-col gap-6 flex-1">
          <div class="flex flex-col">
            <label class="font-code text-code text-on-surface-variant mb-1">PROJECT_NAME</label>
            <input v-model="formData.name" placeholder="e.g. Quantum_Router" class="bg-primary-container text-on-surface border-0 border-b border-on-surface focus:ring-0 focus:border-tertiary-fixed-dim font-body-md py-2 transition-colors outline-none" />
          </div>
          <div class="flex flex-col">
            <label class="font-code text-code text-on-surface-variant mb-1">VERSION</label>
            <input v-model="formData.version" placeholder="v1.0.0" class="bg-primary-container text-on-surface border-0 border-b border-on-surface focus:ring-0 focus:border-tertiary-fixed-dim font-body-md py-2 transition-colors outline-none" />
          </div>
          <div class="flex flex-col">
            <label class="font-code text-code text-on-surface-variant mb-1">DESCRIPTION</label>
            <textarea v-model="formData.description" placeholder="Brief description..." class="bg-primary-container text-on-surface border-0 border-b border-on-surface focus:ring-0 focus:border-tertiary-fixed-dim font-body-md py-2 resize-none transition-colors outline-none" rows="2" />
          </div>
          <button
            type="submit"
            :disabled="projects.loading.value"
            class="bg-on-surface text-surface font-label-md text-label-md py-3 uppercase mt-auto border border-on-surface hover:bg-tertiary transition-colors disabled:opacity-50"
          >
            {{ projects.loading.value ? 'SAVING...' : 'SAVE_PROJECT' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProjects } from '@/composables/useProjects'
import type { Project } from '@/data/projects'

const projects = useProjects()

const formData = ref<Partial<Project>>({
  name: '',
  version: '',
  description: '',
  status: 'BETA',
  tags: [],
  date: new Date().toISOString().split('T')[0],
  commit: '',
  stats: {
    panelLabel: 'Status',
    statusColor: 'green',
    metrics: [],
    barPercent: 0,
    barColor: 'bg-tertiary',
  },
  changelog: [],
})

function editProject(project: Project) {
  formData.value = { ...project }
}

async function saveProject() {
  try {
    const data = formData.value as Project
    const existing = projects.items.value.find(p => p.name === data.name)
    if (existing) {
      await projects.update(data.name, data)
    } else {
      await projects.add(data)
    }
    formData.value = {
      name: '',
      version: '',
      description: '',
      status: 'BETA',
      tags: [],
      date: new Date().toISOString().split('T')[0],
      commit: '',
      stats: {
        panelLabel: 'Status',
        statusColor: 'green',
        metrics: [],
        barPercent: 0,
        barColor: 'bg-tertiary',
      },
      changelog: [],
    }
  } catch (e) {
    console.error('Save failed:', e)
  }
}
</script>
