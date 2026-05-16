const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'
const NVIDIA_MODEL = 'google/gemma-3n-e2b-it'

export async function askNvidia(prompt: string): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) throw new Error('NVIDIA_API_KEY not set')

  const res = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.2,
      top_p: 0.7,
      stream: false,
    }),
  })

  if (!res.ok) throw new Error(`NVIDIA API error: ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

export interface AIProduct {
  title: string
  price: number
  rating: number
  reviewCount: number
  shipping: string
  imageKeywords: string   // 2-3 English keywords for image search
  productSlug: string     // URL-friendly product name for direct link
}

export async function generateProducts(query: string, source: string, count: number): Promise<AIProduct[]> {
  const sourceInfo: Record<string, string> = {
    amazon:     'Amazon.fr — official marketplace, Prime shipping, competitive pricing',
    ebay:       'eBay — new and used items, various sellers worldwide',
    aliexpress: 'AliExpress — factory-direct prices, free shipping, 15-30 days delivery',
    etsy:       'Etsy — handmade, vintage and unique artisan products',
  }

  const prompt = `Generate ${count} realistic product listings for "${query}" on ${sourceInfo[source] || source}.

Return ONLY a valid JSON array. No markdown, no explanation. Each object:
- title: string (realistic product name max 75 chars, include brand if relevant)
- price: number (realistic USD price for this platform — AliExpress cheapest, Etsy highest for handmade)
- rating: number (3.9 to 5.0, one decimal)
- reviewCount: number (realistic)
- shipping: string (platform-appropriate shipping info)
- imageKeywords: string (2-3 comma-separated English words that describe the physical product for image search, e.g. "wireless headphones black", "coffee maker stainless steel")
- productSlug: string (URL-friendly version of title, lowercase, hyphens, max 60 chars)

JSON array only:
[{"title":"...","price":0,"rating":0,"reviewCount":0,"shipping":"...","imageKeywords":"...","productSlug":"..."}]

Generate for "${query}" on ${source}:`

  try {
    const raw = await askNvidia(prompt)
    const match = raw.match(/\[[\s\S]*?\]/)
    if (!match) throw new Error('No JSON array found')
    const parsed = JSON.parse(match[0])
    return Array.isArray(parsed) ? parsed.slice(0, count) : []
  } catch {
    return []
  }
}
