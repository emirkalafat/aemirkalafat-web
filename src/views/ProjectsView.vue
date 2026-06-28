<template>
  <div class="flex-1 flex flex-col">
    <PageHeader
      title="PROJECT_MATRIX"
      description="Active deployment tracking and version control manifest. Review stability metrics before initiating compilation sequences."
    >
      <template #filters>
        <div class="flex flex-wrap gap-4 items-center font-code text-label-md">
          <button
            @click="activeFilter = null"
            :class="[
              'border border-primary text-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase',
              activeFilter === null ? 'bg-tertiary border-tertiary text-[#1a1a1a]' : ''
            ]"
          >[*] ALL</button>
          <button
            @click="activeFilter = 'STABLE'"
            :class="[
              'border border-primary text-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase',
              activeFilter === 'STABLE' ? 'bg-tertiary border-tertiary text-[#1a1a1a]' : ''
            ]"
          >STABLE</button>
          <button
            @click="activeFilter = 'BETA'"
            :class="[
              'border border-primary text-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase',
              activeFilter === 'BETA' ? 'bg-tertiary border-tertiary text-[#1a1a1a]' : ''
            ]"
          >BETA</button>
          <div class="ml-auto w-full md:w-auto mt-4 md:mt-0 flex border border-primary bg-background focus-within:border-tertiary transition-colors">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="GREP_PROJECTS..."
              class="bg-transparent border-none text-on-surface text-body-md font-code py-2 px-3 focus:ring-0 w-full md:w-64 outline-none"
            />
            <button class="px-3 text-primary hover:text-tertiary transition-colors border-l border-primary">
              <span class="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
      </template>
    </PageHeader>

    <!-- Project List -->
    <section class="flex-1 p-margin-mobile lg:p-margin-desktop bg-surface-container-lowest">
      <div class="flex flex-col gap-6">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.name"
          v-bind="project"
        />
        <div
          v-if="filteredProjects.length === 0"
          class="border border-primary bg-surface p-8 text-center"
        >
          <p class="text-body-md font-code text-on-surface-variant">[NO_RESULTS_FOUND]</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import { useProjects } from '@/composables/useProjects'

const projects = useProjects()

type FilterType = null | 'STABLE' | 'BETA'

const activeFilter = ref<FilterType>(null)
const searchQuery = ref('')

const filteredProjects = computed(() => {
  return projects.items.value.filter(p => {
    const matchesFilter = activeFilter.value === null || p.status === activeFilter.value
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })
})
</script>
