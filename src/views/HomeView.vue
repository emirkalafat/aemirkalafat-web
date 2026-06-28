<template>
  <div class="flex-1 flex flex-col">
    <main class="flex-1 flex flex-col pt-24 lg:pt-margin-desktop px-margin-mobile md:px-margin-desktop gap-16 max-w-7xl mx-auto w-full pb-margin-desktop">

      <!-- Hero Section -->
      <section class="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center min-h-[614px]">
        <div class="md:col-span-8 flex flex-col gap-6">
          <div class="inline-block bg-surface-container-lowest border border-primary px-4 py-2 self-start">
            <span class="font-code text-code text-tertiary blinking-cursor">&gt; SYSTEM INITIALIZED</span>
          </div>
          <h1 class="font-display text-headline-lg-mobile md:text-display text-on-surface leading-tight">
            ENGINEERING <br/>
            <span class="text-transparent" style="-webkit-text-stroke: 1px #e5e2e1;">AT THE SILICON</span> <br/>
            LEVEL.
          </h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl border-l-4 border-primary pl-4">
            I'm a Computer &amp; Electrical Engineer with a Double Major from Fatih Sultan Mehmet Vakıf University and an Erasmus+ exchange in Electrical &amp; Automation Engineering under my belt. Professionally, I've been building software at talsen team GmbH and previously developed mobile applications at SameUp — always chasing that sweet spot between low-level hardware and high-level software.
          </p>
          <div class="flex flex-wrap gap-4 mt-8">
            <a href="/cv.pdf" target="_blank" rel="noopener"
              class="bg-primary text-on-primary border border-primary font-label-md text-label-md px-8 py-4 uppercase hover:bg-tertiary hover:text-on-tertiary hover:border-tertiary hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#BD00FF] transition-all duration-100 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">download</span>
              Download CV
            </a>
            <button class="border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md px-8 py-4 uppercase transition-colors">
              View Source
            </button>
          </div>
        </div>
        <div class="md:col-span-4 relative h-64 md:h-full hidden md:flex items-end min-h-[300px] border border-primary overflow-hidden bg-surface-container">
          <div class="absolute inset-0 opacity-20" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(198,198,198,0.1) 2px, rgba(198,198,198,0.1) 4px);"></div>
          <div class="absolute inset-0 flex items-center justify-center opacity-10">
            <span class="material-symbols-outlined" style="font-size: 120px;">memory</span>
          </div>
          <div class="relative z-10 bg-primary text-on-primary font-code text-code px-2 py-1 m-2">FIG 1.0 - CORE_ARCHITECTURE</div>
        </div>
      </section>

      <!-- Experience Section -->
      <section class="flex flex-col gap-8">
        <h2 class="font-headline-md text-headline-md border-b-2 border-primary pb-2 uppercase w-full">Experience.Log()</h2>
        <div class="flex flex-col gap-gutter">
          <ExperienceCard v-for="exp in experience" :key="exp.company" v-bind="exp" />
        </div>

        <!-- Projects CTA -->
        <div class="border border-primary bg-surface-container-lowest flex flex-col md:flex-row items-center justify-between gap-6 p-gutter mt-4">
          <div class="flex flex-col gap-2">
            <p class="font-label-md text-label-md text-tertiary font-code uppercase">Projects.ls()</p>
            <p class="font-body-md text-body-md text-on-surface-variant max-w-lg">
              Want to see what I actually build? Check out my projects — side quests, experiments, and things that (mostly) work in production.
            </p>
          </div>
          <RouterLink to="/projects"
            class="shrink-0 flex items-center gap-2 bg-on-surface text-background font-label-md text-label-md px-8 py-4 uppercase hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#BD00FF] transition-all duration-100">
            <span class="material-symbols-outlined text-[18px]">folder_open</span>
            View Projects
          </RouterLink>
        </div>
      </section>

      <!-- Education Section -->
      <section class="flex flex-col gap-8">
        <h2 class="font-headline-md text-headline-md border-b-2 border-primary pb-2 uppercase w-full">Education.Stack()</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <EducationCard v-for="edu in education" :key="edu.institution + edu.degree" v-bind="edu" />
        </div>
      </section>

      <!-- Terminal Output Card -->
      <section class="flex flex-col gap-8">
        <h2 class="font-headline-md text-headline-md border-b-2 border-primary pb-2 uppercase w-full">System.Status()</h2>
        <div class="border border-outline bg-surface-container-lowest p-0">
          <div class="bg-primary text-on-primary font-code text-code px-4 py-2 border-b border-outline flex justify-between">
            <span>bash - 80x24</span>
            <span>_ </span>
          </div>
          <div class="p-4 font-code text-code text-on-surface-variant flex flex-col gap-2 h-auto overflow-y-auto">
            <div class="flex gap-4">
              <span class="text-tertiary select-none">1</span>
              <span class="text-primary">$ ./compile_career.sh</span>
            </div>
            <div class="flex gap-4">
              <span class="text-tertiary select-none">2</span>
              <span>[INFO] Stacking education modules...</span>
            </div>
            <div class="flex gap-4">
              <span class="text-tertiary select-none">3</span>
              <span>[✓] FSMVU: Double Major in Computer Engineering (2021-2026)</span>
            </div>
            <div class="flex gap-4">
              <span class="text-tertiary select-none">4</span>
              <span>[✓] Erasmus+ Exchange: Electrical &amp; Automation Eng (2023)</span>
            </div>
            <div class="flex gap-4">
              <span class="text-tertiary select-none">5</span>
              <span>[INFO] Loading career experience buffer...</span>
            </div>
            <div class="flex gap-4">
              <span class="text-tertiary select-none">6</span>
              <span>[✓] talsen team GmbH: Full-stack Developer (1 yr 10 mos)</span>
            </div>
            <div class="flex gap-4">
              <span class="text-tertiary select-none">7</span>
              <span>[✓] SameUp: Mobile Dev Trailblazer (1 yr 2 mos)</span>
            </div>
            <div class="flex gap-4">
              <span class="text-tertiary select-none">8</span>
              <span>[INFO] Skill matrix compiled: Hardware + Software fusion ⚡</span>
            </div>
            <div class="flex gap-4">
              <span class="text-tertiary select-none">9</span>
              <span class="text-error">[WARN] Coffee levels depleted. System unstable without caffeine.</span>
            </div>
            <div class="flex gap-4">
              <span class="text-tertiary select-none">10</span>
              <span class="text-primary blinking-cursor">$ </span>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import ExperienceCard from '@/components/ui/ExperienceCard.vue'
import EducationCard from '@/components/ui/EducationCard.vue'
import { experience, education } from '@/data/experience'
</script>
