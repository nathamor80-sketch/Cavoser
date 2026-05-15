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
      max_tokens: 1024,
      temperature: 0.25,
      top_p: 0.70,
      stream: false,
    }),
  })

  if (!res.ok) throw new Error(`NVIDIA API error: ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

interface AIProduct {
  title: string
  price: number
  description: string
  rating: number
  reviewCount: number
  shipping: string
  keywords: string
}

export async function generateProducts(query: string, source: string, count: number): Promise<AIProduct[]> {
  const sourceDescriptions: Record<string, string> = {
    amazon:     'Amazon.fr (official, fast Prime shipping, trusted seller)',
    ebay:       'eBay (new or used items, various sellers)',
    aliexpress: 'AliExpress (factory-direct, low prices, 15-30 day shipping)',
    etsy:       'Etsy (handmade, artisan, unique items)',
  }

  const prompt = `You are a product database. Generate ${count} realistic product listings for the search query "${query}" on ${sourceDescriptions[source] || source}.

Return ONLY a valid JSON array, no explanation, no markdown. Each object must have:
- title: string (realistic product name, max 80 chars)
- price: number (realistic price in USD for this platform)
- description: string (2 sentences about the product features)
- rating: number (between 3.8 and 5.0)
- reviewCount: number (realistic review count)
- shipping: string (shipping info for this platform)
- keywords: string (2-3 comma-separated English keywords for an image search)

Example format:
[{"title":"...","price":29.99,"description":"...","rating":4.5,"reviewCount":1243,"shipping":"Free Prime shipping","keywords":"keyword1,keyword2"}]

Generate ${count} products now for query "${query}" on ${source}:`

  try {
    const raw = await askNvidia(prompt)
    // Extract JSON array from response
    const match = raw.match(/\[[\s\S]*\]/)
    if (!match) throw new Error('No JSON array found')
    const parsed = JSON.parse(match[0])
    return Array.isArray(parsed) ? parsed.slice(0, count) : []
  } catch {
    return []
  }
}
