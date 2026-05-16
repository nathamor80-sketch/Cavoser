import { NextResponse } from 'next/server'

export async function GET() {
  const appId = process.env.EBAY_APP_ID
  if (!appId) return NextResponse.json({ error: 'EBAY_APP_ID not set' })

  const url = `https://svcs.ebay.com/services/search/FindingService/v1` +
    `?OPERATION-NAME=findItemsByKeywords` +
    `&SERVICE-VERSION=1.0.3` +
    `&SECURITY-APPNAME=${appId}` +
    `&RESPONSE-DATA-FORMAT=JSON` +
    `&keywords=iphone+15` +
    `&paginationInput.entriesPerPage=2` +
    `&outputSelector=GalleryInfo`

  try {
    const res = await fetch(url)
    const data = await res.json()
    const ack = data?.findItemsByKeywordsResponse?.[0]?.ack?.[0]
    const items = data?.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || []
    const error = data?.findItemsByKeywordsResponse?.[0]?.errorMessage

    return NextResponse.json({
      appIdPresent: true,
      appIdPrefix: appId.slice(0, 12),
      httpStatus: res.status,
      ack,
      itemCount: items.length,
      firstItem: items[0] ? {
        title: items[0].title?.[0],
        image: items[0].galleryURL?.[0],
        url: items[0].viewItemURL?.[0],
      } : null,
      error: error || null,
      rawResponse: data,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) })
  }
}
