<template>
  <article
    class="bg-surface-container-lowest border relative group flex flex-col brutalist-offset-hover shadow-tertiary transition-[box-shadow] border-primary"
  >
    <!-- Hover border overlay -->
    <div class="absolute -inset-[1px] border border-tertiary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"></div>

    <!-- Card Header Strip -->
    <div
      class="px-4 py-2 flex justify-between items-center"
      :class="server.state === 'ONLINE' ? 'bg-primary' : 'bg-surface-variant'"
    >
      <span
        class="font-code text-label-md uppercase tracking-widest"
        :class="server.state === 'ONLINE' ? 'text-on-primary' : 'text-on-surface-variant'"
      >{{ server.name }}</span>
      <div class="flex items-center gap-2">
        <span
          class="font-code text-code"
          :class="server.state === 'ONLINE' ? 'text-on-primary' : 'text-on-surface-variant'"
        >{{ server.state }}</span>
        <span
          class="w-2 h-2 animate-pulse"
          :class="server.state === 'ONLINE' ? 'bg-on-primary' : 'bg-on-surface-variant'"
        ></span>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-6 flex-1 flex flex-col gap-4">
      <!-- Players Row -->
      <div class="flex justify-between items-baseline pb-3" :class="server.desc ? 'border-b border-surface-variant' : ''">
        <div>
          <p class="font-code text-code text-on-surface-variant uppercase mb-1">Players</p>
          <p class="font-headline-md text-headline-md text-on-surface">{{ server.players }}</p>
        </div>
        <div class="text-right">
          <p class="font-code text-code text-on-surface-variant uppercase mb-1">Version</p>
          <p class="font-code text-body-lg text-tertiary">{{ server.version }}</p>
        </div>
      </div>

      <!-- Description Row -->
      <div v-if="server.desc" class="flex-1">
        <p class="font-code text-code text-on-surface-variant uppercase mb-1">Description</p>
        <p class="font-code text-body-md text-on-surface truncate">{{ server.desc }}</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { MinecraftServer } from '@/composables/useCrafty'

defineProps<{
  server: MinecraftServer
}>()
</script>
