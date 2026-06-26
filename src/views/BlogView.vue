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
            <span class="text-background text-label-md font-code">INIT: {{ featuredPost.date }}</span>
          </div>
          <div class="flex flex-col md:flex-row flex-1 z-10 relative">
            <div class="w-full md:w-1/2 h-64 md:h-auto border-r border-on-surface bg-surface-container relative overflow-hidden">
              <img
                :src="featuredPost.imageUrl"
                :alt="featuredPost.title"
                class="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div class="absolute bottom-4 right-4 border border-tertiary bg-background/80 p-2 hidden group-hover:block text-tertiary font-code text-xs">
                IMG_RDY: TRUE
              </div>
            </div>
            <div class="p-6 flex flex-col justify-between flex-1">
              <div>
                <div class="flex gap-2 mb-4">
                  <span class="border border-tertiary text-tertiary px-2 py-0.5 text-xs font-code">[{{ featuredPost.category }}]</span>
                  <span class="border border-outline text-outline px-2 py-0.5 text-xs font-code">READ_TIME: {{ featuredPost.readTime }}</span>
                </div>
                <h3 class="text-headline-lg-mobile md:text-headline-md font-headline-md text-on-surface mb-4 leading-tight">
                  {{ featuredPost.title }}
                </h3>
                <p class="text-body-md font-body-md text-on-surface-variant mb-6 line-clamp-3">
                  {{ featuredPost.description }}
                </p>
              </div>
              <div class="mt-auto">
                <RouterLink :to="`/blog/${featuredPost.id}`" class="inline-flex items-center gap-2 text-tertiary font-code text-label-md uppercase hover:underline">
                  EXECUTE_READ <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                </RouterLink>
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
          <RouterLink :to="`/blog/${post.id}`" class="font-headline-md text-on-surface mb-3 text-xl group-hover:text-tertiary transition-colors leading-tight">{{ post.title }}</RouterLink>
          <p class="text-body-md font-body-md text-on-surface-variant mb-6 line-clamp-4 flex-1">{{ post.description }}</p>
          <div class="flex justify-between items-center border-t border-surface-container-highest pt-4 mt-auto">
            <span class="text-outline font-code text-xs">RT: {{ post.readTime }}</span>
            <RouterLink :to="`/blog/${post.id}`" class="text-on-surface hover:text-tertiary font-code text-sm uppercase">READ_MORE</RouterLink>
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
            <RouterLink :to="`/blog/${widePost.id}`" class="font-headline-md text-on-surface mb-2 text-2xl group-hover:text-tertiary transition-colors">{{ widePost.title }}</RouterLink>
            <p class="text-body-md font-body-md text-on-surface-variant mb-4">{{ widePost.description }}</p>
            <RouterLink :to="`/blog/${widePost.id}`" class="text-on-surface hover:text-tertiary font-code text-sm uppercase mt-2 w-max inline-flex items-center gap-1">
              &gt; EXECUTE_READ
            </RouterLink>
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
import { blogPosts, type BlogPost } from '@/data/blog'

type FilterType = null | 'DEV' | 'E-ENG' | 'THEORY'

const activeFilter = ref<FilterType>(null)
const searchQuery = ref('')

const featuredPost = blogPosts.find(p => p.isFeatured) as BlogPost
const regularPosts = blogPosts.filter(p => !p.isFeatured && !p.isWide)
const widePost = blogPosts.find(p => p.isWide) as BlogPost

const matchesQuery = (post: BlogPost) => {
  const q = searchQuery.value.toLowerCase()
  return !q || post.title.toLowerCase().includes(q) || post.description.toLowerCase().includes(q)
}

const matchesCategory = (post: BlogPost) => {
  return activeFilter.value === null || post.category === activeFilter.value
}

const showFeatured = computed(() => matchesCategory(featuredPost) && matchesQuery(featuredPost))

const filteredRegularPosts = computed(() => {
  return regularPosts.filter(p => matchesCategory(p) && matchesQuery(p))
})

const showWidePost = computed(() => {
  return matchesCategory(widePost) && matchesQuery(widePost)
})
</script>
