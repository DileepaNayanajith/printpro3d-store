import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useCartStore } from '../stores/cartStore'
import catalog from '../data/products.json'

export function useBuyNow() {
  const router=useRouter(), cart=useCartStore(), toast=useToast()
  const soldOut=(id:number)=>!catalog.some(p=>p.id===id && p.stock!==0)
  const buyNow=(input:{id:number;color?:string},quantity=1)=>{
    const product=catalog.find(p=>p.id===input.id)
    if(!product || soldOut(input.id))return toast.warning('This product is sold out.')
    if(product.colors && !product.colors.includes(input.color || '')){
      toast.info('Choose your rack colour and quantity, then tap Buy it now.')
      return router.push(`/products/${product.id}#purchase`)
    }
    if(!cart.addToCart(input,quantity))return toast.warning('Please check the available quantity.')
    return router.push('/checkout')
  }
  return {buyNow,soldOut}
}
