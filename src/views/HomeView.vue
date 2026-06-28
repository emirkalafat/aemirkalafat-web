<template>
  <div class="flex-1 flex flex-col">
    <main class="flex-1 flex flex-col pt-24 lg:pt-margin-desktop px-margin-mobile md:px-margin-desktop gap-16 max-w-7xl mx-auto w-full pb-margin-desktop">

      <!-- Hero Section -->
      <section class="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center min-h-[614px]">
        <div class="md:col-span-8 flex flex-col gap-6">
          <div class="inline-block bg-[#1A1A1A] border border-primary px-4 py-2 self-start">
            <span class="font-code text-code text-tertiary blinking-cursor">&gt; SYSTEM INITIALIZED</span>
          </div>
          <h1 class="font-display text-headline-lg-mobile md:text-display text-on-surface leading-tight">
            ENGINEERING <br/>
            <span class="text-transparent" style="-webkit-text-stroke: 1px #e5e2e1;">AT THE SILICON</span> <br/>
            LEVEL.
          </h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl border-l-4 border-primary pl-4">
            Bridging the gap between physical hardware and abstract logic. Computer &amp; Electrical Engineer focused on high-performance embedded systems and low-latency software architecture.
          </p>
          <div class="flex flex-wrap gap-4 mt-8">
            <button class="bg-primary text-on-primary border border-primary font-label-md text-label-md px-8 py-4 uppercase hover:bg-tertiary hover:text-on-tertiary hover:border-tertiary hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#BD00FF] transition-all duration-100">
              Deploy Protocol
            </button>
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

      <!-- Core Competencies Bento Grid -->
      <section class="flex flex-col gap-8">
        <h2 class="font-headline-md text-headline-md border-b-2 border-primary pb-2 uppercase w-full">Core.Modules()</h2>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">

          <!-- Hardware Card -->
          <div class="md:col-span-7 border border-outline flex flex-col min-h-[300px]">
            <div class="bg-on-surface text-background font-label-md text-label-md uppercase flex justify-between items-center px-4 py-2 border-b border-outline">
              <span>HW_ENGINEERING</span>
              <span class="material-symbols-outlined">memory</span>
            </div>
            <div class="p-6 flex-grow flex flex-col gap-4 bg-surface-container-lowest">
              <p class="font-body-md text-body-md text-on-surface-variant">
                PCB design, FPGA programming, and embedded microcontroller architecture. Designing physical systems that operate with deterministic precision.
              </p>
              <div class="flex flex-wrap gap-2 mt-auto">
                <span class="font-code text-code px-2 py-1 border border-cyber-purple text-cyber-purple">VHDL/Verilog</span>
                <span class="font-code text-code px-2 py-1 border border-cyber-purple text-cyber-purple">Altium</span>
                <span class="font-code text-code px-2 py-1 border border-cyber-purple text-cyber-purple">ARM Cortex</span>
              </div>
            </div>
          </div>

          <!-- Software Card -->
          <div class="md:col-span-5 border border-outline flex flex-col min-h-[300px]">
            <div class="bg-on-surface text-background font-label-md text-label-md uppercase flex justify-between items-center px-4 py-2 border-b border-outline">
              <span>SW_DEVELOPMENT</span>
              <span class="material-symbols-outlined">code</span>
            </div>
            <div class="p-6 flex-grow flex flex-col gap-4 bg-surface-container-lowest">
              <p class="font-body-md text-body-md text-on-surface-variant">
                Low-latency C/C++, Rust systems programming, and Real-Time Operating Systems (RTOS). Writing code that respects the laws of physics.
              </p>
              <div class="flex flex-wrap gap-2 mt-auto">
                <span class="font-code text-code px-2 py-1 border border-tertiary text-tertiary">C/C++</span>
                <span class="font-code text-code px-2 py-1 border border-tertiary text-tertiary">Rust</span>
                <span class="font-code text-code px-2 py-1 border border-tertiary text-tertiary">Linux Kernel</span>
              </div>
            </div>
          </div>

          <!-- Terminal Output Card -->
          <div class="md:col-span-12 border border-outline bg-[#1A1A1A] p-0">
            <div class="bg-primary text-on-primary font-code text-code px-4 py-2 border-b border-outline flex justify-between">
              <span>bash - 80x24</span>
              <span>_ </span>
            </div>
            <div class="p-4 font-code text-code text-on-surface-variant flex flex-col gap-2 h-48 overflow-y-auto">
              <div class="flex gap-4">
                <span class="text-tertiary select-none">1</span>
                <span class="text-primary">$ ./compile_career.sh</span>
              </div>
              <div class="flex gap-4">
                <span class="text-tertiary select-none">2</span>
                <span>[INFO] Loading dependencies... OK</span>
              </div>
              <div class="flex gap-4">
                <span class="text-tertiary select-none">3</span>
                <span>[INFO] B.S. Electrical &amp; Computer Engineering... VERIFIED</span>
              </div>
              <div class="flex gap-4">
                <span class="text-tertiary select-none">4</span>
                <span>[INFO] 5+ Years Industry Experience... VERIFIED</span>
              </div>
              <div class="flex gap-4">
                <span class="text-tertiary select-none">5</span>
                <span class="text-error">[WARN] Coffee levels critical. Suggest immediate refuel.</span>
              </div>
              <div class="flex gap-4">
                <span class="text-tertiary select-none">6</span>
                <span class="text-primary blinking-cursor">$ </span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
</script>
