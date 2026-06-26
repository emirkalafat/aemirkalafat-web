<template>
  <div class="flex-1 flex flex-col">
    <PageHeader
      title="BLOG"
      description="Technical writing on systems, architecture, and deep technology concepts."
    />

    <section class="flex-1 p-margin-mobile lg:p-margin-desktop bg-surface-container-lowest">
      <div class="max-w-3xl">
        <div class="border border-primary bg-surface p-8 text-center">
          <span class="material-symbols-outlined text-[64px] text-tertiary opacity-50 block mb-4">article</span>
          <h2 class="text-headline-md font-headline-md text-primary mb-2">ARTICLES_INDEX</h2>
          <p class="text-body-md font-body-md text-on-surface-variant">
            [FETCHING ARTICLES FROM ARCHIVE...]
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/ui/PageHeader.vue'
</script>
