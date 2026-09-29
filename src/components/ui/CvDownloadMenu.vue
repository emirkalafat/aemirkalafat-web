<template>
  <div ref="root" class="relative" @keydown.esc="close">
    <button type="button"
      :aria-expanded="open"
      aria-haspopup="true"
      @click="open = !open"
      class="bg-primary text-on-primary border border-primary font-label-md text-label-md px-8 py-4 uppercase hover:bg-tertiary hover:text-on-tertiary hover:border-tertiary hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#BD00FF] transition-all duration-100 flex items-center gap-2">
      <span class="material-symbols-outlined text-[18px]">download</span>
      Download CV
      <span class="material-symbols-outlined text-[18px] transition-transform" :class="open ? 'rotate-180' : ''">expand_more</span>
    </button>

    <div v-if="open"
      class="absolute left-0 top-full mt-3 z-30 w-[min(20rem,calc(100vw-2rem))] bg-surface-container-lowest border border-primary shadow-[4px_4px_0px_#BD00FF]">
      <div v-for="(group, gi) in groups" :key="group.field" :class="gi > 0 ? 'border-t border-primary' : ''">
        <p class="font-code text-code text-tertiary-text uppercase px-4 pt-3 pb-1">// {{ group.field }}</p>
        <a v-for="item in group.items" :key="item.lang"
          :href="item.href" :download="item.file" target="_blank" rel="noopener"
          @click="onDownload(group.field, item.lang)"
          class="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-primary hover:text-on-primary transition-colors"
          :class="item.lang === preferredLang ? 'font-bold' : ''">
          <span class="font-code text-code border border-current px-2 py-0.5">{{ item.lang }}</span>
          <span class="font-label-md text-label-md flex-1">{{ item.title }}</span>
          <span v-if="item.lang === preferredLang" class="font-code text-[10px] uppercase opacity-70">önerilen</span>
          <span class="material-symbols-outlined text-[18px]">download</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'

const { trackCvDownload } = useAnalytics()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const preferredLang = navigator.language?.toLowerCase().startsWith('tr') ? 'TR' : 'EN'

const cv = (name: string, lang: string) => ({
  lang,
  file: `Ahmet_Emir_Kalafat_CV_${name}_${lang}.pdf`,
  href: `/Ahmet_Emir_Kalafat_CV_${name}_${lang}.pdf`,
})

const groups = [
  {
    field: 'Software',
    items: [
      { ...cv('Software', 'TR'), title: 'Yazılım Mühendisi' },
      { ...cv('Software', 'EN'), title: 'Software Engineer' },
    ],
  },
  {
    field: 'Electrical',
    items: [
      { ...cv('Electrical', 'TR'), title: 'Elektrik Mühendisi' },
      { ...cv('Electrical', 'EN'), title: 'Electrical Engineer' },
    ],
  },
]

function close() { open.value = false }

function onDownload(field: string, lang: string) {
  trackCvDownload(field.toLowerCase(), lang.toLowerCase())
  close()
}

function onOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) close()
}

onMounted(() => document.addEventListener('click', onOutside))
onBeforeUnmount(() => document.removeEventListener('click', onOutside))
</script>
