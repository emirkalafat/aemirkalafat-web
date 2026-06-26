<template>
  <div class="flex-1 flex flex-col">
    <PageHeader
      title="PROJECT_MATRIX"
      description="Active deployment tracking and version control manifest. Review stability metrics before initiating compilation sequences."
    >
      <template #filters>
        <div class="flex flex-wrap gap-4 items-center">
          <div class="relative flex-1 min-w-[200px] max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Grep projects..."
              class="w-full bg-transparent border-0 border-b border-surface-variant focus:border-tertiary focus:ring-0 text-body-md font-code text-on-surface py-2 px-0 placeholder-on-surface-variant transition-colors outline-none"
            />
            <span class="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          </div>
          <div class="flex gap-2">
            <button
              @click="activeFilter = null"
              class="px-3 py-1 text-label-md font-code border transition-colors"
              :class="activeFilter === null
                ? 'border-tertiary text-tertiary bg-surface-container-low'
                : 'border-surface-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container'"
            >ALL</button>
            <button
              @click="activeFilter = 'STABLE'"
              class="px-3 py-1 text-label-md font-code border transition-colors"
              :class="activeFilter === 'STABLE'
                ? 'border-tertiary text-tertiary bg-surface-container-low'
                : 'border-surface-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container'"
            >STABLE</button>
            <button
              @click="activeFilter = 'BETA'"
              class="px-3 py-1 text-label-md font-code border transition-colors"
              :class="activeFilter === 'BETA'
                ? 'border-tertiary text-tertiary bg-surface-container-low'
                : 'border-surface-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container'"
            >BETA</button>
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

type FilterType = null | 'STABLE' | 'BETA'

const activeFilter = ref<FilterType>(null)
const searchQuery = ref('')

const projects = [
  {
    name: 'Quantum_Router_Core',
    version: 'v2.4.1',
    status: 'STABLE' as const,
    tags: [
      { label: 'Rust', type: 'software' as const },
      { label: 'Network Edge', type: 'hardware' as const },
    ],
    description: 'High-throughput packet routing engine utilizing zero-copy network I/O. Achieves 10Gbps line rate with sub-millisecond latency on commodity hardware.',
    date: '2024-05-12',
    commit: '8f2a9b1',
    stats: {
      panelLabel: 'System Status',
      statusColor: 'green' as const,
      metrics: [
        { label: 'Uptime', value: '99.999%', valueColor: 'text-tertiary' },
        { label: 'Latency', value: '0.4ms', valueColor: 'text-tertiary' },
      ],
      barPercent: 85,
      barColor: 'bg-tertiary',
    },
    changelog: [
      {
        version: 'v2.4.1',
        label: 'Hotfix Implementation',
        isLatest: true,
        items: [
          { text: 'Resolved memory leak in TCP teardown sequence' },
          { text: 'Updated cryptographic dependencies to patch CVE-2024-XXXX' },
        ],
      },
      {
        version: 'v2.4.0',
        label: 'Feature Release',
        isLatest: false,
        items: [
          { text: 'Introduced native IPv6 dual-stack support' },
          { text: 'Refactored BGP routing tables for 30% lookup speed increase' },
        ],
      },
    ],
  },
  {
    name: 'Neural_Vision_Array',
    version: 'v0.9.4-rc2',
    status: 'BETA' as const,
    tags: [
      { label: 'CUDA/C++', type: 'software' as const },
      { label: 'TensorRT', type: 'software' as const },
    ],
    description: 'Distributed computer vision pipeline for real-time object detection across edge devices. Currently testing multi-node synchronization protocols under high load.',
    date: '2024-10-24',
    commit: '3c9d1a4',
    stats: {
      panelLabel: 'Inference Node',
      statusColor: 'yellow' as const,
      metrics: [
        { label: 'FPS', value: '144.2', valueColor: 'text-on-surface' },
        { label: 'VRAM Usage', value: '94%', valueColor: 'text-error' },
      ],
      barPercent: 94,
      barColor: 'bg-error',
    },
    changelog: [
      {
        version: 'v0.9.4-rc2',
        label: 'Optimization Pass',
        isLatest: true,
        items: [
          { text: 'Reduced TensorRT engine build time by 15%' },
          { text: 'Occasional frame drops during heavy I/O operations. Investigating thread contention.', isError: true },
        ],
      },
    ],
  },
  {
    name: 'Embedded_Signal_Core',
    version: 'v1.1.0',
    status: 'STABLE' as const,
    tags: [
      { label: 'C', type: 'software' as const },
      { label: 'ARM Cortex-M4', type: 'hardware' as const },
      { label: 'FreeRTOS', type: 'software' as const },
    ],
    description: 'Low-latency digital signal processing pipeline for embedded sensor nodes. Implements FFT-based frequency analysis with hardware-accelerated DSP instructions.',
    date: '2024-08-03',
    commit: 'a1f4c22',
    stats: {
      panelLabel: 'DSP Node',
      statusColor: 'green' as const,
      metrics: [
        { label: 'Latency', value: '1.2ms', valueColor: 'text-tertiary' },
        { label: 'CPU Load', value: '38%', valueColor: 'text-tertiary' },
      ],
      barPercent: 38,
      barColor: 'bg-tertiary',
    },
    changelog: [
      {
        version: 'v1.1.0',
        label: 'DSP Enhancements',
        isLatest: true,
        items: [
          { text: 'Added hardware FPU support for Cortex-M4 floating-point operations' },
          { text: 'Reduced interrupt latency by 40% via NVIC priority rebalancing' },
        ],
      },
      {
        version: 'v1.0.0',
        label: 'Initial Release',
        isLatest: false,
        items: [
          { text: 'Basic FFT pipeline with 1024-point transform' },
          { text: 'FreeRTOS task scheduler integration' },
        ],
      },
    ],
  },
]

const filteredProjects = computed(() => {
  return projects.filter(p => {
    const matchesFilter = activeFilter.value === null || p.status === activeFilter.value
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })
})
</script>
