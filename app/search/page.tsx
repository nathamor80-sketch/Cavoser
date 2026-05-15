'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/types'

const SOURCES = ['amazon', 'ebay', 'aliexpress', 'etsy'] as const
const SOURCE_LABELS: Record<string, string> = {
  amazon: 'Amazon',
  ebay: 'eBay',
  aliexpress: 'AliExpress',
  etsy: 'Etsy',
}

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [activeSources, setActiveSources] = useState<string[]>([...SOURCES])
  const [sortBy, setSortBy] = useState<string>('relevance')

  useEffect(() => {
    if (!query) return
    setLoading(true)
    const params = new URLSearchParams({ q: query, sortBy })
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (activeSources.length < SOURCES.length) params.set('sources', activeSources.join(','))

    fetch(`/api/search?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [query, sortBy, minPrice, maxPrice, activeSources])

  const toggleSource = (src: string) => {
    setActiveSources((prev) =>
      prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex gap-6">

        {/* Sidebar filters */}
        <aside className="hidden md:flex flex-col gap-6 w-56 shrink-0">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal size={14} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-zinc-300">Sources</h3>
            </div>
            {SOURCES.map((src) => (
              <label key={src} className="flex items-center gap-2 cursor-pointer mb-2 group">
                <input
                  type="checkbox"
                  checked={activeSources.includes(src)}
                  onChange={() => toggleSource(src)}
                  className="accent-indigo-500"
                />
                <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
                  {SOURCE_LABELS[src]}
                </span>
              </label>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Price (USD)</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-zinc-800 text-white text-sm rounded-lg px-2 py-1.5 outline-none border border-zinc-700 focus:border-indigo-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-zinc-800 text-white text-sm rounded-lg px-2 py-1.5 outline-none border border-zinc-700 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Sort by</h3>
            {['relevance', 'price_asc', 'price_desc'].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer mb-2 group">
                <input
                  type="radio"
                  checked={sortBy === opt}
                  onChange={() => setSortBy(opt)}
                  className="accent-indigo-500"
                />
                <span className="text-sm text-zinc-400 group-hover:text-white transition-colors capitalize">
                  {opt === 'price_asc' ? 'Price: Low to High' : opt === 'price_desc' ? 'Price: High to Low' : 'Relevance'}
                </span>
              </label>
            ))}
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-white font-semibold text-lg">
                Résultats pour <span className="gradient-text">&ldquo;{query}&rdquo;</span>
              </h1>
              {!loading && (
                <p className="text-zinc-500 text-sm">{products.length} produits sur {activeSources.length} plateformes</p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-zinc-800" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-zinc-800 rounded w-full" />
                    <div className="h-3 bg-zinc-800 rounded w-3/4" />
                    <div className="h-5 bg-zinc-800 rounded w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 text-zinc-500">
              <p className="text-zinc-600 text-5xl font-thin mb-4">—</p>
              <p className="text-lg text-zinc-300">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-sm mt-2 text-zinc-600">Try different keywords or adjust your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} allProducts={products} query={query} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  )
}
