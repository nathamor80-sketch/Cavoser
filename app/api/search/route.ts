import { NextRequest, NextResponse } from 'next/server'
import { getMockProducts } from '@/lib/mockProducts'
import { generateProducts } from '@/lib/nvidia'
import { Product, SearchFilters } from '@/lib/types'

const cache = new Map<string, { products: Product[]; ts: number }>()
const CACHE_TTL = 5 * 60 * 1000

const SOURCES = ['amazon', 'ebay', 'aliexpress', 'etsy'] as const

// Build direct affiliate URLs per platform
function buildDirectUrl(source: string, slug: string, query: string): string {
  const q = encodeURIComponent(query)
  const s = encodeURIComponent(slug)
  switch (source) {
    case 'amazon':
      // Direct search on amazon.fr with affiliate tag
      return `https://www.amazon.fr/s?k=${s}&tag=cavoserboss-21`
    case 'ebay':
      return `https://www.ebay.com/sch/i.html?_nkw=${s}`
    case 'aliexpress':
      return `https://www.aliexpress.com/wholesale?SearchText=${q}`
    case 'etsy':
      return `https://www.etsy.com/search?q=${s}`
    default:
      return `https://www.google.com/search?q=${s}`
  }
}

// Real eBay API — returns actual images + direct product URLs
async function searchEbay(query: string): Promise<Product[]> {
  const appId = process.env.EBAY_APP_ID
  if (!appId) return []
  try {
    const res = await fetch(
      `https://svcs.ebay.com/services/search/FindingService/v1` +
      `?OPERATION-NAME=findItemsByKeywords` +
      `&SERVICE-VERSION=1.0.3` +
      `&SECURITY-APPNAME=${appId}` +
      `&RESPONSE-DATA-FORMAT=JSON` +
      `&keywords=${encodeURIComponent(query)}` +
      `&paginationInput.entriesPerPage=8` +
      `&outputSelector=GalleryInfo,ShippingInfo`,
      { next: { revalidate: 60 } }
    )
    const data = await res.json()
    const items = data?.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || []

    return items.map((item: Record<string, unknown[]>): Product => {
      const itemId = (item.itemId as string[])[0]
      const title = (item.title as string[])[0]

      // Best image: galleryPlusPictureURL (large) > galleryURL upgraded to s-l500
      const galleryPlusURL = (item.galleryPlusPictureURL as string[] | undefined)?.[0]
      const galleryURL = ((item.galleryURL as string[] | undefined)?.[0] || '')
        .replace('s-l140.jpg', 's-l500.jpg')
        .replace('s-l140.webp', 's-l500.webp')
        .replace('s-l140', 's-l500')
      const image = galleryPlusURL || galleryURL

      // Direct product URL
      const productUrl = (item.viewItemURL as string[])[0]

      const price = parseFloat(String(
        ((item.sellingStatus as Record<string, unknown>[])[0]
          ?.currentPrice as Record<string, unknown>[])?.[0]?.__value__ ?? '0'
      ))

      // Free shipping detection
      const shippingCost = ((item.shippingInfo as Record<string, unknown>[] | undefined)?.[0]
        ?.shippingServiceCost as Record<string, unknown>[] | undefined)?.[0]?.__value__
      const isFreeShip = shippingCost === '0.0' || shippingCost === '0'

      return {
        id: `ebay-${itemId}`,
        title,
        price,
        currency: 'USD',
        image,
        url: productUrl,
        source: 'ebay' as const,
        rating: Math.round((4.0 + Math.random() * 0.9) * 10) / 10,
        reviewCount: Math.floor(Math.random() * 800) + 20,
        shipping: isFreeShip ? 'Free shipping' : undefined,
      }
    })
  } catch {
    return []
  }
}

// AI-generated products with real image keywords + direct search links
async function generateAIProducts(query: string, sources: string[]): Promise<Product[]> {
  const cacheKey = `${query.toLowerCase().trim()}::${sources.sort().join(',')}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.products

  const results = await Promise.allSettled(
    sources.map(async (source) => {
      const aiProducts = await generateProducts(query, source, 2)
      return aiProducts.map((p, i): Product => {
        const id = `${source}-ai-${i}-${query.slice(0, 8)}`
        const seed = Math.abs(id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 9999
        const keywords = p.imageKeywords || query

        // Product image from loremflickr with specific keywords
        const image = `https://loremflickr.com/400/400/${encodeURIComponent(keywords)}?lock=${seed}`

        return {
          id,
          title: p.title,
          // Amazon shows 0 (redirect to search), others show real price
          price: source === 'amazon' ? 0 : p.price,
          currency: 'USD',
          image,
          url: buildDirectUrl(source, p.productSlug || query, query),
          source: source as Product['source'],
          rating: Math.round(p.rating * 10) / 10,
          reviewCount: p.reviewCount,
          shipping: p.shipping,
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

  // 1. Real eBay API products (real images + direct links)
  const ebayProducts = activeSources.includes('ebay') ? await searchEbay(query) : []

  // 2. AI-generated for other sources
  const hasNvidia = !!process.env.NVIDIA_API_KEY
  if (hasNvidia) {
    const aiSources = activeSources.filter(s => s !== 'ebay' || ebayProducts.length === 0)
    const aiProducts = await generateAIProducts(query, aiSources)
    products = [
      ...ebayProducts,
      ...aiProducts.filter(p => ebayProducts.length === 0 || p.source !== 'ebay'),
    ]
  }

  // 3. Fallback to mock if nothing worked
  if (products.length === 0) {
    products = getMockProducts(query)
  }

  // Filter by active sources
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
