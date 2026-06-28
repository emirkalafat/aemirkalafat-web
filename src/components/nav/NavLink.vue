<template>
  <RouterLink :to="to"
    class="flex items-center gap-4 p-3 text-label-md font-code text-on-surface-variant hover:bg-surface-container-high transition-colors router-link-active:bg-primary router-link-active:text-on-primary router-link-active:font-bold router-link-active:border-l-4 router-link-active:border-tertiary">
    <span class="material-symbols-outlined">{{ icon }}</span>
    <span>{{ label }}</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

interface Props {
  to: string;
  icon: string;
  label: string;
}

defineProps<Props>();
</script>
