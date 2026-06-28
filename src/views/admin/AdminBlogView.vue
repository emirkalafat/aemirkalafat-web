<template>
  <div class="p-gutter md:p-margin-desktop flex gap-gutter min-h-[calc(100vh-80px)]">
    <!-- Left: Posts List -->
    <div class="flex-1 md:max-w-sm border border-on-surface bg-surface-container-lowest flex flex-col">
      <div class="bg-on-surface text-surface px-4 py-3 border-b border-on-surface flex justify-between items-center font-label-md">
        <span>INDEX // POSTS</span>
        <button @click="newPost" class="hover:text-tertiary transition-colors">
          <span class="material-symbols-outlined">add_box</span>
        </button>
      </div>
      <input
        v-model="searchQuery"
        placeholder="grep 'title'..."
        class="p-2 border-b border-on-surface bg-surface-dim font-code text-code text-on-surface focus:outline-none focus:ring-0 px-2 py-2"
      />
      <div class="flex-1 overflow-y-auto flex flex-col">
        <div
          v-for="post in filteredPosts"
          :key="post.id"
          @click="selectPost(post)"
          :class="[
            'p-4 border-b border-on-surface border-l-4 cursor-pointer transition-colors',
            selectedPost?.id === post.id ? 'border-l-tertiary bg-surface-container' : 'border-l-transparent hover:bg-surface-container',
          ]"
        >
          <h3 class="font-code text-code text-tertiary mb-2 line-clamp-2 leading-tight">&gt; {{ post.title }}</h3>
          <div class="flex justify-between items-end">
            <span class="border border-tertiary text-tertiary px-1.5 py-0.5 text-xs font-code uppercase">{{ post.category }}</span>
            <span class="text-xs font-code text-on-surface-variant">{{ post.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Editor -->
    <div class="flex-1 flex flex-col gap-gutter min-h-[calc(100vh-80px)] overflow-y-auto pb-8">
      <div v-if="selectedPost" class="space-y-gutter">
        <!-- Meta Fields -->
        <div class="grid grid-cols-2 gap-gutter">
          <div class="col-span-2 border border-on-surface p-6 flex flex-col justify-end relative bg-surface-dim">
            <label class="font-code text-xs text-on-surface-variant uppercase absolute top-4 left-6">TITLE</label>
            <input
              v-model="selectedPost.title"
              class="w-full bg-transparent border-none border-b-2 border-on-surface focus:border-tertiary text-headline-md font-headline-md text-on-surface px-0 py-2 focus:ring-0 mt-6 outline-none"
            />
          </div>

          <div class="border border-on-surface p-6 flex flex-col gap-6 bg-surface-dim">
            <div class="flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">CATEGORY</label>
              <select v-model="selectedPost.category" class="bg-transparent border-b border-on-surface text-code font-code text-on-surface focus:ring-0 focus:border-tertiary px-0 py-2 cursor-pointer outline-none">
                <option value="DEV">DEV</option>
                <option value="E-ENG">E-ENG</option>
                <option value="THEORY">THEORY</option>
              </select>
            </div>
          </div>

          <div class="border border-on-surface p-6 flex flex-col gap-6 bg-surface-dim">
            <div class="flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">DATE</label>
              <input
                v-model="selectedPost.date"
                type="text"
                placeholder="2024.10.24"
                class="bg-transparent border-b border-on-surface text-code font-code text-on-surface focus:ring-0 focus:border-tertiary px-0 py-2 outline-none"
              />
            </div>
          </div>

          <div class="col-span-2 border border-on-surface p-6 flex flex-col gap-6 bg-surface-dim">
            <div class="flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">DESCRIPTION</label>
              <textarea
                v-model="selectedPost.description"
                class="w-full bg-transparent border-b border-on-surface focus:border-tertiary text-code font-code text-on-surface focus:ring-0 px-0 py-2 resize-none outline-none"
                rows="3"
              />
            </div>
          </div>
        </div>

        <!-- Markdown Editor -->
        <div class="border border-on-surface p-6 bg-surface-dim flex flex-col gap-4">
          <label class="font-code text-xs text-on-surface-variant uppercase">CONTENT (MARKDOWN)</label>
          <MarkdownEditor v-model="selectedPost.markdown" @update:model-value="selectedPost.markdown = $event" />
        </div>

        <!-- Buttons -->
        <div class="flex gap-4">
          <button
            @click="savePost"
            :disabled="blog.loading.value"
            class="flex-1 bg-on-surface text-surface py-3 font-label-md px-6 uppercase tracking-widest border border-on-surface hover:bg-tertiary hover:border-tertiary transition-colors disabled:opacity-50"
          >
            {{ blog.loading.value ? 'SAVING...' : 'SAVE' }}
          </button>
          <button
            @click="deletePost"
            :disabled="!selectedPost || blog.loading.value"
            class="bg-error text-on-error py-3 font-label-md px-6 uppercase tracking-widest border border-error hover:bg-error-container transition-colors disabled:opacity-50"
          >
            DELETE
          </button>
        </div>
      </div>
      <div v-else class="flex items-center justify-center flex-1 text-on-surface-variant font-code">
        Select a post or create a new one
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBlog } from '@/composables/useBlog'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import type { BlogPost } from '@/data/blog'

const blog = useBlog()
const searchQuery = ref('')
const selectedPost = ref<(BlogPost & { markdown: string }) | null>(null)

const filteredPosts = computed(() => {
  return blog.items.value.filter(
    p => p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

function selectPost(post: BlogPost) {
  selectedPost.value = { ...post, markdown: post.markdown || '' }
}

function newPost() {
  selectedPost.value = {
    id: `LOG-${Date.now()}`,
    category: 'DEV' as const,
    date: new Date().toISOString().split('T')[0],
    readTime: '5m',
    title: 'New Post',
    description: '',
    imageUrl: '',
    markdown: '',
  } as BlogPost & { markdown: string }
}

async function savePost() {
  if (!selectedPost.value) return
  try {
    const existing = blog.items.value.find(p => p.id === selectedPost.value!.id)
    if (existing) {
      await blog.update(selectedPost.value.id, selectedPost.value)
    } else {
      await blog.add(selectedPost.value)
    }
    selectedPost.value = null
  } catch (e) {
    console.error('Save failed:', e)
  }
}

async function deletePost() {
  if (!selectedPost.value) return
  if (confirm('Delete this post?')) {
    try {
      await blog.del(selectedPost.value.id)
      selectedPost.value = null
    } catch (e) {
      console.error('Delete failed:', e)
    }
  }
}
</script>
