'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { Star, Truck, Shield, BarChart2, ChevronRight, ExternalLink, Trophy } from 'lucide-react'
import Header from '@/components/Header'
import { Product } from '@/lib/types'
import { computeTrustScore, computeValueScore, TrustScore, ValueScore } from '@/lib/scoring'
import { buildAffiliateUrl } from '@/lib/affiliateLinks'

const SOURCE_LABELS: Record<string, string> = {
  amazon: 'Amazon', ebay: 'eBay', aliexpress: 'AliExpress', etsy: 'Etsy',
}
const SOURCE_COLOR: Record<string, string> = {
  amazon: 'text-orange-400', ebay: 'text-blue-400', aliexpress: 'text-red-400', etsy: 'text-amber-400',
}

function ScoreBar({ label, value, color = 'bg-indigo-500' }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-zinc-400">{label}</span>
        <span className="text-zinc-300 font-medium">{value}/100</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function TrustPanel({ trust }: { trust: TrustScore }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={15} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Reliability Score</h3>
        </div>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${trust.badgeColor}`}>
          {trust.badge}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black text-white">{trust.overall}</span>
        <span className="text-zinc-600 text-sm">/100</span>
      </div>
      <div className="space-y-2.5">
        <ScoreBar label="Platform reputation"  value={trust.breakdown.platform}  />
        <ScoreBar label="Product rating"       value={trust.breakdown.rating}   color="bg-violet-500" />
        <ScoreBar label="Review volume"        value={trust.breakdown.reviews}  color="bg-purple-500" />
        <ScoreBar label="Delivery reliability" value={trust.breakdown.delivery} color="bg-pink-500" />
      </div>
    </div>
  )
}

function CompetitorRow({ product, valueScore, isCurrent }: {
  product: Product; valueScore: ValueScore; isCurrent: boolean
}) {
  const trust = computeTrustScore(product)
  const affiliateUrl = buildAffiliateUrl(product.url, product.source)

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${
      valueScore.isBestDeal
        ? 'border-emerald-500/40 bg-emerald-500/5'
        : isCurrent
        ? 'border-indigo-500/30 bg-indigo-500/5'
        : 'border-zinc-800 bg-zinc-900/40'
    }`}>
      {valueScore.isBestDeal && (
        <div className="flex items-center gap-1 shrink-0">
          <Trophy size={12} className="text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400">Best</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold ${SOURCE_COLOR[product.source]}`}>{SOURCE_LABELS[product.source]}</p>
        <p className="text-xs text-zinc-400 truncate">{product.title.slice(0, 55)}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-white font-bold text-sm">${product.price.toFixed(2)}</p>
        <p className="text-xs text-zinc-600">Trust: {trust.overall}</p>
      </div>
      <div className="text-center shrink-0 w-12">
        <p className={`text-sm font-bold ${valueScore.score >= 80 ? 'text-emerald-400' : valueScore.score >= 60 ? 'text-yellow-400' : 'text-zinc-500'}`}>
          {valueScore.score}
        </p>
        <p className="text-xs text-zinc-700">score</p>
      </div>
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-indigo-600 text-zinc-300 hover:text-white transition-colors"
      >
        View <ExternalLink size={10} />
      </a>
    </div>
  )
}

function ProductDetailContent() {
  const searchParams = useSearchParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [competitors, setCompetitors] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const productData = searchParams.get('data')
  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (productData) {
      try {
        setProduct(JSON.parse(decodeURIComponent(productData)))
      } catch { setLoading(false); return }
    }
    if (query) {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((d) => { setCompetitors(d.products || []); setLoading(false) })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [productData, query])

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-zinc-600 text-sm animate-pulse">Loading product...</div>
        </div>
      </div>
    )
  }

  const trust = computeTrustScore(product)
  const allProducts = competitors.length > 0 ? competitors : [product]
  const valueScores = computeValueScore(allProducts)
  const productValue = valueScores.get(product.id) || { score: 70, label: 'Good Value', isBestDeal: false }
  const affiliateUrl = buildAffiliateUrl(product.url, product.source)

  const topCompetitors = allProducts
    .filter((p) => p.id !== product.id)
    .sort((a, b) => (valueScores.get(b.id)?.score || 0) - (valueScores.get(a.id)?.score || 0))
    .slice(0, 5)

  const productImg = `https://picsum.photos/seed/${product.id.replace(/[^a-z0-9]/gi, '')}/600/600`

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header />

      <div className="max-w-6xl mx-auto w-full px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-600 mb-6">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          {query && <Link href={`/search?q=${encodeURIComponent(query)}`} className="hover:text-zinc-300 transition-colors">{query}</Link>}
          {query && <ChevronRight size={12} />}
          <span className="text-zinc-500 truncate max-w-[200px]">{product.title.slice(0, 35)}…</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* Left */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <img src={productImg} alt={product.title} className="w-full h-full object-cover" />
              {productValue.isBestDeal && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-emerald-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-lg">
                  <Trophy size={14} />
                  Best Quality/Price
                </div>
              )}
              <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full border ${trust.badgeColor}`}>
                {trust.badge}
              </div>
            </div>

            {/* Value score */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart2 size={15} className="text-indigo-400" />
                  <h3 className="text-sm font-semibold text-zinc-200">Quality/Price Score</h3>
                </div>
                <span className={`text-sm font-semibold ${productValue.score >= 80 ? 'text-emerald-400' : productValue.score >= 60 ? 'text-yellow-400' : 'text-zinc-400'}`}>
                  {productValue.label}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-black gradient-text">{productValue.score}</span>
                <div className="flex-1">
                  <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${productValue.score}%` }} />
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">Compared across {allProducts.length} offers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-5">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${SOURCE_COLOR[product.source]} mb-1`}>
                {SOURCE_LABELS[product.source]}
              </p>
              <h1 className="text-2xl font-bold text-white leading-tight">{product.title}</h1>
            </div>

            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'} />
                  ))}
                </div>
                <span className="text-white font-semibold text-sm">{product.rating}</span>
                <span className="text-zinc-500 text-sm">({product.reviewCount?.toLocaleString()} reviews)</span>
              </div>
            )}

            <div className="text-4xl font-black text-white">
              ${product.price.toFixed(2)}
              <span className="text-base font-normal text-zinc-500 ml-2">USD</span>
            </div>

            {product.shipping && (
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <Truck size={15} />
                <span>{product.shipping}</span>
              </div>
            )}

            <TrustPanel trust={trust} />

            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.015]"
            >
              <ExternalLink size={16} />
              View on {SOURCE_LABELS[product.source]}
            </a>

            <p className="text-xs text-zinc-700 text-center">
              Affiliate link — Cavoser earns a commission at no extra cost to you.
            </p>
          </div>
        </div>

        {/* Comparator */}
        {topCompetitors.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 size={18} className="text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Quality/Price Comparator</h2>
            </div>
            <p className="text-zinc-500 text-sm mb-5">
              All offers ranked by our Quality/Price score — reliability, reviews and pricing combined.
            </p>

            <div className="space-y-2">
              <CompetitorRow product={product} valueScore={productValue} isCurrent={true} />
              {topCompetitors.map((comp) => (
                <CompetitorRow
                  key={comp.id}
                  product={comp}
                  valueScore={valueScores.get(comp.id) || { score: 50, label: 'Average', isBestDeal: false }}
                  isCurrent={false}
                />
              ))}
            </div>

            <div className="mt-4 p-3 bg-zinc-800/40 rounded-xl text-xs text-zinc-600 leading-relaxed">
              <span className="text-zinc-400 font-medium">Score methodology:</span> 35% product rating · 30% platform reputation · 20% review volume · 15% delivery reliability. Price is normalized across all offers.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProductPage() {
  return (
    <Suspense>
      <ProductDetailContent />
    </Suspense>
  )
}
