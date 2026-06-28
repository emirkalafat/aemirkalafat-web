<template>
  <div class="flex-1 flex flex-col">
    <PageHeader :title="post?.title ?? 'SYS_LOGS'">
      <template #filters>
        <div v-if="post" class="flex flex-wrap gap-3 font-code text-code">
          <span class="border border-tertiary text-tertiary px-2 py-0.5 uppercase">[{{ post.category }}]</span>
          <span class="text-on-surface-variant">{{ post.date }}</span>
          <span class="text-on-surface-variant">READ_TIME: {{ post.readTime }}</span>
          <span class="text-on-surface-variant">SYS_LOG: {{ post.id }}</span>
        </div>
      </template>
    </PageHeader>

    <section class="flex-1 p-margin-mobile lg:p-margin-desktop bg-surface-container-lowest">
      <!-- Not found -->
      <div v-if="!post" class="border border-primary bg-surface p-8 text-center">
        <p class="font-code text-body-md text-on-surface-variant">[LOG_NOT_FOUND]</p>
      </div>

      <template v-else>
        <article class="max-w-4xl">

          <!-- Hero image -->
          <div v-if="post.imageUrl" class="border border-primary mb-10 overflow-hidden">
            <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase flex justify-between">
              <span>FIG_1: VISUAL_DATA</span>
              <span class="material-symbols-outlined text-[16px]">fullscreen</span>
            </div>
            <img
              :src="post.imageUrl"
              :alt="post.title"
              class="w-full object-cover max-h-96 hover:scale-105 transition-transform duration-700"
            />
          </div>

          <!-- Markdown Content -->
          <div class="flex flex-col gap-8">
            <div class="prose prose-invert max-w-none space-y-6 text-on-surface">
              <MarkdownRenderer :markdown="post.markdown" />
            </div>
          </div>

          <!-- Related posts -->
          <div v-if="relatedPosts.length" class="mt-16 pt-8 border-t-2 border-primary">
            <h2 class="font-headline-md text-headline-md text-on-surface uppercase mb-8 flex items-center gap-3">
              <span class="material-symbols-outlined text-tertiary">link</span>
              RELATED_LOGS
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <RouterLink
                v-for="rel in relatedPosts"
                :key="rel.id"
                :to="`/blog/${rel.id}`"
                class="group border border-primary bg-surface-container-lowest hover:border-tertiary transition-colors flex flex-col"
              >
                <div class="bg-primary px-4 py-2 font-code text-label-md text-on-primary uppercase flex justify-between">
                  <span>[{{ rel.category }}]</span>
                  <span>{{ rel.id }}</span>
                </div>
                <div class="p-6 flex-1 flex flex-col gap-3">
                  <h3 class="font-headline-md text-on-surface group-hover:text-tertiary transition-colors uppercase leading-tight" style="font-size: 1.1rem;">{{ rel.title }}</h3>
                  <p class="text-body-md font-body-md text-on-surface-variant line-clamp-2 flex-1">{{ rel.description }}</p>
                  <div class="font-code text-code text-tertiary flex items-center gap-1 mt-auto">
                    READ_LOG
                    <span class="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>

        </article>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/ui/PageHeader.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { useBlog } from '@/composables/useBlog'

const route = useRoute()
const blog = useBlog()
const post = computed(() => blog.items.value.find(p => p.id === route.params.id))

const relatedPosts = computed(() => {
  if (!post.value?.relatedIds) return []
  return post.value.relatedIds
    .map(id => blog.items.value.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p != null)
})
</script>
