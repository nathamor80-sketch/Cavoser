// In-memory store to pass product data to the detail page
// In production, this would be a database or cache (Redis, etc.)
import { Product } from './types'

const store = new Map<string, Product>()

export function saveProduct(product: Product) {
  store.set(product.id, product)
}

export function getProduct(id: string): Product | undefined {
  return store.get(id)
}
