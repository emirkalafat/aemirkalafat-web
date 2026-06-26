<template>
  <div class="flex-1 flex flex-col">
    <PageHeader
      title="PROJECTS"
      description="Technical implementations spanning hardware integration, software architecture, and systems design."
    />

    <section class="flex-1 p-margin-mobile lg:p-margin-desktop bg-surface-container-lowest">
      <div class="max-w-3xl">
        <div class="border border-primary bg-surface p-8 text-center">
          <span class="material-symbols-outlined text-[64px] text-tertiary opacity-50 block mb-4">construction</span>
          <h2 class="text-headline-md font-headline-md text-primary mb-2">PROJECT_MANIFEST</h2>
          <p class="text-body-md font-body-md text-on-surface-variant">
            [LOADING PROJECTS DATASET...]
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/ui/PageHeader.vue'
</script>
