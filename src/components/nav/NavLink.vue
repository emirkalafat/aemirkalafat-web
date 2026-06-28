<template>
  <RouterLink
    :to="to"
    @click="$emit('navigate')"
    :class="[
      'flex items-center gap-4 p-3 text-label-md font-code text-on-surface-variant hover:bg-surface-container-high transition-colors',
      activeClass
    ]"
  >
    <span class="material-symbols-outlined">{{ icon }}</span>
    <span>{{ label }}</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

interface Props {
  to: string;
  icon: string;
  label: string;
}

const props = defineProps<Props>();
defineEmits<{ navigate: [] }>();

const route = useRoute();

const isActive = computed(() => {
  if (props.to === "/") {
    return route.path === "/";
  }
  return route.path === props.to || route.path.startsWith(props.to + "/");
});

const activeClass = computed(() =>
  isActive.value
    ? "bg-primary text-white font-bold border-l-4 border-[#a855f7]"
    : ""
);
</script>
