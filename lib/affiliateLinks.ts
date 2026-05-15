// Replace these with your real affiliate IDs after registration
const AFFILIATE_IDS = {
  amazon: 'cavoser-21',      // Amazon Associates tag
  ebay: 'cavoser',           // eBay Partner Network campaign ID
  aliexpress: 'YOUR_ALI_ID',   // AliExpress affiliate ID
  etsy: 'YOUR_ETSY_ID',        // Etsy affiliate ID
}

export function buildAffiliateUrl(originalUrl: string, source: string): string {
  try {
    const url = new URL(originalUrl)
    switch (source) {
      case 'amazon':
        url.searchParams.set('tag', AFFILIATE_IDS.amazon)
        return url.toString()
      case 'ebay':
        return `https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&pub=5575${AFFILIATE_IDS.ebay}&toolid=10001&campid=5338722076&customid=&lgeo=1&vectorid=229466&item=${url.pathname.split('/').pop()}&destUrl=${encodeURIComponent(originalUrl)}`
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
