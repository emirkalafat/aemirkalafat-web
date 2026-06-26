<template>
  <div class="flex-1 flex flex-col">
    <PageHeader
      title="LOG_ENTRIES"
      description="System architecture analysis, embedded hardware experiments, and computational theory. Parsing reality through boolean logic."
    >
      <template #filters>
        <div class="flex flex-wrap gap-4 items-center font-code text-label-md">
          <button
            @click="activeFilter = null"
            :class="[
              'border border-primary text-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase',
              { 'bg-tertiary text-on-tertiary border-tertiary': activeFilter === null }
            ]"
          >[*] ALL</button>
          <button
            @click="activeFilter = 'DEV'"
            :class="[
              'border border-primary text-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase',
              { 'bg-tertiary text-on-tertiary border-tertiary': activeFilter === 'DEV' }
            ]"
          >[DEV]</button>
          <button
            @click="activeFilter = 'E-ENG'"
            :class="[
              'border border-primary text-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase',
              { 'bg-tertiary text-on-tertiary border-tertiary': activeFilter === 'E-ENG' }
            ]"
          >[E-ENG]</button>
          <button
            @click="activeFilter = 'THEORY'"
            :class="[
              'border border-primary text-primary px-4 py-2 hover:bg-surface-variant transition-colors uppercase',
              { 'bg-tertiary text-on-tertiary border-tertiary': activeFilter === 'THEORY' }
            ]"
          >[THEORY]</button>
          <div class="ml-auto w-full md:w-auto mt-4 md:mt-0 flex border border-primary bg-background focus-within:border-tertiary transition-colors">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="QUERY_LOGS..."
              class="bg-transparent border-none text-on-surface text-body-md font-code py-2 px-3 focus:ring-0 w-full md:w-64 outline-none"
            />
            <button class="px-3 text-primary hover:text-tertiary transition-colors border-l border-primary">
              <span class="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
      </template>
    </PageHeader>

    <!-- Blog Grid -->
    <section class="flex-1 p-margin-mobile lg:p-margin-desktop bg-surface-container-lowest">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">

        <!-- Featured Post -->
        <article
          v-if="showFeatured"
          class="md:col-span-12 lg:col-span-8 border border-on-surface bg-surface-container-lowest flex flex-col neo-hover-glow relative group overflow-hidden"
        >
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"
            style="background-image: radial-gradient(circle, rgba(76,214,255,0.05) 1px, transparent 1px); background-size: 20px 20px;"></div>
          <div class="border-b border-on-surface bg-on-surface px-4 py-2 flex justify-between items-center z-10 relative">
            <span class="text-background text-label-md font-code font-bold uppercase tracking-widest">SYSTEM_CRITICAL</span>
            <span class="text-background text-label-md font-code">INIT: 2024.10.24</span>
          </div>
          <div class="flex flex-col md:flex-row flex-1 z-10 relative">
            <div class="w-full md:w-1/2 h-64 md:h-auto border-r border-on-surface bg-surface-container relative overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsWkb91Ar7NWRDrruAC5VRebqB2vI-BOrDNmo144NygegbcSPZJuj2BsHrVTeEj-X9phaF_4KBVtAf0r8Hlus5GzcEou8sbrPFmzLHm2tQKYKRIAsaS8KG39AtBRxfygAjvXDcbdYZDrLOIw-TyGzt00fRv0pGAmJBwnlCwVS8q_P6P6IKEhPufLnhsZHL8WqegbtuP6sRnA3UPYyjQ_8lrYDW-aorhuYqFH7kYRGILY_KU9mhIObYbSe-s0QIKvSW3TY"
                alt="Silicon wafer circuit board"
                class="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div class="absolute bottom-4 right-4 border border-tertiary bg-background/80 p-2 hidden group-hover:block text-tertiary font-code text-xs">
                IMG_RDY: TRUE
              </div>
            </div>
            <div class="p-6 flex flex-col justify-between flex-1">
              <div>
                <div class="flex gap-2 mb-4">
                  <span class="border border-tertiary text-tertiary px-2 py-0.5 text-xs font-code">[E-ENG]</span>
                  <span class="border border-outline text-outline px-2 py-0.5 text-xs font-code">READ_TIME: 14m</span>
                </div>
                <h3 class="text-headline-lg-mobile md:text-headline-md font-headline-md text-on-surface mb-4 leading-tight">
                  Reverse Engineering the ARM Cortex-M4 Architecture
                </h3>
                <p class="text-body-md font-body-md text-on-surface-variant mb-6 line-clamp-3">
                  A deep dive into bypassing JTAG protection mechanisms on consumer IoT devices using voltage glitching and differential power analysis. We explore the structural vulnerabilities inherent in low-cost MCU implementations.
                </p>
              </div>
              <div class="mt-auto">
                <a href="#" class="inline-flex items-center gap-2 text-tertiary font-code text-label-md uppercase hover:underline">
                  EXECUTE_READ <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </article>

        <!-- Sidebar Stats -->
        <aside v-if="showFeatured" class="md:col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          <div class="border border-on-surface bg-surface-container-lowest p-6 h-full flex flex-col" style="transition: all 0.2s ease-in-out;">
            <div class="border-b border-outline pb-4 mb-4">
              <h4 class="text-label-md font-code text-on-surface uppercase tracking-widest flex items-center gap-2">
                <span class="material-symbols-outlined text-tertiary">memory</span>
                SYSTEM_STATS
              </h4>
            </div>
            <ul class="space-y-3 font-code text-sm text-on-surface-variant flex-1">
              <li class="flex justify-between border-b border-surface-container-high pb-2">
                <span>TOTAL_LOGS:</span> <span class="text-on-surface">1,024</span>
              </li>
              <li class="flex justify-between border-b border-surface-container-high pb-2">
                <span>UPTIME:</span> <span class="text-on-surface">99.99%</span>
              </li>
              <li class="flex justify-between border-b border-surface-container-high pb-2">
                <span>KERNEL_V:</span> <span class="text-on-surface">6.5.0-generic</span>
              </li>
              <li class="flex justify-between border-b border-surface-container-high pb-2">
                <span>LATEST_COM:</span> <span class="text-on-surface">0x4F2A</span>
              </li>
            </ul>
            <div class="mt-6 bg-[#1A1A1A] border border-outline p-4 font-code text-xs text-tertiary overflow-hidden">
              <div class="animate-pulse">
                &gt; ping 127.0.0.1<br/>
                &gt; 64 bytes from 127.0.0.1: icmp_seq=1 ttl=64<br/>
                &gt; System nominally stable.
              </div>
            </div>
          </div>
        </aside>

        <!-- Standard Post Cards -->
        <article
          v-for="post in filteredRegularPosts"
          :key="post.id"
          class="md:col-span-6 lg:col-span-4 border border-outline bg-surface-container-lowest p-6 flex flex-col neo-hover-glow relative group h-full"
        >
          <div class="flex justify-between items-start mb-6">
            <span class="border border-outline text-on-surface px-2 py-0.5 text-xs font-code group-hover:border-tertiary group-hover:text-tertiary transition-colors">[{{ post.category }}]</span>
            <span class="text-outline font-code text-xs">{{ post.date }}</span>
          </div>
          <h3 class="font-headline-md text-on-surface mb-3 text-xl group-hover:text-tertiary transition-colors leading-tight">{{ post.title }}</h3>
          <p class="text-body-md font-body-md text-on-surface-variant mb-6 line-clamp-4 flex-1">{{ post.description }}</p>
          <div class="flex justify-between items-center border-t border-surface-container-highest pt-4 mt-auto">
            <span class="text-outline font-code text-xs">RT: {{ post.readTime }}</span>
            <a href="#" class="text-on-surface hover:text-tertiary font-code text-sm uppercase">READ_MORE</a>
          </div>
        </article>

        <!-- Wide Post -->
        <article
          v-if="showWidePost"
          class="col-span-1 md:col-span-12 border border-outline bg-surface-container-lowest p-6 flex flex-col md:flex-row gap-6 neo-hover-glow relative group"
        >
          <div class="flex flex-col md:w-1/4 shrink-0 border-r-0 md:border-r border-outline md:pr-6 gap-2">
            <span class="text-outline font-code text-sm">TIMESTAMP: {{ widePost.date }}</span>
            <span class="border border-outline text-on-surface px-2 py-0.5 text-xs font-code w-max group-hover:border-tertiary group-hover:text-tertiary transition-colors">[{{ widePost.category }}]</span>
            <span class="text-outline font-code text-xs mt-auto hidden md:block">RT: {{ widePost.readTime }}</span>
          </div>
          <div class="flex flex-col flex-1 justify-center">
            <h3 class="font-headline-md text-on-surface mb-2 text-2xl group-hover:text-tertiary transition-colors">{{ widePost.title }}</h3>
            <p class="text-body-md font-body-md text-on-surface-variant mb-4">{{ widePost.description }}</p>
            <a href="#" class="text-on-surface hover:text-tertiary font-code text-sm uppercase mt-2 w-max inline-flex items-center gap-1">
              &gt; EXECUTE_READ
            </a>
          </div>
        </article>

        <!-- Empty state -->
        <div
          v-if="filteredRegularPosts.length === 0 && !showFeatured && !showWidePost"
          class="col-span-1 md:col-span-12 border border-primary bg-surface p-8 text-center"
        >
          <p class="text-body-md font-code text-on-surface-variant">[NO_RECORDS_FOUND]</p>
        </div>
      </div>

      <!-- Load More -->
      <div class="mt-12 flex justify-center border-t border-primary pt-8 pb-4">
        <button class="border border-on-surface bg-background px-8 py-3 text-label-md font-code text-on-surface hover:bg-on-surface hover:text-background transition-colors neo-hover-glow tracking-widest">
          LOAD_MORE_RECORDS
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from '@/components/ui/PageHeader.vue'

type CategoryType = 'DEV' | 'E-ENG' | 'THEORY'
type FilterType = null | CategoryType

const activeFilter = ref<FilterType>(null)
const searchQuery = ref('')

interface BlogPost {
  id: string
  category: CategoryType
  date: string
  readTime: string
  title: string
  description: string
}

const regularPosts: BlogPost[] = [
  {
    id: 'LOG-001',
    category: 'DEV',
    date: '2024.10.15',
    readTime: '8m',
    title: 'Optimizing Rust Compiles for Embedded Systems',
    description: 'Stripping binary bloat and leveraging link-time optimization (LTO) to squeeze massive Rust binaries onto microcontrollers with less than 64KB of flash memory.',
  },
  {
    id: 'LOG-002',
    category: 'THEORY',
    date: '2024.09.28',
    readTime: '22m',
    title: 'Non-Euclidean Data Structures in Spatial Computing',
    description: 'An algorithmic approach to mapping complex topologies without relying on standard Cartesian grids. Implications for rendering engines and collision detection in VR environments.',
  },
  {
    id: 'LOG-003',
    category: 'E-ENG',
    date: '2024.09.12',
    readTime: '11m',
    title: 'Acoustic Metamaterials & Signal Dampening',
    description: 'Designing physical structures that manipulate sound waves below sub-wavelength frequencies. Applications in EMI shielding for high-density PCB layouts.',
  },
  {
    id: 'LOG-004',
    category: 'DEV',
    date: '2024.07.20',
    readTime: '13m',
    title: 'Zero-Copy Networking in Linux Kernel Space',
    description: 'Bypassing userspace overhead with io_uring and AF_XDP to build high-frequency data pipelines that route packets at near-wire speed without CPU bottlenecks.',
  },
  {
    id: 'LOG-005',
    category: 'THEORY',
    date: '2024.06.05',
    readTime: '17m',
    title: 'Type Theory Applied to Hardware Description Languages',
    description: 'Exploring how dependent types from Idris and Agda can be applied to VHDL and Verilog to prove circuit correctness at compile time before FPGA synthesis.',
  },
]

const widePost: BlogPost = {
  id: 'LOG-WIDE-001',
  category: 'DEV',
  date: '2024.08.30_14:22:00',
  readTime: '6m',
  title: 'Building a Custom RTOS from Scratch',
  description: 'Why rely on FreeRTOS when you can build your own preemptive scheduler? A step-by-step guide to context switching, managing stack frames, and implementing basic mutexes on an ATmega328P.',
}

const matchesQuery = (post: BlogPost) => {
  const q = searchQuery.value.toLowerCase()
  return !q || post.title.toLowerCase().includes(q) || post.description.toLowerCase().includes(q)
}

const matchesCategory = (post: BlogPost) => {
  return activeFilter.value === null || post.category === activeFilter.value
}

const showFeatured = computed(() => {
  if (activeFilter.value !== null && activeFilter.value !== 'E-ENG') return false
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    return 'reverse engineering arm cortex'.includes(q) || 'jtag'.includes(q)
  }
  return true
})

const filteredRegularPosts = computed(() => {
  return regularPosts.filter(p => matchesCategory(p) && matchesQuery(p))
})

const showWidePost = computed(() => {
  return matchesCategory(widePost) && matchesQuery(widePost)
})
</script>
