import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[],
  }),

  actions: {
    addToCart(product: any) {
      this.items.push(product)
    },
    removeFromCart(id: number) {
  this.items = this.items.filter(item => item.id !== id)
}
  },
})