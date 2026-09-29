<template>
  <div class="marquee relative h-11 overflow-hidden border-b border-background/20 select-none" aria-hidden="true">
    <div class="marquee-track absolute left-0 top-0 h-full items-center font-code text-label-md uppercase">
      <ul v-for="n in 2" :key="n" class="flex shrink-0 items-center">
        <li v-for="item in items" :key="item" class="flex items-center">
          <span class="px-6 whitespace-nowrap">{{ item }}</span>
          <span class="text-background/40">//</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: string[] }>()
</script>
