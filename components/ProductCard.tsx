'use client'

import { Star, Truck, Trophy, Flame, TrendingDown, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product } from '@/lib/types'
import { computeTrustScore, computeValueScore } from '@/lib/scoring'

const SOURCE_BADGE: Record<string, string> = {
  amazon:     'bg-orange-500/15 text-orange-300 border-orange-500/25',
  ebay:       'bg-blue-500/15 text-blue-300 border-blue-500/25',
  aliexpress: 'bg-red-500/15 text-red-300 border-red-500/25',
  etsy:       'bg-amber-500/15 text-amber-300 border-amber-500/25',
}
const SOURCE_LABELS: Record<string, string> = {
  amazon: 'Amazon', ebay: 'eBay', aliexpress: 'AliExpress', etsy: 'Etsy',
}

// Build affiliate-wrapped external URL
function buildExternalUrl(product: Product): string {
  const raw = product.url
  if (!raw) return '#'

  if (product.source === 'ebay') {
    // eBay rover affiliate link → direct product page
    return `https://rover.ebay.com/rover/1/709-53476-19255-0/1?ff3=4&pub=55755339153584&toolid=10001&campid=5339153584&customid=cavoser&mpre=${encodeURIComponent(raw)}`
  }
  // Amazon already has tag in URL from route.ts
  // AliExpress / Etsy: direct link
  return raw
}

// Urgency signals — deterministic per product id
function getUrgencySignal(id: string): { type: 'stock' | 'views' | 'drop' | null; value: number } {
  const n = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const mod = n % 10
  if (mod < 3) return { type: 'stock', value: (n % 5) + 2 }
  if (mod < 6) return { type: 'views', value: (n % 40) + 15 }
  if (mod < 8) return { type: 'drop', value: (n % 20) + 8 }
  return { type: null, value: 0 }
}

// Best image available for a product
function productImage(product: Product): string {
  // Real eBay images from ebayimg.com — use directly
  if (
    product.image &&
    product.image.startsWith('http') &&
    !product.image.includes('loremflickr') &&
    !product.image.includes('picsum') &&
    product.image.includes('ebayimg')
  ) {
    return product.image
  }

  // Reliable placeholder with consistent seed per product
  const seed = product.id.replace(/[^a-z0-9]/gi, '').slice(0, 12) || 'product'
  return `https://picsum.photos/seed/${seed}/400/400`
}

export default function ProductCard({ product, allProducts, index = 0 }: {
  product: Product
  allProducts?: Product[]
  query?: string
  index?: number
}) {
  const trust = computeTrustScore(product)
  const valueScores = allProducts ? computeValueScore(allProducts) : null
  const valueScore = valueScores?.get(product.id)
  const urgency = getUrgencySignal(product.id)
  const externalUrl = buildExternalUrl(product)

  const isAmazon = product.source === 'amazon'
  const ctaLabel = isAmazon && product.price === 0
    ? 'Rechercher sur Amazon'
    : product.source === 'ebay'
    ? 'Voir sur eBay'
    : product.source === 'aliexpress'
    ? 'Voir sur AliExpress'
    : product.source === 'etsy'
    ? 'Voir sur Etsy'
    : 'View best price'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' as const }}
    >
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden relative transition-all duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] hover:-translate-y-1"
      >
        {/* Best deal badge */}
        {valueScore?.isBestDeal && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg shadow-emerald-500/30">
            <Trophy size={10} />
            Best deal
          </div>
        )}

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-zinc-800">
          <img
            src={productImage(product)}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback if image fails
              const seed = product.id.replace(/[^a-z0-9]/gi, '').slice(0, 12) || 'product'
              ;(e.target as HTMLImageElement).src = `https://picsum.photos/seed/${seed}/400/400`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${SOURCE_BADGE[product.source]}`}>
            {SOURCE_LABELS[product.source]}
          </span>

          {urgency.type === 'stock' && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              <Flame size={10} />
              Only {urgency.value} left
            </div>
          )}
          {urgency.type === 'drop' && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              <TrendingDown size={10} />
              -{urgency.value}% today
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-3 gap-1.5">

          {urgency.type === 'views' && (
            <p className="text-xs text-amber-400/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
              {urgency.value} people viewing this
            </p>
          )}

          <h3 className="text-sm text-zinc-300 line-clamp-2 group-hover:text-white transition-colors leading-tight">
            {product.title}
          </h3>

          {product.rating && (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={10} className={i < Math.floor(product.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700 fill-zinc-700'} />
                ))}
              </div>
              <span className="text-xs text-zinc-300 font-medium">{product.rating}</span>
              <span className="text-xs text-zinc-600">({product.reviewCount?.toLocaleString()})</span>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-1.5 py-0.5 rounded border ${trust.badgeColor}`}>
              {trust.badge} {trust.overall}/100
            </span>
            {valueScore && (
              <span className={`text-xs font-semibold ${valueScore.score >= 80 ? 'text-emerald-400' : valueScore.score >= 60 ? 'text-yellow-400' : 'text-zinc-500'}`}>
                Q/P {valueScore.score}
              </span>
            )}
          </div>

          <div className="mt-auto pt-1 flex items-end justify-between">
            <div>
              {product.price === 0 ? (
                <p className="text-sm font-bold text-orange-400">Voir sur Amazon</p>
              ) : (
                <>
                  <p className="text-xl font-black text-white">${product.price.toFixed(2)}</p>
                  {urgency.type === 'drop' && (
                    <p className="text-xs text-zinc-600 line-through">
                      ${(product.price * (1 + urgency.value / 100)).toFixed(2)}
                    </p>
                  )}
                </>
              )}
            </div>
            {product.shipping && (
              <div className="flex items-center gap-1 text-emerald-400">
                <Truck size={11} />
                <span className="text-xs font-medium">Free ship.</span>
              </div>
            )}
          </div>

          <div className={`w-full text-center text-xs font-semibold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
            isAmazon && product.price === 0
              ? 'bg-orange-500/15 text-orange-300 border border-orange-500/25 group-hover:bg-orange-500 group-hover:text-white group-hover:border-transparent'
              : 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/25 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white group-hover:border-transparent'
          }`}>
            {ctaLabel}
            <ExternalLink size={10} />
          </div>
        </div>
      </a>
    </motion.div>
  )
}
