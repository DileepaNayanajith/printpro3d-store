import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'
const storageKey = 'printpro3d_theme'
const savedTheme = (): Theme => {
  try { return localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light' }
  catch { return 'light' }
}

// The root attribute drives the storefront colour tokens; index.html sets it before the app loads.
export const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

export const useThemeStore = defineStore('theme', {
  state: () => ({ theme: savedTheme() }),
  actions: {
    toggle() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      applyTheme(this.theme)
      try { localStorage.setItem(storageKey, this.theme) } catch { /* Theme still works when storage is unavailable. */ }
    },
  },
})
