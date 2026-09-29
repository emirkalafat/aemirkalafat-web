<template>
  <div class="flex-1 flex flex-col">
    <main class="flex-1 flex flex-col pt-24 lg:pt-margin-desktop px-margin-mobile md:px-margin-desktop gap-24 max-w-7xl mx-auto w-full pb-margin-desktop">

      <!-- 00 // Hero -->
      <section
        ref="heroEl"
        class="relative isolate z-10 grid grid-cols-1 md:grid-cols-12 gap-gutter items-center pt-4 md:min-h-[614px]"
        @pointermove="onHeroPointer">
        <div class="hero-grid absolute inset-0 -z-10 pointer-events-none" aria-hidden="true"></div>

        <div class="md:col-span-7 flex flex-col gap-6">
          <div class="hero-in inline-block bg-surface-container-lowest border border-primary px-4 py-2 self-start" style="--d: 0ms">
            <span class="font-code text-code text-tertiary-text blinking-cursor">&gt; SYSTEM INITIALIZED</span>
          </div>
          <h1 class="font-display text-headline-lg md:text-display text-on-surface leading-tight">
            <span class="hero-in block" style="--d: 120ms">FROM</span>
            <span class="hero-in block" style="--d: 240ms"><span class="circuit-text">CIRCUITS</span></span>
            <span class="hero-in block" style="--d: 360ms">TO CODE.</span>
          </h1>

          <!-- Description: collapsible on mobile, always visible on desktop -->
          <div class="hero-in border-l-4 border-primary pl-4" style="--d: 480ms">
            <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl"
              :class="bioExpanded ? '' : 'line-clamp-2 md:line-clamp-none'">
              Hello, <b>Ahmet Emir Kalafat</b>, here. I'm a Computer &amp; Electrical Engineer with a Double Major from Fatih Sultan Mehmet Vakıf University and an Erasmus+ exchange in Electrical &amp; Automation Engineering under my belt. Professionally, I've been building software at talsen team GmbH and previously developed mobile applications at SameUp — always chasing that sweet spot between low-level hardware and high-level software.
            </p>
            <button
              class="md:hidden mt-2 font-code text-code text-tertiary-text flex items-center gap-1 uppercase"
              @click="bioExpanded = !bioExpanded">
              <span class="material-symbols-outlined text-[14px]">{{ bioExpanded ? 'expand_less' : 'expand_more' }}</span>
              {{ bioExpanded ? 'Read less' : 'Read more' }}
            </button>
          </div>

          <div class="hero-in relative z-20 flex flex-wrap gap-4 mt-4 md:mt-8" style="--d: 600ms">
            <CvDownloadMenu />
            <a href="https://github.com/emirkalafat" target="_blank" rel="noopener"
              @click="trackSocialClick('github', 'hero')"
              class="border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md px-8 py-4 uppercase transition-colors flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">code</span>
              GitHub
            </a>
          </div>
        </div>

        <HeroTerminal v-if="isDesktop" class="hero-in md:col-span-5" style="--d: 500ms" />
      </section>

      <!-- 01 // Experience: vertical timeline -->
      <section class="flex flex-col gap-10">
        <SectionHeading index="01" title="Experience.Log()" accent="tertiary" />
        <div class="relative flex flex-col gap-gutter md:pl-10">
          <div class="hidden md:block absolute left-3 top-2 bottom-2 w-px bg-tertiary/40" aria-hidden="true"></div>
          <div v-for="(exp, i) in experience" :key="exp.company" v-reveal="i * 120" class="relative">
            <span
              class="hidden md:block absolute -left-[34px] top-6 w-3 h-3 rotate-45 bg-tertiary ring-4 ring-surface-container-lowest"
              aria-hidden="true">
              <span v-if="isCurrent(exp)" class="absolute inset-0 bg-tertiary animate-ping"></span>
            </span>
            <ExperienceCard v-bind="exp" />
          </div>
        </div>
      </section>

      <!-- 02 // Projects: inverted band with tech ticker -->
      <section v-reveal class="border border-primary bg-on-surface text-background overflow-hidden brutalist-offset shadow-cyber-purple">
        <TechMarquee :items="allSkills" />
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 p-gutter">
          <div class="flex flex-col gap-2">
            <p class="font-label-md text-label-md font-code uppercase text-background/60">02 // Projects.ls()</p>
            <p class="font-body-md text-body-md text-background/80 max-w-lg">
              Want to see what I actually build? Check out my projects — side quests, experiments, and things that (mostly) work in production.
            </p>
          </div>
          <RouterLink to="/projects"
            class="shrink-0 flex items-center gap-2 bg-background text-on-surface font-label-md text-label-md px-8 py-4 uppercase brutalist-offset-hover shadow-cyber-purple transition-[box-shadow]">
            <span class="material-symbols-outlined text-[18px]">folder_open</span>
            View Projects
          </RouterLink>
        </div>
      </section>

      <!-- 03 // Education: call stack -->
      <section class="flex flex-col gap-10">
        <SectionHeading index="03" title="Education.Stack()" accent="purple" />
        <EducationStack :items="education" />
      </section>

      <!-- 04 // Terminal: lives in the hero on desktop, down here on mobile -->
      <section v-if="!isDesktop" class="flex flex-col gap-10">
        <SectionHeading index="04" title="Terminal.Open()" accent="primary" />
        <HeroTerminal v-reveal />
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ExperienceCard from '@/components/ui/ExperienceCard.vue'
import CvDownloadMenu from '@/components/ui/CvDownloadMenu.vue'
import HeroTerminal from '@/components/home/HeroTerminal.vue'
import SectionHeading from '@/components/home/SectionHeading.vue'
import TechMarquee from '@/components/home/TechMarquee.vue'
import EducationStack from '@/components/home/EducationStack.vue'
import { experience, education, allSkills } from '@/data/experience'
import type { WorkExperience } from '@/data/experience'
import { useAnalytics } from '@/composables/useAnalytics'
import { vReveal } from '@/composables/useReveal'

const bioExpanded = ref(false)
const { trackSocialClick } = useAnalytics()

const desktopQuery = window.matchMedia('(min-width: 768px)')
const isDesktop = ref(desktopQuery.matches)
const onQueryChange = (e: MediaQueryListEvent) => (isDesktop.value = e.matches)
onMounted(() => desktopQuery.addEventListener('change', onQueryChange))
onBeforeUnmount(() => desktopQuery.removeEventListener('change', onQueryChange))

const isCurrent = (exp: WorkExperience) => exp.roles.some(r => /present/i.test(r.period))

const heroEl = ref<HTMLElement | null>(null)
let raf = 0
function onHeroPointer(e: PointerEvent) {
  if (raf || !heroEl.value) return
  const el = heroEl.value
  const { clientX, clientY } = e
  raf = requestAnimationFrame(() => {
    raf = 0
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${clientX - r.left}px`)
    el.style.setProperty('--my', `${clientY - r.top}px`)
  })
}
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>
