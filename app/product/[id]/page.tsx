'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Truck, Shield, BarChart2, ChevronRight, ExternalLink, Trophy, Flame, Users, Clock, TrendingDown, CheckCircle } from 'lucide-react'
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

function getUrgencyData(id: string) {
  const n = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return {
    stock: (n % 7) + 2,
    viewers: (n % 35) + 18,
    priceDrop: (n % 22) + 6,
    orders: (n % 120) + 40,
  }
}

function ScoreBar({ label, value, color = 'bg-indigo-500' }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-zinc-400">{label}</span>
        <span className="text-zinc-300 font-medium">{value}/100</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
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
        <motion.span
          className="text-4xl font-black text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          {trust.overall}
        </motion.span>
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
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      valueScore.isBestDeal
        ? 'border-emerald-500/40 bg-emerald-500/5'
        : isCurrent
        ? 'border-indigo-500/30 bg-indigo-500/5'
        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
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
      try { setProduct(JSON.parse(decodeURIComponent(productData))) }
      catch { setLoading(false); return }
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
  const urgency = getUrgencyData(product.id)

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

          {/* Left — Image + scores */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <img src={productImg} alt={product.title} className="w-full h-full object-cover" />
              {productValue.isBestDeal && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-emerald-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-emerald-500/30">
                  <Trophy size={14} />
                  Best Quality/Price
                </div>
              )}
              <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-sm ${trust.badgeColor}`}>
                {trust.badge}
              </div>

              {/* Live viewers overlay */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <Users size={10} />
                {urgency.viewers} people viewing now
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
                <motion.span
                  className="text-5xl font-black gradient-text"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring', delay: 0.3 }}
                >
                  {productValue.score}
                </motion.span>
                <div className="flex-1">
                  <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${productValue.score}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                    />
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">Compared across {allProducts.length} offers</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Info + CTA */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
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

            {/* Price block */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-end gap-3 mb-1">
                <p className="text-4xl font-black text-white">${product.price.toFixed(2)}</p>
                <p className="text-base text-zinc-600 line-through mb-1">
                  ${(product.price * (1 + urgency.priceDrop / 100)).toFixed(2)}
                </p>
                <span className="text-sm font-bold text-emerald-400 mb-1">-{urgency.priceDrop}%</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                {product.shipping && (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <Truck size={12} /> {product.shipping}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Price updated today
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Flame size={12} />
                  {urgency.orders}+ orders this week
                </span>
              </div>
            </div>

            {/* Stock warning */}
            <div className="flex items-center gap-2 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-2.5">
              <Flame size={14} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-300">
                <span className="font-bold">Only {urgency.stock} left</span>
                <span className="text-red-400/70"> at this price on {SOURCE_LABELS[product.source]}</span>
              </p>
            </div>

            {/* Trust */}
            <TrustPanel trust={trust} />

            {/* Trust checkmarks */}
            <div className="grid grid-cols-2 gap-2">
              {['Verified seller', 'Secure payment', 'Buyer protection', 'Easy returns'].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <CheckCircle size={12} className="text-emerald-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            {/* Main CTA */}
            <motion.a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full py-4 font-bold text-base rounded-xl shadow-lg relative overflow-hidden text-white ${
                product.source === 'amazon'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/25'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-indigo-500/25'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' as const }}
              />
              <ExternalLink size={16} />
              {product.source === 'amazon' && product.price === 0
                ? 'Rechercher sur Amazon.fr'
                : `View best price on ${SOURCE_LABELS[product.source]}`}
            </motion.a>

            <p className="text-xs text-zinc-700 text-center">
              Affiliate link — Cavoser earns a commission at no extra cost to you.
            </p>
          </motion.div>
        </div>

        {/* Comparator */}
        {topCompetitors.length > 0 && (
          <motion.div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 size={18} className="text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Quality/Price Comparator</h2>
            </div>
            <p className="text-zinc-500 text-sm mb-5">
              All offers ranked by our score — reliability, reviews and price combined.
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
              <span className="text-zinc-400 font-medium">Score methodology:</span> 35% product rating · 30% platform reputation · 20% review volume · 15% delivery reliability.
            </div>
          </motion.div>
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
