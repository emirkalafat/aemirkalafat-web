<template>
  <div class="markdown-content" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

interface Props {
  markdown?: string
}

const props = defineProps<Props>()

// marked v12 renderer API is fully positional (not object-based).
// Signatures: https://marked.js.org/using_pro#renderer
marked.setOptions({
  breaks: true,
  gfm: true,
})

marked.use({
  renderer: {
    heading(text: string, level: number) {
      const id = text.toLowerCase().replace(/<[^>]+>/g, '').replace(/\s+/g, '-')
      const sizeMap: Record<number, string> = {
        1: 'text-2xl lg:text-3xl',
        2: 'text-xl lg:text-2xl',
        3: 'text-lg',
      }
      const sizeClass = sizeMap[level] ?? 'text-base'
      return `<h${level} id="${id}" class="${sizeClass} font-bold text-on-surface mt-8 mb-4 tracking-tight">${text}</h${level}>\n`
    },

    paragraph(text: string) {
      return `<p class="text-base font-body-md text-on-surface leading-[1.8] mb-4 first-of-type:text-lg first-of-type:font-semibold">${text}</p>\n`
    },

    code(code: string, infostring: string | undefined) {
      const lang = (infostring || 'plaintext').split(' ')[0]
      let highlighted = code
      try {
        highlighted = hljs.highlight(code, { language: lang }).value
      } catch {
        try {
          highlighted = hljs.highlight(code, { language: 'plaintext' }).value
        } catch {
          highlighted = code
        }
      }
      return `<div class="bg-surface-dim border border-on-surface my-6 overflow-x-auto">
<div class="bg-on-surface text-surface px-4 py-2 font-code text-xs uppercase">${lang}</div>
<pre class="p-4 font-code text-sm leading-relaxed overflow-x-auto"><code class="hljs language-${lang}">${highlighted}</code></pre>
</div>\n`
    },

    codespan(code: string) {
      return `<code class="bg-surface-dim text-tertiary font-code text-sm px-2 py-0.5">${code}</code>`
    },

    blockquote(quote: string) {
      return `<blockquote class="border-l-4 border-tertiary pl-4 py-2 italic text-on-surface-variant my-4">${quote}</blockquote>\n`
    },

    list(body: string, ordered: boolean, start: number | '') {
      const tag = ordered ? 'ol' : 'ul'
      const listClass = ordered ? 'list-decimal' : 'list-disc'
      const startAttr = ordered && start && start !== 1 ? ` start="${start}"` : ''
      return `<${tag}${startAttr} class="${listClass} list-outside ml-6 space-y-1 my-4 text-base text-on-surface">\n${body}</${tag}>\n`
    },

    listitem(text: string, task: boolean, checked: boolean) {
      if (task) {
        const chk = `<input type="checkbox" ${checked ? 'checked' : ''} disabled class="mr-2 align-middle" />`
        return `<li class="leading-relaxed">${chk}${text}</li>\n`
      }
      return `<li class="leading-relaxed">${text}</li>\n`
    },

    link(href: string, title: string | null | undefined, text: string) {
      const titleAttr = title ? ` title="${title}"` : ''
      return `<a href="${href}"${titleAttr} class="text-tertiary hover:text-primary underline transition-colors" target="_blank" rel="noopener noreferrer">${text}</a>`
    },

    image(href: string, title: string | null, text: string) {
      const titleAttr = title ? ` title="${title}"` : ''
      return `<img src="${href}" alt="${text}"${titleAttr} class="my-6 max-w-full h-auto border border-on-surface" />\n`
    },

    hr() {
      return `<hr class="my-8 border-t border-on-surface/30" />\n`
    },

    table(header: string, body: string) {
      return `<div class="overflow-x-auto my-6">
<table class="w-full border border-on-surface">
<thead class="bg-on-surface text-surface">${header}</thead>
<tbody class="divide-y divide-on-surface/30">${body}</tbody>
</table>
</div>\n`
    },

    tablerow(content: string) {
      return `<tr>${content}</tr>\n`
    },

    tablecell(content: string, flags: { header: boolean; align: 'center' | 'left' | 'right' | null }) {
      const tag = flags.header ? 'th' : 'td'
      const align = flags.align ? ` class="text-${flags.align} p-3"` : ' class="p-3"'
      return `<${tag}${align}>${content}</${tag}>\n`
    },
  },
})

const renderedHtml = computed(() => {
  if (!props.markdown?.trim()) return ''
  try {
    return marked(props.markdown) as string
  } catch (e) {
    console.error('Markdown rendering error:', e)
    return '<p class="text-error">Error rendering markdown</p>'
  }
})
</script>

<style scoped>
.markdown-content {
  max-width: 68ch;
}

:deep(.markdown-content ul ul),
:deep(.markdown-content ol ol),
:deep(.markdown-content ul ol),
:deep(.markdown-content ol ul) {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
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
