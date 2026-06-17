import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [] as any[],
  }),

  getters: {
    totalItems: (state) => state.items.length,
  },

  actions: {
    addToWishlist(product: any) {
      const exists = this.items.find(
        item => item.id === product.id
      )

      if (!exists) {
        this.items.push(product)
      }
    },

    removeFromWishlist(id: number) {
      this.items = this.items.filter(
        item => item.id !== id
      )
    },

    isInWishlist(id: number) {
      return this.items.some(
        item => item.id === id
      )
    },
  },
})