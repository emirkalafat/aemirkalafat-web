<template>
  <div class="prose prose-invert max-w-none space-y-6 text-on-surface">
    <div v-html="renderedHtml" class="markdown-content"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

interface Props {
  markdown?: string
}

const props = defineProps<Props>()

marked.setOptions({
  breaks: true,
  gfm: true,
})

marked.use({
  renderer: {
    heading(args: any) {
      const { text, depth } = args
      const id = text.toLowerCase().replace(/\s+/g, '-')
      return `<h${depth} id="${id}" class="font-headline-${depth === 1 ? 'lg' : depth === 2 ? 'md' : 'sm'} text-headline-${depth === 1 ? 'lg-mobile' : depth === 2 ? 'md' : 'sm'} font-bold text-on-surface mt-8 mb-4 uppercase tracking-tight">${text}</h${depth}>`
    },
    paragraph(args: any) {
      const { text } = args
      return `<p class="text-body-md font-body-md text-on-surface leading-relaxed">${text}</p>`
    },
    code(args: any) {
      const { text, language } = args
      const lang = language || 'plaintext'
      let highlighted = text
      try {
        highlighted = hljs.highlight(text, { language: lang }).value
      } catch {
        highlighted = hljs.highlight(text, { language: 'plaintext' }).value
      }
      return `<div class="bg-surface-dim border border-on-surface my-4 rounded-sm overflow-x-auto">
        <div class="bg-on-surface text-surface px-4 py-2 font-code text-xs uppercase">${lang}</div>
        <pre class="p-4 font-code text-sm leading-relaxed"><code class="language-${lang}">${highlighted}</code></pre>
      </div>`
    },
    codespan(args: any) {
      const { text } = args
      return `<code class="bg-surface-dim text-tertiary font-code text-sm px-2 py-1 rounded-sm">${text}</code>`
    },
    blockquote(args: any) {
      const { text } = args
      return `<blockquote class="border-l-4 border-tertiary pl-4 py-2 italic text-on-surface-variant">${text}</blockquote>`
    },
    list(args: any) {
      const { items, ordered } = args
      const tag = ordered ? 'ol' : 'ul'
      const listClass = ordered ? 'list-decimal' : 'list-disc'
      return `<${tag} class="${listClass} list-inside space-y-2 text-body-md font-body-md text-on-surface ml-4">${items.join('')}</${tag}>`
    },
    listitem(args: any) {
      const { text } = args
      return `<li>${text}</li>`
    },
    image(args: any) {
      const { href, text, title } = args
      return `<img src="${href}" alt="${text}" title="${title}" class="my-6 max-w-full h-auto border border-on-surface rounded-sm" />`
    },
    link(args: any) {
      const { href, text, title } = args
      return `<a href="${href}" title="${title}" class="text-tertiary hover:text-primary underline transition-colors">${text}</a>`
    },
    hr() {
      return `<hr class="my-8 border-t border-on-surface/30" />`
    },
    table(args: any) {
      const { header, rows } = args
      return `<div class="overflow-x-auto my-6">
        <table class="w-full border border-on-surface">
          <thead class="bg-on-surface text-surface">${header}</thead>
          <tbody class="divide-y divide-on-surface">${rows.join('')}</tbody>
        </table>
      </div>`
    },
    tablerow(args: any) {
      const { text } = args
      return `<tr>${text}</tr>`
    },
    tablecell(args: any) {
      const { text, flags } = args
      const tag = flags.header ? 'th' : 'td'
      const align = flags.align ? `text-${flags.align}` : ''
      return `<${tag} class="p-3 ${align}">${text}</${tag}>`
    },
  },
})

const renderedHtml = computed(() => {
  if (!props.markdown) return ''
  try {
    return marked(props.markdown) as string
  } catch (e) {
    console.error('Markdown rendering error:', e)
    return '<p class="text-error">Error rendering markdown</p>'
  }
})
</script>

<style scoped>
:deep(.markdown-content) {
  /* Base typography already applied via Tailwind classes in renderer */
}

:deep(.markdown-content h1),
:deep(.markdown-content h2),
:deep(.markdown-content h3) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

:deep(.markdown-content p) {
  margin-bottom: 1em;
}

:deep(.markdown-content code) {
  font-variant-ligatures: none;
}

:deep(.markdown-content pre) {
  overflow-x: auto;
}

:deep(.hljs) {
  background: transparent;
  color: inherit;
}
</style>
