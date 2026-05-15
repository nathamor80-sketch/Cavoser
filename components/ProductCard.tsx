import Link from 'next/link'
import { Star, Truck, Trophy } from 'lucide-react'
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

// High-quality Unsplash images by keyword
function productImage(product: Product): string {
  const keywords: Record<string, string> = {
    amazon:     'product,technology',
    ebay:       'vintage,collectible',
    aliexpress: 'electronics,gadget',
    etsy:       'handmade,artisan',
  }
  const seed = product.id.replace(/[^a-z0-9]/gi, '')
  return `https://picsum.photos/seed/${seed}/400/400`
}

export default function ProductCard({ product, allProducts, query }: {
  product: Product
  allProducts?: Product[]
  query?: string
}) {
  const trust = computeTrustScore(product)
  const valueScores = allProducts ? computeValueScore(allProducts) : null
  const valueScore = valueScores?.get(product.id)

  const productUrl = `/product/${encodeURIComponent(product.id)}?data=${encodeURIComponent(JSON.stringify(product))}&q=${encodeURIComponent(query || '')}`

  return (
    <Link
      href={productUrl}
      className="card-hover group flex flex-col bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden relative"
    >
      {valueScore?.isBestDeal && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
          <Trophy size={10} />
          Best
        </div>
      )}

      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        <img
          src={productImage(product)}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full border ${SOURCE_BADGE[product.source]}`}>
          {SOURCE_LABELS[product.source]}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <h3 className="text-sm text-zinc-300 line-clamp-2 group-hover:text-white transition-colors leading-tight">
          {product.title}
        </h3>

        {product.rating && (
          <div className="flex items-center gap-1">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-zinc-300 font-medium">{product.rating}</span>
            <span className="text-xs text-zinc-600">({product.reviewCount?.toLocaleString()})</span>
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-1.5 py-0.5 rounded border ${trust.badgeColor}`}>
            {trust.badge} · {trust.overall}/100
          </span>
          {valueScore && (
            <span className={`text-xs font-semibold ${valueScore.score >= 80 ? 'text-emerald-400' : valueScore.score >= 60 ? 'text-yellow-400' : 'text-zinc-500'}`}>
              Q/P {valueScore.score}
            </span>
          )}
        </div>

        <div className="mt-auto pt-1 flex items-end justify-between">
          <p className="text-lg font-bold text-white">${product.price.toFixed(2)}</p>
          {product.shipping && (
            <div className="flex items-center gap-1 text-emerald-400">
              <Truck size={11} />
              <span className="text-xs">Free</span>
            </div>
          )}
        </div>

        <div className="w-full text-center text-xs font-medium py-2 rounded-lg bg-indigo-600/15 text-indigo-300 border border-indigo-500/25 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors">
          View product
        </div>
      </div>
    </Link>
  )
}
