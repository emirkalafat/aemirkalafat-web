import { ref } from 'vue'
import { useAnalytics } from './useAnalytics'

type Theme = 'light' | 'dark'

let themeInstance: ReturnType<typeof createTheme> | null = null

function createTheme() {
  const theme = ref<Theme>('light')

  const apply = (t: Theme) => {
    if (t === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const init = () => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored && (stored === 'light' || stored === 'dark')) {
      theme.value = stored
      apply(stored)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
      apply(theme.value)
    }
  }

  const toggle = () => {
    const newTheme = theme.value === 'dark' ? 'light' : 'dark'
    theme.value = newTheme
    apply(newTheme)
    localStorage.setItem('theme', newTheme)
    useAnalytics().trackThemeToggle(newTheme)
  }

  return { theme, init, toggle }
}

export function useTheme() {
  if (!themeInstance) {
    themeInstance = createTheme()
  }
  return themeInstance
}
