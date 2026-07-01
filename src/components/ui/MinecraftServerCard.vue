<template>
  <article
    class="bg-surface-container-lowest border relative group flex flex-col brutalist-offset-hover shadow-tertiary transition-[box-shadow]"
    :class="server.state === 'CRASHED' ? 'border-2 border-error-container' : 'border-primary'"
  >
    <!-- Hover border overlay -->
    <div class="absolute -inset-[1px] border border-tertiary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"></div>

    <!-- Card Header Strip -->
    <div
      class="px-4 py-2 flex justify-between items-center"
      :class="server.state === 'CRASHED' ? 'bg-error' : server.state === 'ONLINE' ? 'bg-primary' : 'bg-surface-variant'"
    >
      <span
        class="font-code text-label-md uppercase tracking-widest"
        :class="server.state === 'CRASHED' ? 'text-on-error' : server.state === 'ONLINE' ? 'text-on-primary' : 'text-on-surface-variant'"
      >{{ server.name }}</span>
      <div class="flex items-center gap-2">
        <span
          class="font-code text-code"
          :class="server.state === 'CRASHED' ? 'text-on-error' : server.state === 'ONLINE' ? 'text-on-primary' : 'text-on-surface-variant'"
        >{{ server.state }}</span>
        <span
          class="w-2 h-2 animate-pulse"
          :class="server.state === 'ONLINE' ? 'bg-on-primary' : server.state === 'CRASHED' ? 'bg-on-error animate-ping' : 'bg-on-surface-variant'"
        ></span>
      </div>
    </div>

    <!-- Card Body -->
    <div
      class="p-6 flex-1 flex flex-col gap-4"
      :class="server.state === 'CRASHED' ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(147,0,10,0.05)_10px,rgba(147,0,10,0.05)_20px)]' : ''"
    >
      <!-- Players Row -->
      <div class="flex justify-between items-baseline border-b border-surface-variant pb-3">
        <div>
          <p class="font-code text-code text-on-surface-variant uppercase mb-1">Players</p>
          <p class="font-headline-md text-headline-md text-on-surface">{{ server.players }}</p>
        </div>
        <div class="text-right">
          <p class="font-code text-code text-on-surface-variant uppercase mb-1">Version</p>
          <p class="font-code text-body-lg text-tertiary">{{ server.version }}</p>
        </div>
      </div>

      <!-- World Row -->
      <div class="flex justify-between items-baseline border-b border-surface-variant pb-3">
        <div class="flex-1">
          <p class="font-code text-code text-on-surface-variant uppercase mb-1">World</p>
          <p class="font-code text-body-md text-on-surface truncate">{{ server.world }}</p>
        </div>
      </div>

      <!-- CPU / Memory Row -->
      <div class="flex justify-between items-baseline border-b border-surface-variant pb-3">
        <div>
          <p class="font-code text-code text-on-surface-variant uppercase mb-1">CPU</p>
          <p class="font-code text-body-lg text-tertiary">{{ server.cpu }}</p>
        </div>
        <div class="text-right">
          <p class="font-code text-code text-on-surface-variant uppercase mb-1">Memory</p>
          <p class="font-code text-body-lg text-tertiary">{{ server.mem }}</p>
        </div>
      </div>

      <!-- Connect Address (copyable) -->
      <div class="flex items-center justify-between">
        <p class="font-code text-code text-on-surface-variant uppercase mb-0">Connect</p>
        <button
          @click="copyToClipboard"
          class="flex items-center gap-2 px-3 py-1 rounded bg-tertiary text-on-tertiary hover:bg-on-tertiary hover:text-tertiary transition-colors font-code text-code"
          :title="`Click to copy: ${server.address}`"
        >
          <span class="material-symbols-outlined text-[14px]">{{ copied ? 'check' : 'content_copy' }}</span>
          <span class="text-xs">{{ server.address }}</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MinecraftServer } from '@/composables/useCrafty'

const props = defineProps<{
  server: MinecraftServer
}>()

const copied = ref(false)

function copyToClipboard() {
  navigator.clipboard.writeText(props.server.address).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  })
}
</script>
