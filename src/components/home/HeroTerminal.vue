<template>
  <div
    ref="root"
    class="relative flex flex-col w-full min-w-0 h-[400px] md:h-[480px] border border-primary bg-surface-container-lowest brutalist-offset shadow-tertiary transition-colors focus-within:border-tertiary"
    aria-label="Interactive terminal"
    @click="focusInput">
    <div class="bg-on-surface text-background px-3 py-2 flex items-center justify-between font-code text-code select-none">
      <div class="flex items-center gap-2">
        <span class="flex gap-1" aria-hidden="true">
          <span v-for="n in 3" :key="n" class="block w-2.5 h-2.5 bg-background/40"></span>
        </span>
        <span>visitor@aek: ~</span>
      </div>
      <span class="text-xs opacity-70">FIG 1.0 — LIVE</span>
    </div>

    <div ref="bodyEl" class="flex-1 min-h-0 overflow-y-auto p-4 font-code text-code flex flex-col gap-1">
      <div
        v-for="line in lines"
        :key="line.id"
        class="whitespace-pre-wrap break-words term-line-in"
        :class="kindClass[line.kind]">
        <template v-if="line.kind === 'cmd'">
          <span class="text-tertiary-text select-none">$ </span>{{ line.text }}
        </template>
        <template v-else>{{ line.text }}</template>
      </div>
    </div>

    <form class="flex items-center gap-2 border-t border-outline-variant px-4 py-2 font-code text-code" @submit.prevent="submit">
      <label for="hero-terminal-input" class="whitespace-nowrap select-none">
        <span class="text-tertiary-text">visitor@aek</span><span class="text-on-surface-variant">:~$</span>
      </label>
      <span v-if="busy" class="flex-1 min-w-0 text-on-surface blinking-cursor">{{ input }}</span>
      <input
        v-else
        id="hero-terminal-input"
        ref="inputEl"
        v-model="input"
        type="text"
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        aria-label="Terminal command input"
        class="flex-1 min-w-0 bg-transparent text-on-surface caret-tertiary focus-visible:outline-none focus-visible:shadow-none"
        @keydown="onKeydown" />
    </form>

    <div class="crt-scanlines pointer-events-none absolute inset-0" aria-hidden="true"></div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { experience, education, allSkills } from '@/data/experience'
import { useAnalytics } from '@/composables/useAnalytics'
import { useTheme } from '@/composables/useTheme'

type Kind = 'cmd' | 'out' | 'dim' | 'ok' | 'err' | 'accent'
interface Out {
  kind: Kind
  text: string
}
interface Line extends Out {
  id: number
}
interface Command {
  desc: string
  hidden?: boolean
  run: (args: string[]) => Out[]
}

const kindClass: Record<Kind, string> = {
  cmd: 'text-on-surface',
  out: 'text-on-surface-variant',
  dim: 'text-on-surface-variant/70',
  ok: 'text-tertiary-text',
  err: 'text-error',
  accent: 'text-cyber-purple',
}

const router = useRouter()
const { trackCvDownload, trackSocialClick } = useAnalytics()
const { theme, toggle: toggleTheme } = useTheme()

const lines = ref<Line[]>([])
const input = ref('')
const busy = ref(true)
const root = ref<HTMLElement | null>(null)
const bodyEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

const preferredLang = navigator.language?.toLowerCase().startsWith('tr') ? 'TR' : 'EN'
const cvOptions = [
  { field: 'Software', lang: 'TR', title: 'Yazılım Mühendisi' },
  { field: 'Software', lang: 'EN', title: 'Software Engineer' },
  { field: 'Electrical', lang: 'TR', title: 'Elektrik Mühendisi' },
  { field: 'Electrical', lang: 'EN', title: 'Electrical Engineer' },
]
let awaitingCv = false
const history: string[] = []
let historyIdx = -1
let lineId = 0
let cancelled = false
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
const o = (text: string, kind: Kind = 'out'): Out => ({ kind, text })

function push(out: Out) {
  lines.value.push({ ...out, id: lineId++ })
  if (lines.value.length > 200) lines.value.splice(0, lines.value.length - 200)
  nextTick(() => {
    if (bodyEl.value) bodyEl.value.scrollTop = bodyEl.value.scrollHeight
  })
}

const commands: Record<string, Command> = {
  help: {
    desc: 'list available commands',
    run: () =>
      Object.entries(commands)
        .filter(([, c]) => !c.hidden)
        .map(([name, c]) => o(`${name.padEnd(11)}${c.desc}`)),
  },
  whoami: {
    desc: 'who is this person?',
    run: () => [o('Ahmet Emir Kalafat', 'accent'), o('Computer & Electrical Engineer · İstanbul', 'dim')],
  },
  ls: {
    desc: 'list interests',
    run: () => [o('hardware/  software/  homelab/  media/  blog/')],
  },
  skills: {
    desc: 'print skill matrix',
    run: () => [o(allSkills.map(s => s.toLowerCase()).join(' · '))],
  },
  experience: {
    desc: 'print work history',
    run: () =>
      experience.map(e => {
        const role = e.roles[0]
        const company = e.company.replace(/ - .*/, '')
        return o(role ? `[✓] ${company} — ${role.title} (${role.period})` : `[✓] ${company}`, 'ok')
      }),
  },
  education: {
    desc: 'print education stack',
    run: () => education.map(e => o(`[✓] ${e.institution} — ${e.field} (${e.period})`, 'ok')),
  },
  cv: {
    desc: 'download my CV (pick a number)',
    run: ([choice]) => {
      const option = cvOptions[Number(choice) - 1]
      if (!option) {
        awaitingCv = true
        return [
          ...cvOptions.map((c, i) =>
            o(`  [${i + 1}] ${c.field} · ${c.lang}  ${c.title}${c.lang === preferredLang ? '  ← önerilen' : ''}`),
          ),
          o('type a number (1-4) to download', 'dim'),
        ]
      }
      const file = `Ahmet_Emir_Kalafat_CV_${option.field}_${option.lang}.pdf`
      window.open(`/${file}`, '_blank', 'noopener')
      trackCvDownload(option.field.toLowerCase(), option.lang.toLowerCase())
      return [o(`↓ opening ${file}`, 'ok')]
    },
  },
  github: {
    desc: 'open my GitHub profile',
    run: () => {
      window.open('https://github.com/emirkalafat', '_blank', 'noopener')
      trackSocialClick('github', 'hero_terminal')
      return [o('→ opening github.com/emirkalafat', 'ok')]
    },
  },
  theme: {
    desc: 'toggle light / dark',
    run: () => {
      toggleTheme()
      return [o(`theme → ${theme.value}`, 'ok')]
    },
  },
  clear: {
    desc: 'clear the screen',
    run: () => {
      lines.value = []
      return []
    },
  },
  coffee: {
    hidden: true,
    desc: '',
    run: () => [
      o('    ( (', 'accent'),
      o('     ) )', 'accent'),
      o('  ........', 'dim'),
      o('  |      |]'),
      o('  \\      /'),
      o("   `----'"),
      o('[WARN] Coffee levels depleted. System unstable without caffeine.', 'err'),
    ],
  },
  sudo: {
    hidden: true,
    desc: '',
    run: () => [o('visitor is not in the sudoers file. This incident will be reported.', 'err')],
  },
}

const routes: Array<[string, string, string]> = [
  ['projects', '/projects', 'open the projects log'],
  ['blog', '/blog', 'read the blog'],
  ['media', '/media', 'see what I watch & rate'],
  ['status', '/status', 'check homelab status'],
  ['contact', '/contact', 'get in touch'],
]
for (const [name, path, desc] of routes) {
  commands[name] = {
    desc,
    run: () => {
      setTimeout(() => router.push(path), 500)
      return [o(`→ opening ${path}`, 'ok')]
    },
  }
}

async function run(raw: string, animate = false) {
  push(o(raw, 'cmd'))
  if (!raw) return
  const pickingCv = awaitingCv && /^[1-4]$/.test(raw)
  awaitingCv = false
  const [name = '', ...args] = pickingCv ? ['cv', raw] : raw.split(/\s+/)
  const key = name.toLowerCase()
  const cmd = Object.hasOwn(commands, key) ? commands[key] : undefined
  const out = cmd ? cmd.run(args) : [o(`command not found: ${name} — try 'help'`, 'err')]
  for (const line of out) {
    push(line)
    if (animate && !cancelled) await sleep(90)
  }
}

async function submit() {
  if (busy.value) return
  const raw = input.value.trim()
  input.value = ''
  historyIdx = -1
  if (raw) history.unshift(raw)
  await run(raw)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIdx < history.length - 1) input.value = history[++historyIdx] ?? ''
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIdx > 0) {
      input.value = history[--historyIdx] ?? ''
    } else {
      historyIdx = -1
      input.value = ''
    }
  } else if (e.key === 'Tab' && input.value) {
    const matches = Object.keys(commands).filter(n => n.startsWith(input.value.toLowerCase()))
    if (matches.length === 1) {
      e.preventDefault()
      input.value = matches[0] ?? input.value
    }
  } else if (e.key === 'Escape') {
    inputEl.value?.blur()
  }
}

function finishBoot() {
  if (!busy.value) return
  push(o("type 'help' to see what I can do — or try 'projects'", 'dim'))
  busy.value = false
  input.value = ''
}

function focusInput() {
  if (window.getSelection()?.toString()) return
  if (busy.value) {
    cancelled = true
    finishBoot()
  }
  nextTick(() => inputEl.value?.focus({ preventScroll: true }))
}

async function boot() {
  const wait = (ms: number) => (reduceMotion || cancelled ? Promise.resolve() : sleep(ms))
  await wait(900)
  for (const cmd of ['whoami', 'ls']) {
    if (cancelled) return
    for (const ch of cmd) {
      if (cancelled) return
      input.value += ch
      await wait(60 + Math.random() * 70)
    }
    await wait(250)
    if (cancelled) return
    input.value = ''
    await run(cmd, !reduceMotion)
    await wait(500)
  }
  if (!cancelled) finishBoot()
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!root.value) return
  observer = new IntersectionObserver(
    entries => {
      if (entries[0]?.isIntersecting) {
        observer?.disconnect()
        boot()
      }
    },
    { threshold: 0.3 },
  )
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  cancelled = true
  observer?.disconnect()
})
</script>
