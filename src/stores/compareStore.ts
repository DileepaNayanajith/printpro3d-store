import { defineStore } from 'pinia'

export const useCompareStore = defineStore('compare', {
  state: () => ({ items: [] as any[] }),
  actions: {
    load() {
      try { this.items = JSON.parse(localStorage.getItem('compare') || '[]') } catch { this.items = [] }
    },
    toggle(product: any) {
      const exists = this.items.some(item => item.id === product.id)
      if (exists) this.items = this.items.filter(item => item.id !== product.id)
      else if (this.items.length < 3) this.items.push(product)
      localStorage.setItem('compare', JSON.stringify(this.items))
      return !exists
    },
    has(id: number) { return this.items.some(item => item.id === id) },
    clear() { this.items = []; localStorage.removeItem('compare') },
  },
})
