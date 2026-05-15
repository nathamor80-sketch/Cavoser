import { NextRequest, NextResponse } from 'next/server'
import { getMockProducts } from '@/lib/mockProducts'
import { Product, SearchFilters } from '@/lib/types'

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const sources = searchParams.get('sources')?.split(',') || []
  const sortBy = (searchParams.get('sortBy') as SearchFilters['sortBy']) || 'relevance'

  if (!query.trim()) {
    return NextResponse.json({ products: [] })
  }

  // Try real eBay API, fall back to mock data
  const [ebayProducts, mockProducts] = await Promise.all([
    searchEbay(query),
    Promise.resolve(getMockProducts(query)),
  ])

  const ebayIds = new Set(ebayProducts.map((p) => p.source + p.id))
  const fallbackMock = mockProducts.filter((p) => p.source !== 'ebay' || ebayIds.size === 0)

  let products: Product[] = ebayProducts.length > 0
    ? [...ebayProducts, ...fallbackMock.filter((p) => p.source !== 'ebay')]
    : mockProducts

  // Filter by sources
  if (sources.length > 0) {
    products = products.filter((p) => sources.includes(p.source))
  }

  // Filter by price
  if (minPrice !== undefined) products = products.filter((p) => p.price >= minPrice)
  if (maxPrice !== undefined) products = products.filter((p) => p.price <= maxPrice)

  // Sort
  if (sortBy === 'price_asc') products.sort((a, b) => a.price - b.price)
  else if (sortBy === 'price_desc') products.sort((a, b) => b.price - a.price)

  return NextResponse.json({ products, total: products.length })
}
