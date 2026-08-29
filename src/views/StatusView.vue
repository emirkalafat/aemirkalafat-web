<template>
  <div class="flex-1 flex flex-col">
    <PageHeader title="SYSTEM_STATUS"
      description="Real-time system diagnostics and operational telemetry across all active service nodes.">
      <template #filters>
        <div class="flex items-center gap-3 bg-surface-container-lowest border border-primary px-4 py-3 self-start">
          <span class="w-2 h-2 bg-on-tertiary-container animate-pulse"></span>
          <span class="font-code text-code text-tertiary-text uppercase">Overall Uptime: {{ overallUptime }}</span>
        </div>
      </template>
    </PageHeader>

    <section class="flex-1 p-margin-mobile lg:p-margin-desktop bg-surface-container-lowest">
      <div v-if="loading" class="flex items-center justify-center h-64">
        <p class="text-on-surface-variant">Loading status...</p>
      </div>
      <div v-else-if="error" class="flex items-center justify-center h-64">
        <div class="text-center">
          <p class="text-error font-code text-label-lg mb-2">{{ error }}</p>
          <p class="text-on-surface-variant text-body-md">Status page unavailable</p>
        </div>
      </div>
      <div v-else-if="services.length === 0" class="flex items-center justify-center h-64">
        <p class="text-on-surface-variant">No services available</p>
      </div>
      <div v-else class="flex flex-col gap-6 lg:gap-8">
        <!-- Legend -->
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 font-code text-code text-on-surface-variant uppercase">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 bg-on-tertiary-container"></span>
            <span>Operational</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5" style="background-color: rgba(255, 220, 100, 0.6)"></span>
            <span>Maintenance</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 bg-error"></span>
            <span>Outage</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          <article v-for="service in services" :key="service.name"
            class="bg-surface-container-lowest border relative group flex flex-col brutalist-offset-hover shadow-cyber-purple transition-[box-shadow]"
            :class="service.status === 'OUTAGE'
              ? 'border-2 border-error-container'
              : 'border-primary'">
            <!-- Hover border overlay (no layout shift) -->
            <div
              class="absolute -inset-[1px] border border-tertiary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            </div>

            <!-- Card Header Strip -->
            <div class="px-4 py-2 flex justify-between items-center"
              :class="service.status === 'OUTAGE' ? 'bg-error' : 'bg-primary'">
              <span class="font-code text-label-md uppercase tracking-widest"
                :class="service.status === 'OUTAGE' ? 'text-on-error' : 'text-on-primary'">{{ service.name }}</span>
              <div v-if="!service.url" class="flex items-center gap-2">
                <span class="font-code text-code"
                  :class="service.status === 'OUTAGE' ? 'text-on-error' : 'text-on-primary'">{{ service.status }}</span>
                <span v-if="service.status === 'OPERATIONAL'"
                  class="w-2 h-2 bg-on-tertiary-container animate-pulse"></span>
                <span v-else class="w-2 h-2 bg-on-error animate-ping"></span>
              </div>
              <!-- Status and VISIT link are stacked in the same grid cell so the
                 hover swap never changes this box's size and reflows the grid. -->
              <div v-else class="grid">
                <div
                  class="col-start-1 row-start-1 flex items-center gap-2 transition-opacity group-hover:opacity-0 group-hover:invisible"
                  :class="service.status === 'OUTAGE' ? 'text-on-error' : 'text-on-primary'">
                  <span class="font-code text-code">{{ service.status }}</span>
                  <span v-if="service.status === 'OPERATIONAL'"
                    class="w-2 h-2 bg-on-tertiary-container animate-pulse"></span>
                  <span v-else class="w-2 h-2 bg-on-error animate-ping"></span>
                </div>
                <a :href="service.url" target="_blank" rel="noopener noreferrer"
                  @click.stop="trackStatusServiceVisit(service.name, service.url!)"
                  class="col-start-1 row-start-1 font-code text-code flex items-center gap-1 opacity-0 invisible transition-opacity group-hover:opacity-100 group-hover:visible"
                  :class="service.status === 'OUTAGE' ? 'text-on-error' : 'text-on-primary'">
                  <span class="material-symbols-outlined text-[13px]">open_in_new</span>
                  VISIT
                </a>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6 flex-1 flex flex-col gap-6" :class="service.status === 'OUTAGE'
              ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(147,0,10,0.05)_10px,rgba(147,0,10,0.05)_20px)]'
              : ''">
              <!-- Stats Row -->
              <div class="flex justify-between items-baseline border-b border-surface-variant pb-4">
                <div>
                  <p class="font-code text-code text-on-surface-variant uppercase mb-1">Uptime</p>
                  <p class="font-headline-md text-headline-md text-on-surface">{{ service.uptime }}</p>
                </div>
                <div class="text-right">
                  <p class="font-code text-code text-on-surface-variant uppercase mb-1">Latency</p>
                  <p class="font-code text-body-lg"
                    :class="service.status === 'OUTAGE' ? 'text-error' : 'text-tertiary-text'">
                    {{
                      service.latency }}</p>
                </div>
              </div>

              <!-- Sparkline -->
              <div class="flex flex-col gap-1">
                <div class="relative h-16 w-full border border-surface-variant bg-background overflow-hidden">
                  <!-- Vertical grid lines -->
                  <div class="absolute inset-0 opacity-20"
                    style="background-image: linear-gradient(to right, #353535 1px, transparent 1px); background-size: 10% 100%;">
                  </div>
                  <!-- SVG Sparkline -->
                  <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <!-- Down/maintenance column overlays -->
                    <template v-for="(pt, i) in service.sparklineData" :key="i">
                      <rect v-if="pt.status !== 1" :x="pt.x - (100 / service.sparklineData.length) / 2"
                        :width="100 / service.sparklineData.length" y="0" height="20"
                        :fill="pt.status === 0 ? 'rgba(255,180,171,0.35)' : 'rgba(255,220,100,0.2)'">
                        <title>{{ pt.status
                          === 0 ? 'Outage' : 'Maintenance' }}</title>
                      </rect>
                    </template>
                    <!-- Ping baseline guide -->
                    <line x1="0" y1="18" x2="100" y2="18" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"
                      vector-effect="non-scaling-stroke" />
                    <!-- Ping line — breaks at non-up segments, spikes up = high latency = bad -->
                    <path :d="buildLinePath(service.sparklineData)" fill="none" stroke="#4cd6ff" stroke-width="1"
                      vector-effect="non-scaling-stroke" />
                    <!-- Max ping axis label (top-left) -->
                    <text x="1" y="5" font-size="3.5" font-family="monospace" fill="rgba(76,214,255,0.5)">{{
                      service.sparklineMaxPing }}ms</text>
                    <!-- Zero baseline label (bottom-left) -->
                    <text x="1" y="19.5" font-size="3.5" font-family="monospace" fill="rgba(76,214,255,0.5)">0ms</text>
                  </svg>
                  <!-- Error overlay label -->
                  <div v-if="service.errorLabel"
                    class="absolute bottom-1 right-1 font-code text-code text-error bg-background px-1">{{
                      service.errorLabel
                    }}</div>
                </div>
                <!-- Time axis -->
                <div class="flex justify-between">
                  <span class="font-code text-code text-on-surface-variant opacity-60">-24H</span>
                  <span class="font-code text-code text-on-surface-variant opacity-60">NOW</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Minecraft Servers Section -->
      <div v-if="mcServers.length > 0 || mcLoading || mcError" class="mt-12">
        <h2 class="text-headline-md font-headline-md text-on-surface mb-6 uppercase font-code">Minecraft Servers</h2>

        <div v-if="mcLoading" class="flex items-center justify-center h-48">
          <p class="text-on-surface-variant">Loading servers...</p>
        </div>
        <div v-else-if="mcError" class="flex items-center justify-center h-48">
          <div class="text-center">
            <p class="text-error font-code text-label-lg mb-2">{{ mcError }}</p>
            <p class="text-on-surface-variant text-body-md">Failed to load Minecraft servers</p>
          </div>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-flow-row-dense gap-6 lg:gap-8">
          <MinecraftServerCard v-for="server in mcServers" :key="server.id" :server="server"
            :class="server.state === 'ONLINE' ? 'row-span-2' : ''" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/ui/PageHeader.vue'
import MinecraftServerCard from '@/components/ui/MinecraftServerCard.vue'
import { useStatus, type SparklinePoint } from '@/composables/useStatus'
import { useCrafty } from '@/composables/useCrafty'
import { useAnalytics } from '@/composables/useAnalytics'

const { services, overallUptime, loading, error } = useStatus()
const { servers: mcServers, loading: mcLoading, error: mcError } = useCrafty()
const { trackStatusServiceVisit } = useAnalytics()

function buildLinePath(data: SparklinePoint[]): string {
  let path = ''
  let moveTo = true
  for (const pt of data) {
    if (pt.status === 1 && pt.ping !== null) {
      path += moveTo
        ? `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)} `
        : `L ${pt.x.toFixed(1)},${pt.y.toFixed(1)} `
      moveTo = false
    } else {
      moveTo = true
    }
  }
  return path.trim()
}
</script>
