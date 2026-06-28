<template>
  <div class="flex flex-col gap-4">
    <!-- Toolbar -->
    <div class="flex gap-2 flex-wrap border border-on-surface bg-surface-container-low p-3">
      <button @click="insertMarkdown('# ', '\n')" class="px-3 py-1 bg-on-surface text-surface text-xs font-code uppercase hover:bg-tertiary transition-colors">H1</button>
      <button @click="insertMarkdown('## ', '\n')" class="px-3 py-1 bg-on-surface text-surface text-xs font-code uppercase hover:bg-tertiary transition-colors">H2</button>
      <button @click="insertMarkdown('**', '**')" class="px-3 py-1 bg-on-surface text-surface text-xs font-code uppercase hover:bg-tertiary transition-colors">Bold</button>
      <button @click="insertMarkdown('_', '_')" class="px-3 py-1 bg-on-surface text-surface text-xs font-code uppercase hover:bg-tertiary transition-colors">Italic</button>
      <button @click="insertMarkdown('`', '`')" class="px-3 py-1 bg-on-surface text-surface text-xs font-code uppercase hover:bg-tertiary transition-colors">Code</button>
      <button @click="insertMarkdown('```\n', '\n```')" class="px-3 py-1 bg-on-surface text-surface text-xs font-code uppercase hover:bg-tertiary transition-colors">Block</button>
      <button @click="insertMarkdown('- ', '\n')" class="px-3 py-1 bg-on-surface text-surface text-xs font-code uppercase hover:bg-tertiary transition-colors">List</button>
      <button @click="insertMarkdown('[', '](url)')" class="px-3 py-1 bg-on-surface text-surface text-xs font-code uppercase hover:bg-tertiary transition-colors">Link</button>
      <button @click="insertMarkdown('![alt](', ')')" class="px-3 py-1 bg-on-surface text-surface text-xs font-code uppercase hover:bg-tertiary transition-colors">Image</button>
    </div>

    <!-- Editor + Preview -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[500px]">
      <!-- Editor -->
      <div class="border border-on-surface bg-surface-dim flex flex-col">
        <div class="bg-on-surface text-surface px-4 py-2 font-code text-xs uppercase">Markdown Input</div>
        <textarea
          ref="editorRef"
          :value="modelValue ?? ''"
          @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
          placeholder="Write your markdown here...

# Heading 1
## Heading 2

**Bold text** and _italic text_

\`inline code\`

\`\`\`javascript
// Code block
const hello = 'world';
\`\`\`

- List item 1
- List item 2

[Link text](https://example.com)

![Alt text](image-url.jpg)"
          class="flex-1 bg-surface-dim text-on-surface font-code text-sm p-4 outline-none focus:ring-1 focus:ring-tertiary resize-none"
        />
      </div>

      <!-- Preview -->
      <div class="border border-on-surface bg-surface-dim flex flex-col overflow-hidden">
        <div class="bg-on-surface text-surface px-4 py-2 font-code text-xs uppercase">Preview</div>
        <div class="flex-1 overflow-y-auto p-4 prose prose-invert max-w-none">
          <MarkdownRenderer :markdown="modelValue" />
        </div>
      </div>
    </div>

    <!-- Character Count -->
    <div class="text-xs font-code text-on-surface-variant">{{ modelValue?.length ?? 0 }} characters</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MarkdownRenderer from './MarkdownRenderer.vue'

interface Props {
  modelValue: string
}

defineProps<Props>()

const editorRef = ref<HTMLTextAreaElement>()

function insertMarkdown(before: string, after: string) {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selected = text.substring(start, end)

  const newText = text.substring(0, start) + before + selected + after + text.substring(end)

  emit('update:modelValue', newText)

  // Restore cursor position
  setTimeout(() => {
    if (textarea) {
      textarea.selectionStart = start + before.length
      textarea.selectionEnd = start + before.length + selected.length
      textarea.focus()
    }
  }, 0)
}

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
