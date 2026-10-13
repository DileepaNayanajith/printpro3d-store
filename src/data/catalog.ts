import products from './products.json'

export const stockLabel = (stock: number | null | undefined) =>
  stock == null ? 'In stock' : stock > 0 ? `${stock} in stock` : 'Sold out'

// Resolve SKUs for items saved before the catalog gained SKU fields.
export const productSku = (product: { id: number; sku?: string }) =>
  product.sku || products.find(item => item.id === product.id)?.sku || ''

// Current catalog availability takes precedence over older saved lists/carts.
export const isSoldOut = (product: { id: number; stock?: number | null }) => {
  const current = products.find(item => item.id === product.id)
  return (current ? current.stock : product.stock) === 0
}
