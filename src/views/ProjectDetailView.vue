<template>
  <div class="flex-1 flex flex-col">
    <PageHeader :title="project?.name ?? 'PROJECT_MATRIX'">
      <template #filters>
        <div v-if="project" class="flex flex-wrap items-center gap-3">
          <span class="font-code text-code border border-primary px-3 py-1 text-on-surface-variant">{{ project.version }}</span>
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 animate-pulse" :class="project.status === 'STABLE' ? 'bg-on-tertiary-container' : 'bg-[#ffaa00]'"></span>
            <span class="font-code text-code uppercase" :class="project.status === 'STABLE' ? 'text-on-tertiary-container' : 'text-[#ffaa00]'">
              {{ project.status === 'STABLE' ? 'SYSTEM_ONLINE' : 'BETA_UNSTABLE' }}
            </span>
          </span>
          <span
            v-for="tag in project.tags"
            :key="tag.label"
            class="font-code text-code px-2 py-1 border"
            :class="tag.type === 'hardware' ? 'border-cyber-purple text-cyber-purple' : 'border-tertiary text-tertiary'"
          >{{ tag.label }}</span>
        </div>
      </template>
    </PageHeader>

    <section class="flex-1 p-margin-mobile lg:p-margin-desktop bg-surface-container-lowest">
      <!-- Not found -->
      <div v-if="!project" class="border border-primary bg-surface p-8 text-center">
        <p class="font-code text-body-md text-on-surface-variant">[PROJECT_NOT_FOUND]</p>
      </div>

      <template v-else>
        <!-- 12-col grid -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-gutter">

          <!-- Left: 4 col -->
          <div class="xl:col-span-4 flex flex-col gap-6">

            <!-- Overview -->
            <div class="border border-primary bg-surface-container-lowest">
              <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase">// OVERVIEW.MD</div>
              <div class="p-6">
                <p class="text-body-md font-body-md text-on-surface-variant">{{ project.description }}</p>
              </div>
            </div>

            <!-- Access Portal -->
            <div v-if="project.links?.length" class="border border-primary bg-surface-container-lowest">
              <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase">ACCESS_PORTAL</div>
              <div class="p-4 flex flex-col">
                <a
                  v-for="link in project.links"
                  :key="link.label"
                  :href="link.url"
                  class="flex items-center gap-3 font-code text-code text-on-surface-variant hover:text-tertiary transition-colors py-3 border-b border-surface-variant last:border-0"
                >
                  <span class="material-symbols-outlined text-[16px]">{{ link.icon }}</span>
                  {{ link.label }}
                  <span class="ml-auto material-symbols-outlined text-[14px] opacity-40">arrow_forward</span>
                </a>
              </div>
            </div>

            <!-- Technical Specs -->
            <div class="border border-primary bg-surface-container-lowest">
              <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase">SYS_METADATA</div>
              <div class="grid grid-cols-2 gap-px bg-primary">
                <div class="bg-surface-container-lowest p-4">
                  <p class="font-code text-code text-on-surface-variant mb-1 uppercase">Language</p>
                  <p class="font-code text-label-md text-on-surface">{{ project.language ?? '—' }}</p>
                </div>
                <div class="bg-surface-container-lowest p-4">
                  <p class="font-code text-code text-on-surface-variant mb-1 uppercase">Framework</p>
                  <p class="font-code text-label-md text-on-surface">{{ project.framework ?? '—' }}</p>
                </div>
                <div class="bg-surface-container-lowest p-4">
                  <p class="font-code text-code text-on-surface-variant mb-1 uppercase">License</p>
                  <p class="font-code text-label-md text-on-surface">{{ project.license ?? 'MIT' }}</p>
                </div>
                <div class="bg-surface-container-lowest p-4">
                  <p class="font-code text-code text-on-surface-variant mb-1 uppercase">Last Deploy</p>
                  <p class="font-code text-label-md text-tertiary">{{ project.date }}</p>
                </div>
              </div>
            </div>

          </div>

          <!-- Right: 8 col — Changelog -->
          <div class="xl:col-span-8 border border-primary bg-surface-container-lowest flex flex-col">
            <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">history</span>
              CHANGELOG.LOG
            </div>
            <div class="p-6 flex-1">
              <div class="relative border-l-2 border-primary ml-2 pl-8 flex flex-col gap-10">
                <div
                  v-for="entry in project.changelog"
                  :key="entry.version"
                  class="relative"
                >
                  <!-- Timeline dot -->
                  <div
                    class="absolute -left-[41px] top-2 w-3 h-3 border-2 border-primary"
                    :class="entry.isLatest ? 'bg-tertiary' : 'bg-surface-container-lowest'"
                  ></div>
                  <!-- Version + date + label -->
                  <div class="flex flex-wrap items-baseline gap-3 mb-1">
                    <span
                      class="font-code text-2xl font-bold leading-none"
                      :class="entry.isLatest ? 'text-tertiary' : 'text-on-surface'"
                    >{{ entry.version }}</span>
                    <span v-if="entry.isLatest" class="font-code text-code border border-tertiary text-tertiary px-2 py-0.5 text-[11px] uppercase">LATEST</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-3 mb-4">
                    <span class="font-code text-code text-on-surface-variant opacity-60">{{ entry.date }}</span>
                    <span class="font-code text-code text-on-surface-variant">// {{ entry.label }}</span>
                  </div>
                  <!-- Items -->
                  <ul class="flex flex-col gap-3">
                    <li
                      v-for="item in entry.items"
                      :key="item.text"
                      class="flex gap-3 font-code text-code"
                    >
                      <span class="shrink-0 font-bold" :class="flagClass(item.flag)">[{{ item.flag }}]</span>
                      <span class="text-on-surface-variant">{{ item.text }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/ui/PageHeader.vue'
import { useProjects } from '@/composables/useProjects'
import type { ChangelogFlag } from '@/data/projects'

const route = useRoute()
const projects = useProjects()
const project = computed(() => projects.items.value.find(p => p.name === route.params.name))

function flagClass(flag: ChangelogFlag) {
  const map: Record<ChangelogFlag, string> = {
    ADDED: 'text-tertiary',
    FIXED: 'text-[#4ade80]',
    IMPRV: 'text-primary',
    INIT:  'text-on-surface-variant',
    WARN:  'text-error',
  }
  return map[flag]
}
</script>
