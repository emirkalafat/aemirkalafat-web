<template>
  <div class="flex-1 flex flex-col">
    <PageHeader
      title="MINECRAFT_SERVERS"
      description="Real-time metrics for all Minecraft servers."
    >
      <template #filters>
        <div v-if="servers.length > 0" class="flex items-center gap-3 bg-surface-container-lowest border border-primary px-4 py-3 self-start">
          <span class="w-2 h-2 bg-on-tertiary-container animate-pulse"></span>
          <span class="font-code text-code text-tertiary uppercase">{{ onlineCount }} / {{ servers.length }} online</span>
        </div>
      </template>
    </PageHeader>

    <section class="flex-1 p-margin-mobile lg:p-margin-desktop bg-surface-container-lowest">
      <div v-if="loading" class="flex items-center justify-center h-64">
        <p class="text-on-surface-variant">Loading servers...</p>
      </div>
      <div v-else-if="error" class="flex items-center justify-center h-64">
        <div class="text-center">
          <p class="text-error font-code text-label-lg mb-2">{{ error }}</p>
          <p class="text-on-surface-variant text-body-md">Failed to connect to Crafty Controller</p>
        </div>
      </div>
      <div v-else-if="servers.length === 0" class="flex items-center justify-center h-64">
        <p class="text-on-surface-variant">No servers available</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-flow-row-dense gap-6 lg:gap-8">
        <MinecraftServerCard v-for="server in servers" :key="server.id" :server="server"
          :class="server.state === 'ONLINE' ? 'row-span-2' : ''" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import MinecraftServerCard from '@/components/ui/MinecraftServerCard.vue'
import { useCrafty } from '@/composables/useCrafty'

const { servers, loading, error } = useCrafty()

const onlineCount = computed(() => servers.value.filter((s) => s.state === 'ONLINE').length)
</script>
