export type Source = 'ebay' | 'amazon' | 'aliexpress' | 'etsy'

export interface Product {
  id: string
  title: string
  price: number
  currency: string
  image: string
  url: string
  source: Source
  rating?: number
  reviewCount?: number
  shipping?: string
  description?: string
}

export interface SearchFilters {
  minPrice?: number
  maxPrice?: number
  sources?: Source[]
  sortBy?: 'price_asc' | 'price_desc' | 'relevance'
}
