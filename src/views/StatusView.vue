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
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        <article
          v-for="service in services"
          :key="service.name"
          class="bg-surface-container-lowest border relative group flex flex-col"
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
              <span
                class="font-code text-code"
                :class="service.status === 'OUTAGE' ? 'text-on-error' : 'text-on-primary'"
              >{{ service.status }}</span>
              <span
                v-if="service.status === 'OPERATIONAL'"
                class="w-2 h-2 bg-on-tertiary-container animate-pulse"
              ></span>
              <span
                v-else
                class="w-2 h-2 bg-on-error animate-ping"
              ></span>
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
            <div class="relative h-16 w-full border border-surface-variant bg-background overflow-hidden">
              <!-- Vertical grid lines -->
              <div
                class="absolute inset-0 opacity-20"
                style="background-image: linear-gradient(to right, #353535 1px, transparent 1px); background-size: 10% 100%;"
              ></div>
              <!-- SVG Sparkline -->
              <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                <!-- Fill area (operational only) -->
                <polygon
                  v-if="service.status === 'OPERATIONAL'"
                  :points="`${service.sparklinePoints} 100,20 0,20`"
                  fill="rgba(76,214,255,0.08)"
                />
                <!-- Line -->
                <polyline
                  :points="service.sparklinePoints"
                  fill="none"
                  :stroke="service.status === 'OUTAGE' ? '#ffb4ab' : '#4cd6ff'"
                  stroke-width="1"
                  vector-effect="non-scaling-stroke"
                  :class="service.status === 'OPERATIONAL' ? 'sparkline-path' : ''"
                />
              </svg>
              <!-- Error overlay label -->
              <div
                v-if="service.errorLabel"
                class="absolute bottom-1 right-1 font-code text-code text-error bg-background px-1"
              >{{ service.errorLabel }}</div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/ui/PageHeader.vue'

interface ServiceData {
  name: string
  status: 'OPERATIONAL' | 'OUTAGE'
  uptime: string
  latency: string
  sparklinePoints: string
  errorLabel?: string
}

const services: ServiceData[] = [
  {
    name: 'API_GATEWAY',
    status: 'OPERATIONAL',
    uptime: '99.999%',
    latency: '12ms',
    sparklinePoints: '0,15 10,12 20,14 30,8 40,10 50,7 60,9 70,6 80,8 90,5 100,7',
  },
  {
    name: 'BUILD_SERVER',
    status: 'OPERATIONAL',
    uptime: '99.997%',
    latency: '45ms',
    sparklinePoints: '0,16 10,14 20,15 30,11 40,13 50,10 60,12 70,9 80,11 90,8 100,10',
  },
  {
    name: 'DATA_PIPELINE',
    status: 'OPERATIONAL',
    uptime: '99.981%',
    latency: '128ms',
    sparklinePoints: '0,14 10,16 20,12 30,14 40,10 50,13 60,9 70,12 80,8 90,11 100,9',
  },
  {
    name: 'AUTH_MODULE',
    status: 'OPERATIONAL',
    uptime: '99.994%',
    latency: '8ms',
    sparklinePoints: '0,13 10,11 20,13 30,9 40,12 50,8 60,11 70,7 80,10 90,6 100,8',
  },
  {
    name: 'MEDIA_CACHE',
    status: 'OPERATIONAL',
    uptime: '99.972%',
    latency: '67ms',
    sparklinePoints: '0,15 10,13 20,16 30,12 40,14 50,11 60,13 70,10 80,12 90,9 100,11',
  },
  {
    name: 'LOG_AGGREGATOR',
    status: 'OUTAGE',
    uptime: '87.3%',
    latency: 'TIMEOUT',
    sparklinePoints: '0,10 10,10 20,10 30,10 40,10 50,10 60,15 70,18 80,19 90,19 100,19',
    errorLabel: 'CONNECTION_REFUSED',
  },
]

const overallUptime = '99.998%'
</script>
