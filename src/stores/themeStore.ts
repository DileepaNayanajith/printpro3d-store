import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'
const storageKey = 'printpro3d_theme'
const savedTheme = (): Theme => {
  try { return localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light' }
  catch { return 'light' }
}

export const useThemeStore = defineStore('theme', {
  state: () => ({ theme: savedTheme() }),
  actions: {
    toggle() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      try { localStorage.setItem(storageKey, this.theme) } catch { /* Theme still works when storage is unavailable. */ }
    },
  },
})
