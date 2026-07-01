<template>
  <div class="flex-1 flex flex-col">
    <PageHeader
      title="SYSTEM_STATUS"
      description="Real-time system diagnostics and operational telemetry across all active service nodes."
    >
      <template #filters>
        <div class="flex items-center gap-3 bg-surface-container-lowest border border-primary px-4 py-3 self-start">
          <span class="w-2 h-2 bg-on-tertiary-container animate-pulse"></span>
          <span class="font-code text-code text-tertiary uppercase">Overall Uptime: {{ overallUptime }}</span>
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
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        <article
          v-for="service in services"
          :key="service.name"
          class="bg-surface-container-lowest border relative group flex flex-col brutalist-offset-hover shadow-tertiary transition-[box-shadow]"
          :class="service.status === 'OUTAGE'
            ? 'border-2 border-error-container'
            : 'border-primary'"
        >
          <!-- Hover border overlay (no layout shift) -->
          <div class="absolute -inset-[1px] border border-tertiary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"></div>

          <!-- Card Header Strip -->
          <div
            class="px-4 py-2 flex justify-between items-center"
            :class="service.status === 'OUTAGE' ? 'bg-error' : 'bg-primary'"
          >
            <span
              class="font-code text-label-md uppercase tracking-widest"
              :class="service.status === 'OUTAGE' ? 'text-on-error' : 'text-on-primary'"
            >{{ service.name }}</span>
            <div class="flex items-center gap-2">
              <!-- Default: status text + indicator dot -->
              <span
                class="font-code text-code"
                :class="[
                  service.status === 'OUTAGE' ? 'text-on-error' : 'text-on-primary',
                  service.url ? 'group-hover:hidden' : ''
                ]"
              >{{ service.status }}</span>
              <span
                v-if="service.status === 'OPERATIONAL'"
                class="w-2 h-2 bg-on-tertiary-container animate-pulse"
                :class="service.url ? 'group-hover:hidden' : ''"
              ></span>
              <span
                v-else
                class="w-2 h-2 bg-on-error animate-ping"
                :class="service.url ? 'group-hover:hidden' : ''"
              ></span>
              <!-- Hover: VISIT link -->
              <a
                v-if="service.url"
                :href="service.url"
                target="_blank"
                rel="noopener noreferrer"
                class="font-code text-code hidden group-hover:flex items-center gap-1"
                :class="service.status === 'OUTAGE' ? 'text-on-error' : 'text-on-primary'"
                @click.stop
              >
                <span class="material-symbols-outlined text-[13px]">open_in_new</span>
                VISIT
              </a>
            </div>
          </div>

          <!-- Card Body -->
          <div
            class="p-6 flex-1 flex flex-col gap-6"
            :class="service.status === 'OUTAGE'
              ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(147,0,10,0.05)_10px,rgba(147,0,10,0.05)_20px)]'
              : ''"
          >
            <!-- Stats Row -->
            <div class="flex justify-between items-baseline border-b border-surface-variant pb-4">
              <div>
                <p class="font-code text-code text-on-surface-variant uppercase mb-1">Uptime</p>
                <p class="font-headline-md text-headline-md text-on-surface">{{ service.uptime }}</p>
              </div>
              <div class="text-right">
                <p class="font-code text-code text-on-surface-variant uppercase mb-1">Latency</p>
                <p
                  class="font-code text-body-lg"
                  :class="service.status === 'OUTAGE' ? 'text-error' : 'text-tertiary'"
                >{{ service.latency }}</p>
              </div>
            </div>

            <!-- Sparkline -->
            <div class="flex flex-col gap-1">
              <div class="relative h-16 w-full border border-surface-variant bg-background overflow-hidden">
                <!-- Vertical grid lines -->
                <div
                  class="absolute inset-0 opacity-20"
                  style="background-image: linear-gradient(to right, #353535 1px, transparent 1px); background-size: 10% 100%;"
                ></div>
                <!-- SVG Sparkline -->
                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <!-- Down/maintenance column overlays -->
                  <template v-for="(pt, i) in service.sparklineData" :key="i">
                    <rect
                      v-if="pt.status !== 1"
                      :x="pt.x - (100 / service.sparklineData.length) / 2"
                      :width="100 / service.sparklineData.length"
                      y="0"
                      height="20"
                      :fill="pt.status === 0 ? 'rgba(255,180,171,0.35)' : 'rgba(255,220,100,0.2)'"
                    />
                  </template>
                  <!-- Ping baseline guide -->
                  <line x1="0" y1="18" x2="100" y2="18" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" vector-effect="non-scaling-stroke" />
                  <!-- Ping line — breaks at non-up segments, spikes up = high latency = bad -->
                  <path
                    :d="buildLinePath(service.sparklineData)"
                    fill="none"
                    stroke="#4cd6ff"
                    stroke-width="1"
                    vector-effect="non-scaling-stroke"
                  />
                  <!-- Max ping axis label (top-left) -->
                  <text x="1" y="5" font-size="3.5" font-family="monospace" fill="rgba(76,214,255,0.5)">{{ service.sparklineMaxPing }}ms</text>
                  <!-- Zero baseline label (bottom-left) -->
                  <text x="1" y="19.5" font-size="3.5" font-family="monospace" fill="rgba(76,214,255,0.5)">0ms</text>
                </svg>
                <!-- Error overlay label -->
                <div
                  v-if="service.errorLabel"
                  class="absolute bottom-1 right-1 font-code text-code text-error bg-background px-1"
                >{{ service.errorLabel }}</div>
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
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/ui/PageHeader.vue'
import { useStatus, type SparklinePoint } from '@/composables/useStatus'

const { services, overallUptime, loading, error } = useStatus()

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
