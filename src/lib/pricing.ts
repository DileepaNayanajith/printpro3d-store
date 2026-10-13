export type PriceProduct = { price: number; bulkMin?: number | null; bulkPrice?: number | null }
export function unitPrice(product: PriceProduct, totalQuantity: number): number {
  return product.bulkMin && product.bulkPrice != null && totalQuantity >= product.bulkMin ? product.bulkPrice : product.price
}
