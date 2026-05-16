const AFFILIATE_IDS = {
  amazon: 'cavoserboss-21',
  aliexpress: 'YOUR_ALI_ID',
}

export function buildAffiliateUrl(originalUrl: string, source: string): string {
  try {
    const url = new URL(originalUrl)
    switch (source) {
      case 'amazon':
        url.searchParams.set('tag', AFFILIATE_IDS.amazon)
        return url.toString()

      case 'ebay':
        // Direct link to the eBay product page — no broken rover
        return originalUrl

      case 'aliexpress':
        url.searchParams.set('aff_fcid', AFFILIATE_IDS.aliexpress)
        return url.toString()

      default:
        return originalUrl
    }
  } catch {
    return originalUrl
  }
}
