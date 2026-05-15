import { Product, Source } from './types'

// Platform base trust score (0-100) based on reputation
const PLATFORM_TRUST: Record<Source, number> = {
  amazon: 88,
  ebay: 75,
  etsy: 82,
  aliexpress: 60,
}

// Platform delivery reliability
const PLATFORM_DELIVERY: Record<Source, number> = {
  amazon: 95,
  ebay: 78,
  etsy: 80,
  aliexpress: 55,
}

export interface TrustScore {
  overall: number        // 0-100
  breakdown: {
    platform: number
    rating: number
    reviews: number
    delivery: number
  }
  badge: 'Excellent' | 'Good' | 'Average' | 'Caution'
  badgeColor: string
}

export interface ValueScore {
  score: number          // 0-100
  label: string
  isBestDeal: boolean
}

export function computeTrustScore(product: Product): TrustScore {
  const platform = PLATFORM_TRUST[product.source]
  const ratingScore = product.rating ? (product.rating / 5) * 100 : 65
  const reviewsScore = product.reviewCount
    ? Math.min(100, (Math.log10(product.reviewCount + 1) / Math.log10(10000)) * 100)
    : 40
  const delivery = PLATFORM_DELIVERY[product.source]

  const overall = Math.round(
    platform * 0.3 + ratingScore * 0.35 + reviewsScore * 0.2 + delivery * 0.15
  )

  let badge: TrustScore['badge']
  let badgeColor: string
  if (overall >= 80) { badge = 'Excellent'; badgeColor = 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' }
  else if (overall >= 65) { badge = 'Good'; badgeColor = 'text-blue-400 bg-blue-400/10 border-blue-400/30' }
  else if (overall >= 50) { badge = 'Average'; badgeColor = 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' }
  else { badge = 'Caution'; badgeColor = 'text-red-400 bg-red-400/10 border-red-400/30' }

  return {
    overall,
    breakdown: {
      platform: Math.round(platform),
      rating: Math.round(ratingScore),
      reviews: Math.round(reviewsScore),
      delivery: Math.round(delivery),
    },
    badge,
    badgeColor,
  }
}

export function computeValueScore(products: Product[]): Map<string, ValueScore> {
  if (products.length === 0) return new Map()

  // Quality score per product (0-100)
  const qualityScores = products.map((p) => {
    const trust = computeTrustScore(p)
    return trust.overall
  })

  // Normalize prices (cheaper = better value if quality is acceptable)
  const prices = products.map((p) => p.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice || 1

  const rawScores = products.map((p, i) => {
    const qualityNorm = qualityScores[i] / 100
    const priceNorm = 1 - (p.price - minPrice) / priceRange // cheaper = 1
    // Weighted: 60% quality, 40% price
    return qualityNorm * 0.6 + priceNorm * 0.4
  })

  const maxRaw = Math.max(...rawScores)
  const result = new Map<string, ValueScore>()

  products.forEach((p, i) => {
    const score = Math.round((rawScores[i] / maxRaw) * 100)
    result.set(p.id, {
      score,
      label: score >= 90 ? 'Best Deal' : score >= 75 ? 'Great Value' : score >= 60 ? 'Good Value' : 'Below Average',
      isBestDeal: score === 100,
    })
  })

  return result
}
