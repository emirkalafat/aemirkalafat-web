<template>
  <div class="flex h-full bg-surface">
    <!-- Left: Posts List -->
    <div class="flex-1 md:max-w-sm border-r border-on-surface bg-surface-dim flex flex-col">
      <div class="px-4 py-4 border-b border-on-surface">
        <h2 class="font-code text-on-surface font-bold uppercase text-sm mb-4">INDEX // POSTS</h2>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search title or ID"
          class="w-full bg-surface border-b border-on-surface text-on-surface font-code text-sm px-2 py-2 outline-none focus:border-tertiary mb-3"
        />
        <label class="font-code text-xs text-on-surface-variant uppercase block mb-1">FEATURED</label>
        <select
          v-model="featuredPostId"
          @change="setFeaturedPost"
          class="w-full bg-surface border-b border-on-surface text-on-surface font-code text-sm px-2 py-2 cursor-pointer outline-none focus:border-tertiary"
        >
          <option value="">None</option>
          <option v-for="post in blog.items.value" :key="post.id" :value="post.id">
            {{ post.title.slice(0, 30) }}{{ post.title.length > 30 ? '...' : '' }}
          </option>
        </select>
      </div>
      <div class="flex-1 overflow-y-auto flex flex-col">
        <div
          v-for="post in filteredPosts"
          :key="post.id"
          @click="selectPost(post)"
          :class="[
            'px-4 py-3 border-b border-on-surface/20 cursor-pointer transition-colors hover:bg-surface',
            selectedPost?.id === post.id ? 'bg-surface-container-highest' : 'bg-surface-dim'
          ]"
        >
          <div class="flex justify-between items-start gap-2">
            <div class="flex-1 min-w-0">
              <p class="font-code text-sm text-on-surface truncate font-bold">{{ post.title }}</p>
              <p class="font-code text-xs text-on-surface-variant uppercase">{{ post.category }}</p>
            </div>
            <span class="font-code text-xs text-tertiary whitespace-nowrap">{{ post.date }}</span>
          </div>
        </div>
      </div>
      <div class="border-t border-on-surface p-4">
        <button
          @click="newPost"
          class="w-full bg-on-surface text-surface border border-on-surface px-4 py-2 font-code font-bold uppercase text-sm hover:bg-tertiary hover:text-on-tertiary transition-colors flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-lg">add</span>
          <span>NEW</span>
        </button>
      </div>
    </div>

    <!-- Right: Editor -->
    <div class="flex-1 flex flex-col overflow-y-auto pb-8">
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
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
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

        <!-- Image Manager -->
        <div class="border border-on-surface bg-surface-dim">
          <div class="bg-on-surface text-surface px-4 py-2 font-code text-xs uppercase flex justify-between items-center">
            <span>IMAGE ASSETS // {{ selectedPost.id }}</span>
            <label class="cursor-pointer hover:text-tertiary transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-[18px]">upload</span>
              <span>UPLOAD</span>
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="handleFileUpload"
              />
            </label>
          </div>

          <!-- Upload progress -->
          <div v-if="uploadingFiles.length" class="px-4 py-3 border-b border-on-surface space-y-1">
            <div v-for="f in uploadingFiles" :key="f.name" class="flex items-center gap-2 font-code text-xs text-on-surface-variant">
              <span class="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
              <span>{{ f.name }}</span>
            </div>
          </div>

          <!-- File list -->
          <div v-if="postImages.length" class="divide-y divide-on-surface/30">
            <div
              v-for="img in postImages"
              :key="img.fullPath"
              class="px-4 py-3 flex items-center gap-3"
            >
              <img :src="img.url" class="w-12 h-12 object-cover border border-on-surface/30 shrink-0" />
              <div class="flex-1 min-w-0 flex flex-col gap-0.5">
                <span class="font-code text-xs text-on-surface truncate">{{ img.name }}</span>
                <span class="font-code text-[10px] text-on-surface-variant truncate">{{ img.url }}</span>
              </div>
              <div class="flex gap-2 shrink-0">
                <button
                  @click="copyUrl(img.url)"
                  :title="copiedUrl === img.url ? 'Copied!' : 'Copy URL'"
                  class="p-1 hover:text-tertiary transition-colors"
                >
                  <span class="material-symbols-outlined text-[18px]">{{ copiedUrl === img.url ? 'check' : 'content_copy' }}</span>
                </button>
                <button
                  @click="removeImage(img.fullPath)"
                  class="p-1 hover:text-error transition-colors"
                  title="Delete"
                >
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="!uploadingFiles.length && imagesLoaded" class="px-4 py-6 text-center font-code text-xs text-on-surface-variant">
            No images uploaded yet
          </div>

          <div v-if="!imagesLoaded" class="px-4 py-4 text-center font-code text-xs text-on-surface-variant">
            <span class="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
          </div>
        </div>

        <!-- Markdown Editor -->
        <div class="border border-on-surface p-6 bg-surface-dim flex flex-col gap-4">
          <label class="font-code text-xs text-on-surface-variant uppercase">CONTENT (MARKDOWN)</label>
          <MarkdownEditor v-model="selectedPost.markdown" />
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
import { ref, computed, watch } from 'vue'
import { useBlog } from '@/composables/useBlog'
import { useCategories } from '@/composables/useCategories'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import type { BlogPost } from '@/data/blog'
import { uploadFile, deleteFile, listFiles, type StorageFile } from '@/services/storage'

const blog = useBlog()
const { categories } = useCategories()
const searchQuery = ref('')
const selectedPost = ref<BlogPost | null>(null)
const fileInputRef = ref<HTMLInputElement>()
const featuredPostId = ref('')

const postImages = ref<StorageFile[]>([])
const imagesLoaded = ref(false)
const uploadingFiles = ref<{ name: string }[]>([])
const copiedUrl = ref<string | null>(null)

const filteredPosts = computed(() => {
  return blog.items.value.filter(
    p => p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

watch(
  () => blog.items.value,
  (posts) => {
    const featured = posts.find(p => p.isFeatured)
    featuredPostId.value = featured?.id ?? ''
  }
)

watch(selectedPost, async (post) => {
  postImages.value = []
  imagesLoaded.value = false
  if (!post) return
  try {
    postImages.value = await listFiles(`blog/${post.id}`)
  } catch {
    // folder doesn't exist yet — that's fine
  } finally {
    imagesLoaded.value = true
  }
})

function selectPost(post: BlogPost) {
  selectedPost.value = { ...post, markdown: post.markdown ?? '' }
}

function newPost() {
  selectedPost.value = {
    id: `LOG-${Date.now()}`,
    category: 'DEV' as const,
    date: new Date().toISOString().slice(0, 10),
    readTime: '5m',
    title: 'New Post',
    description: '',
    imageUrl: '',
    markdown: '',
  }
}

async function setFeaturedPost() {
  const updates = blog.items.value.map(post => ({
    id: post.id,
    isFeatured: post.id === featuredPostId.value ? true : false,
  }))

  await Promise.all(
    updates.map(update => blog.update(update.id, { isFeatured: update.isFeatured }))
  )
}

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length || !selectedPost.value) return

  const files = Array.from(input.files)
  uploadingFiles.value = files.map(f => ({ name: f.name }))

  await Promise.all(
    files.map(async file => {
      const path = `blog/${selectedPost.value!.id}/${Date.now()}_${file.name}`
      const url = await uploadFile(path, file)
      postImages.value.push({ name: file.name, fullPath: path, url })
    }),
  )

  uploadingFiles.value = []
  if (fileInputRef.value) fileInputRef.value.value = ''
}

async function removeImage(fullPath: string) {
  await deleteFile(fullPath)
  postImages.value = postImages.value.filter(img => img.fullPath !== fullPath)
}

function copyUrl(url: string) {
  navigator.clipboard.writeText(url)
  copiedUrl.value = url
  setTimeout(() => { copiedUrl.value = null }, 2000)
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
  if (confirm('Delete this post and all its images?')) {
    try {
      const postId = selectedPost.value.id

      // Delete all images in the post's folder
      try {
        const images = await listFiles(`blog/${postId}`)
        await Promise.all(images.map(img => deleteFile(img.fullPath)))
      } catch {
        // Folder doesn't exist or is already empty — that's fine
      }

      // Delete the post document
      await blog.del(postId)
      selectedPost.value = null
    } catch (e) {
      console.error('Delete failed:', e)
    }
  }
}
</script>
