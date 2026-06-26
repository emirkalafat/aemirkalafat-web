<template>
  <div class="flex-1 flex flex-col">
    <PageHeader
      title="HOME"
      description="Welcome to the system. A technical portfolio built with precision, examining the intersection of hardware and software logic."
    />

    <section class="flex-1 p-margin-mobile lg:p-margin-desktop bg-surface-container-lowest">
      <div class="max-w-3xl">
        <div class="border border-primary bg-surface p-8 mb-8">
          <h2 class="text-headline-md font-headline-md text-primary mb-4">SYSTEM_INITIALIZED</h2>
          <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed mb-4">
            This portfolio demonstrates a neo-brutalist design philosophy—sharp edges, high-contrast interfaces, and a terminal-inspired aesthetic.
          </p>
          <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed">
            Navigate through the system using the sidebar. Explore media reviews, ongoing projects, technical writing, and system status.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div class="border border-primary bg-surface p-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-tertiary">code</span>
              <h3 class="text-headline-md font-headline-md text-primary">ARCHITECTURE</h3>
            </div>
            <p class="text-body-md font-body-md text-on-surface-variant">
              Built with Vue 3, Vite, TypeScript, and Tailwind CSS for optimal performance and developer experience.
            </p>
          </div>

          <div class="border border-primary bg-surface p-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-tertiary">palette</span>
              <h3 class="text-headline-md font-headline-md text-primary">DESIGN</h3>
            </div>
            <p class="text-body-md font-body-md text-on-surface-variant">
              A rigorous color palette and typography system ensure clarity and visual hierarchy throughout.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/ui/PageHeader.vue'
</script>
