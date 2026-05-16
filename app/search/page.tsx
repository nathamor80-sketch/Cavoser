'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Trophy, DollarSign, ShieldCheck, Truck, Zap, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/types'
import { computeTrustScore, computeValueScore } from '@/lib/scoring'

const SOURCES = ['amazon', 'ebay', 'aliexpress', 'etsy'] as const
const SOURCE_LABELS: Record<string, string> = {
  amazon: 'Amazon', ebay: 'eBay', aliexpress: 'AliExpress', etsy: 'Etsy',
}

type Preference = 'quality' | 'price' | 'reliability' | 'shipping' | 'value'

const PREFERENCES: { key: Preference; label: string; desc: string; icon: React.ReactNode; color: string; glow: string }[] = [
  {
    key: 'quality',
    label: 'Qualité',
    desc: 'Meilleurs produits',
    icon: <Trophy size={18} />,
    color: 'from-yellow-500 to-amber-500',
    glow: 'shadow-yellow-500/30',
  },
  {
    key: 'price',
    label: 'Prix',
    desc: 'Le moins cher',
    icon: <DollarSign size={18} />,
    color: 'from-emerald-500 to-green-500',
    glow: 'shadow-emerald-500/30',
  },
  {
    key: 'reliability',
    label: 'Fiabilité',
    desc: 'Vendeurs de confiance',
    icon: <ShieldCheck size={18} />,
    color: 'from-blue-500 to-indigo-500',
    glow: 'shadow-blue-500/30',
  },
  {
    key: 'shipping',
    label: 'Livraison',
    desc: 'Livraison rapide & gratuite',
    icon: <Truck size={18} />,
    color: 'from-violet-500 to-purple-500',
    glow: 'shadow-violet-500/30',
  },
  {
    key: 'value',
    label: 'Rapport Q/P',
    desc: 'Meilleur compromis',
    icon: <Zap size={18} />,
    color: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/30',
  },
]

function sortByPreference(products: Product[], pref: Preference | null): Product[] {
  if (!pref) return products
  const valueScores = computeValueScore(products)

  return [...products].sort((a, b) => {
    switch (pref) {
      case 'quality':
        return (b.rating || 0) - (a.rating || 0)
      case 'price':
        if (a.price === 0 && b.price === 0) return 0
        if (a.price === 0) return 1
        if (b.price === 0) return -1
        return a.price - b.price
      case 'reliability': {
        const ta = computeTrustScore(a).overall
        const tb = computeTrustScore(b).overall
        return tb - ta
      }
      case 'shipping':
        if (a.shipping && !b.shipping) return -1
        if (!a.shipping && b.shipping) return 1
        return 0
      case 'value': {
        const va = valueScores.get(a.id)?.score || 0
        const vb = valueScores.get(b.id)?.score || 0
        return vb - va
      }
      default:
        return 0
    }
  })
}

function PreferencePicker({ selected, onSelect }: {
  selected: Preference | null
  onSelect: (p: Preference) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-indigo-400" />
        <p className="text-sm font-medium text-zinc-300">Quelle est ta priorité ?</p>
        {selected && (
          <button
            onClick={() => onSelect(selected)}
            className="ml-auto text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Réinitialiser
          </button>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {PREFERENCES.map((pref) => {
          const active = selected === pref.key
          return (
            <motion.button
              key={pref.key}
              onClick={() => onSelect(pref.key)}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                active
                  ? `bg-gradient-to-r ${pref.color} text-white border-transparent shadow-lg ${pref.glow}`
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
              }`}
            >
              <span className={active ? 'text-white' : 'text-zinc-500'}>{pref.icon}</span>
              <span>{pref.label}</span>
              {active && (
                <span className="text-xs opacity-75 hidden sm:inline">— {pref.desc}</span>
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [activeSources, setActiveSources] = useState<string[]>([...SOURCES])
  const [sortBy, setSortBy] = useState<string>('relevance')
  const [preference, setPreference] = useState<Preference | null>(null)
  const [showPrefs, setShowPrefs] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    setShowPrefs(false)
    setPreference(null)
    const params = new URLSearchParams({ q: query, sortBy })
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (activeSources.length < SOURCES.length) params.set('sources', activeSources.join(','))

    fetch(`/api/search?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || [])
        setLoading(false)
        // Show preference picker after results load
        setTimeout(() => setShowPrefs(true), 300)
      })
      .catch(() => setLoading(false))
  }, [query, sortBy, minPrice, maxPrice, activeSources])

  const handlePreference = (p: Preference) => {
    setPreference(prev => prev === p ? null : p)
  }

  const sortedProducts = useMemo(
    () => sortByPreference(products, preference),
    [products, preference]
  )

  const toggleSource = (src: string) => {
    setActiveSources((prev) =>
      prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex gap-6">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col gap-4 w-52 shrink-0">
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
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Prix (USD)</h3>
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
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Trier par</h3>
            {['relevance', 'price_asc', 'price_desc'].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer mb-2 group">
                <input
                  type="radio"
                  checked={sortBy === opt}
                  onChange={() => setSortBy(opt)}
                  className="accent-indigo-500"
                />
                <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
                  {opt === 'price_asc' ? 'Prix croissant' : opt === 'price_desc' ? 'Prix décroissant' : 'Pertinence'}
                </span>
              </label>
            ))}
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white font-semibold text-lg">
                Résultats pour <span className="gradient-text">&ldquo;{query}&rdquo;</span>
              </h1>
              {!loading && (
                <p className="text-zinc-500 text-sm">
                  {sortedProducts.length} produits sur {activeSources.length} plateformes
                  {preference && (
                    <span className="ml-2 text-indigo-400">
                      · triés par {PREFERENCES.find(p => p.key === preference)?.label}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Preference picker */}
          <AnimatePresence>
            {showPrefs && !loading && products.length > 0 && (
              <PreferencePicker selected={preference} onSelect={handlePreference} />
            )}
          </AnimatePresence>

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
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-24 text-zinc-500">
              <p className="text-zinc-600 text-5xl font-thin mb-4">—</p>
              <p className="text-lg text-zinc-300">Aucun résultat pour &ldquo;{query}&rdquo;</p>
              <p className="text-sm mt-2 text-zinc-600">Essaie d&apos;autres mots-clés ou modifie les filtres</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {sortedProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                  >
                    <ProductCard product={product} allProducts={products} query={query} index={i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
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
