import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[],
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce(
        (total, item) => total + item.quantity,
        0
      ),

    totalPrice: (state) =>
      state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
  },

  actions: {
    addToCart(product: any) {
      const existingItem = this.items.find(
        item => item.id === product.id
      )

      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          ...product,
          quantity: 1,
        })
      }

      this.saveCart()
    },

    increaseQuantity(id: number) {
      const item = this.items.find(
        item => item.id === id
      )

      if (item) {
        item.quantity++
      }

      this.saveCart()
    },

    decreaseQuantity(id: number) {
      const item = this.items.find(
        item => item.id === id
      )

      if (!item) return

      if (item.quantity > 1) {
        item.quantity--
      } else {
        this.removeFromCart(id)
        return
      }

      this.saveCart()
    },

    removeFromCart(id: number) {
      this.items = this.items.filter(
        item => item.id !== id
      )

      this.saveCart()
    },

    saveCart() {
      localStorage.setItem(
        'cart',
        JSON.stringify(this.items)
      )
    },

    loadCart() {
      const savedCart = localStorage.getItem('cart')

      if (savedCart) {
        this.items = JSON.parse(savedCart)
      }
    },
  },
})