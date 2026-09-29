<template>
  <div v-if="!ready" class="flex-1 flex items-center justify-center p-margin-desktop">
    <p class="font-code text-on-surface-variant uppercase animate-pulse">LOADING_RECORD...</p>
  </div>
  <SeriesDetailView v-else-if="card?.kind === 'SERIES'" :key="card.id" :card="card" />
  <MediaDetailView v-else />
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MediaDetailView from '@/views/MediaDetailView.vue'
import SeriesDetailView from '@/views/SeriesDetailView.vue'
import { useMedia } from '@/composables/useMedia'
import { mediaRoute } from '@/utils/media'

const route = useRoute()
const router = useRouter()
const { items, ready } = useMedia()

const card = computed(() => items.value.find(c => c.id === route.params.id))

// A raw season id like /media/mando-s1 is redirected to /media/mando/s/1.
watchEffect(() => {
  if (ready.value && card.value?.kind === 'SEASON') router.replace(mediaRoute(card.value))
})
</script>
