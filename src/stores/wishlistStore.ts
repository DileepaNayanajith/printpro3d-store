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
  this.saveWishlist()
}
    },

    removeFromWishlist(id: number) {
      this.items = this.items.filter(
  item => item.id !== id
)

this.saveWishlist()
    },

    isInWishlist(id: number) {
      return this.items.some(
        item => item.id === id
      )
    },
    saveWishlist() {
  localStorage.setItem(
    'wishlist',
    JSON.stringify(this.items)
  )
},

loadWishlist() {
  const savedWishlist =
    localStorage.getItem('wishlist')

  if (savedWishlist) {
    this.items = JSON.parse(savedWishlist)
  }
},
  },
})