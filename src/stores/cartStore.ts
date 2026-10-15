import { trackCart } from '../lib/ga4'
import { defineStore } from 'pinia'
import catalog from '../data/products.json'
import { unitPrice } from '../lib/pricing'

type CartItem = { id:number; title:string; sku:string; price:number; thumbnail:string; category:string; stock:number|null; badge:string; quantity:number; color:string }
export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] as CartItem[] }),
  getters: {
    totalItems: state => state.items.reduce((total,item)=>total+item.quantity,0),
    totalPrice: state => state.items.reduce((total,item)=>total+item.price*item.quantity,0),
  },
  actions: {
    reprice() {
      for (const item of this.items) {
        const product=catalog.find(p=>p.id===item.id)!
        item.price=unitPrice(product,this.items.filter(p=>p.id===item.id).reduce((n,p)=>n+p.quantity,0))
      }
    },
    addToCart(input: {id:number;color?:string}, quantity=1, silent=false) {
      const product=catalog.find(p=>p.id===input.id)
      if (!product || !Number.isInteger(quantity) || quantity<1) return false
      // Filament colours are separate SKUs; only rack variants need a selected colour.
      const color=product.colors ? input.color || '' : ''
      if (product.colors ? !product.colors.includes(color) : color!=='') return false
      const total=this.items.filter(p=>p.id===product.id).reduce((n,p)=>n+p.quantity,0)
      if (total+quantity>Math.min(product.stock ?? 99,99)) return false
      const existing=this.items.find(p=>p.id===product.id && p.color===color)
      if(existing)existing.quantity+=quantity
      else this.items.push({...product,thumbnail:product.colorImages?.[color as 'White'|'Black'|'Gray'] || product.thumbnail,color,quantity})
      this.reprice();this.saveCart();if(!silent)trackCart('add_to_cart',[{id:product.id,price:this.items.find(p=>p.id===product.id && p.color===color)!.price,color,quantity}]);return true
    },
    increaseQuantity(id:number,color='') { return this.addToCart({id,color}) },
    decreaseQuantity(id:number,color='') {
      const item=this.items.find(p=>p.id===id && p.color===color)
      if(!item)return
      if(item.quantity>1){trackCart('remove_from_cart',[{...item,quantity:1}]);item.quantity--}
      else {this.removeFromCart(id,color);return}
      this.reprice();this.saveCart()
    },
    removeFromCart(id:number,color='') {
      const removed=this.items.find(p=>p.id===id && p.color===color)
      if(removed)trackCart('remove_from_cart',[removed])
      this.items=this.items.filter(p=>p.id!==id || p.color!==color)
      this.reprice();this.saveCart()
    },
    saveCart() { localStorage.setItem('cart',JSON.stringify(this.items)) },
    loadCart() {
      let saved:unknown
      try{saved=JSON.parse(localStorage.getItem('cart') || '[]')}catch{saved=[]}
      this.items=[]
      if(Array.isArray(saved))for(const item of saved){if(item && typeof item==='object')this.addToCart({id:item.id,color:item.color},item.quantity,true)}
    },
    clearCart() { this.items=[];this.saveCart() },
  },
})
