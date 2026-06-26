<template>
  <div class="flex-1 flex flex-col">
    <PageHeader
      title="SYSTEM_STATUS"
      description="Real-time system diagnostics and operational status monitoring."
    />

    <section class="flex-1 p-margin-mobile lg:p-margin-desktop bg-surface-container-lowest">
      <div class="max-w-3xl">
        <div class="border-2 border-tertiary bg-surface p-8 mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="w-3 h-3 bg-tertiary animate-pulse rounded-none"></span>
            <span class="text-label-md font-code text-tertiary">SYSTEM_ONLINE</span>
          </div>
          <h2 class="text-headline-md font-headline-md text-primary mb-2">ALL_SYSTEMS_NOMINAL</h2>
          <p class="text-body-md font-body-md text-on-surface-variant">
            The system is running at optimal capacity. All core functions are operational and responding within expected parameters.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div class="border border-primary bg-surface p-6">
            <p class="text-label-md font-code text-on-surface-variant mb-2">UPTIME</p>
            <p class="text-headline-md font-headline-md text-primary">99.9%</p>
          </div>

          <div class="border border-primary bg-surface p-6">
            <p class="text-label-md font-code text-on-surface-variant mb-2">RESPONSE_TIME</p>
            <p class="text-headline-md font-headline-md text-primary">&lt; 50ms</p>
          </div>

          <div class="border border-primary bg-surface p-6">
            <p class="text-label-md font-code text-on-surface-variant mb-2">LAST_SYNC</p>
            <p class="text-headline-md font-headline-md text-primary">NOW</p>
          </div>

          <div class="border border-primary bg-surface p-6">
            <p class="text-label-md font-code text-on-surface-variant mb-2">STATUS</p>
            <p class="text-headline-md font-headline-md text-tertiary">ACTIVE</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/ui/PageHeader.vue'
</script>
