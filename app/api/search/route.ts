import { NextRequest, NextResponse } from 'next/server'
import { getMockProducts } from '@/lib/mockProducts'
import { generateProducts } from '@/lib/nvidia'
import { Product, SearchFilters } from '@/lib/types'

// Cache to avoid re-generating the same query (in-memory, resets on cold start)
const cache = new Map<string, { products: Product[]; ts: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const SOURCES = ['amazon', 'ebay', 'aliexpress', 'etsy'] as const

async function searchEbay(query: string): Promise<Product[]> {
  const appId = process.env.EBAY_APP_ID
  if (!appId) return []
  try {
    const res = await fetch(
      `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.3&SECURITY-APPNAME=${appId}&RESPONSE-DATA-FORMAT=JSON&keywords=${encodeURIComponent(query)}&paginationInput.entriesPerPage=4`,
      { next: { revalidate: 60 } }
    )
    const data = await res.json()
    const items = data?.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || []
    return items.map((item: Record<string, unknown[]>) => ({
      id: `ebay-${(item.itemId as string[])[0]}`,
      title: (item.title as string[])[0],
      price: parseFloat(String(((item.sellingStatus as Record<string, unknown>[])[0]?.currentPrice as Record<string, unknown>[])?.[0]?.__value__ ?? '0')),
      currency: 'USD',
      image: (item.galleryURL as string[])[0] || '',
      url: (item.viewItemURL as string[])[0],
      source: 'ebay' as const,
      shipping: 'Check listing',
    }))
  } catch {
    return []
  }
}

async function generateAIProducts(query: string, sources: string[]): Promise<Product[]> {
  const cacheKey = `${query.toLowerCase().trim()}::${sources.sort().join(',')}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.products

  // Generate 2 products per source in parallel
  const results = await Promise.allSettled(
    sources.map(async (source) => {
      const aiProducts = await generateProducts(query, source, 2)
      return aiProducts.map((p, i): Product => {
        const id = `${source}-ai-${i}-${Date.now()}`
        const keywords = p.keywords || query
        const seed = Math.abs(id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 9999

        // Build affiliate URLs
        let url = ''
        if (source === 'amazon') {
          url = `https://www.amazon.fr/s?k=${encodeURIComponent(query)}&tag=cavoserboss-21`
        } else if (source === 'ebay') {
          url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`
        } else if (source === 'aliexpress') {
          url = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(query)}`
        } else if (source === 'etsy') {
          url = `https://www.etsy.com/search?q=${encodeURIComponent(query)}`
        }

        return {
          id,
          title: p.title,
          price: source === 'amazon' ? 0 : p.price, // Amazon = redirect
          currency: 'USD',
          image: `https://loremflickr.com/400/400/${encodeURIComponent(keywords)}?lock=${seed}`,
          url,
          source: source as Product['source'],
          rating: Math.round(p.rating * 10) / 10,
          reviewCount: p.reviewCount,
          shipping: p.shipping,
          description: p.description,
        }
      })
    })
  )

  const products = results
    .filter((r): r is PromiseFulfilledResult<Product[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)

  if (products.length > 0) cache.set(cacheKey, { products, ts: Date.now() })
  return products
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const sourcesParam = searchParams.get('sources')?.split(',') || []
  const activeSources = sourcesParam.length > 0 ? sourcesParam : [...SOURCES]
  const sortBy = (searchParams.get('sortBy') as SearchFilters['sortBy']) || 'relevance'

  if (!query.trim()) return NextResponse.json({ products: [] })

  let products: Product[] = []

  // 1. Try eBay real API
  const ebayProducts = await searchEbay(query)

  // 2. Try NVIDIA AI generation
  const hasNvidia = !!process.env.NVIDIA_API_KEY
  if (hasNvidia) {
    const sourcesForAI = activeSources.filter(s => s !== 'ebay' || ebayProducts.length === 0)
    const aiProducts = await generateAIProducts(query, sourcesForAI)
    products = [
      ...ebayProducts,
      ...aiProducts.filter(p => ebayProducts.length === 0 || p.source !== 'ebay'),
    ]
  }

  // 3. Fallback to mock if AI failed
  if (products.length === 0) {
    products = getMockProducts(query)
  }

  // Filter by sources
  if (activeSources.length < SOURCES.length) {
    products = products.filter(p => activeSources.includes(p.source))
  }

  // Filter by price
  if (minPrice !== undefined) products = products.filter(p => p.price >= minPrice || p.price === 0)
  if (maxPrice !== undefined) products = products.filter(p => p.price <= maxPrice || p.price === 0)

  // Sort
  if (sortBy === 'price_asc') products.sort((a, b) => a.price - b.price)
  else if (sortBy === 'price_desc') products.sort((a, b) => b.price - a.price)

  return NextResponse.json({ products, total: products.length })
}
