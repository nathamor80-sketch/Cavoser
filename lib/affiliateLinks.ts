const AFFILIATE_IDS = {
  amazon: 'cavoserboss-21',
  ebay_campid: '5339153584',
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
        // eBay Partner Network rover link with real campaign ID
        return `https://rover.ebay.com/rover/1/709-53476-19255-0/1?ff3=4&pub=5575${AFFILIATE_IDS.ebay_campid}&toolid=10001&campid=${AFFILIATE_IDS.ebay_campid}&customid=cavoser&mpre=${encodeURIComponent(originalUrl)}`

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
