'use client'

import Link from 'next/link'
import { Star, Truck, Trophy, Flame, TrendingDown } from 'lucide-react'
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

// Deterministic urgency signals based on product id (consistent per product)
function getUrgencySignal(id: string): { type: 'stock' | 'views' | 'drop' | null; value: number } {
  const n = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const mod = n % 10
  if (mod < 3) return { type: 'stock', value: (n % 5) + 2 }       // "Only X left"
  if (mod < 6) return { type: 'views', value: (n % 40) + 15 }     // "X people viewing"
  if (mod < 8) return { type: 'drop', value: (n % 20) + 8 }       // "Price drop X%"
  return { type: null, value: 0 }
}

function productImage(product: Product): string {
  const seed = product.id.replace(/[^a-z0-9]/gi, '')
  return `https://picsum.photos/seed/${seed}/400/400`
}

export default function ProductCard({ product, allProducts, query, index = 0 }: {
  product: Product
  allProducts?: Product[]
  query?: string
  index?: number
}) {
  const trust = computeTrustScore(product)
  const valueScores = allProducts ? computeValueScore(allProducts) : null
  const valueScore = valueScores?.get(product.id)
  const urgency = getUrgencySignal(product.id)

  const productUrl = `/product/${encodeURIComponent(product.id)}?data=${encodeURIComponent(JSON.stringify(product))}&q=${encodeURIComponent(query || '')}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
    >
      <Link
        href={productUrl}
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
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            style={{ '--tw-scale-x': '1', '--tw-scale-y': '1' } as React.CSSProperties}
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${SOURCE_BADGE[product.source]}`}>
            {SOURCE_LABELS[product.source]}
          </span>

          {/* Urgency signal overlay */}
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

          {/* Viewing signal */}
          {urgency.type === 'views' && (
            <p className="text-xs text-amber-400/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
              {urgency.value} people viewing this
            </p>
          )}

          <h3 className="text-sm text-zinc-300 line-clamp-2 group-hover:text-white transition-colors leading-tight">
            {product.title}
          </h3>

          {/* Stars */}
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

          {/* Trust + Q/P */}
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

          {/* Price */}
          <div className="mt-auto pt-1 flex items-end justify-between">
            <div>
              <p className="text-xl font-black text-white">${product.price.toFixed(2)}</p>
              {urgency.type === 'drop' && (
                <p className="text-xs text-zinc-600 line-through">
                  ${(product.price * (1 + urgency.value / 100)).toFixed(2)}
                </p>
              )}
            </div>
            {product.shipping && (
              <div className="flex items-center gap-1 text-emerald-400">
                <Truck size={11} />
                <span className="text-xs font-medium">Free ship.</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="w-full text-center text-xs font-semibold py-2.5 rounded-xl bg-indigo-600/15 text-indigo-300 border border-indigo-500/25 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
            View best price
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
