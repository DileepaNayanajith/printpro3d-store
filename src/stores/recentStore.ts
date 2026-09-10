import { defineStore } from 'pinia'

export const useRecentStore = defineStore('recent', {
  state: () => ({ items: [] as any[] }),
  actions: {
    load() {
      try { this.items = JSON.parse(localStorage.getItem('recently-viewed') || '[]') } catch { this.items = [] }
    },
    add(product: any) {
      this.items = [product, ...this.items.filter(item => item.id !== product.id)].slice(0, 6)
      localStorage.setItem('recently-viewed', JSON.stringify(this.items))
    },
  },
})
