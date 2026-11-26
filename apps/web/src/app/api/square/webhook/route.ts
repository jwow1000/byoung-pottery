import {after, type NextRequest} from 'next/server'
import {WebhooksHelper} from 'square'
import {syncSquareCatalog} from '@/lib/square/sync'

const SYNC_EVENTS = new Set(['catalog.version.updated', 'inventory.count.updated'])

// Square → Sanity. Subscribe to the events above in the Square Developer
// Console with SQUARE_WEBHOOK_URL as the notification URL.
export async function POST(req: NextRequest) {
  const body = await req.text()
  const isValid = await WebhooksHelper.verifySignature({
    requestBody: body,
    signatureHeader: req.headers.get('x-square-hmacsha256-signature') ?? '',
    signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
    notificationUrl: process.env.SQUARE_WEBHOOK_URL!,
  })
  if (!isValid) return new Response('Invalid signature', {status: 403})

  const {type} = JSON.parse(body) as {type?: string}
  if (type && SYNC_EVENTS.has(type)) {
    // Respond immediately; Square retries if we take longer than 10s.
    after(async () => {
      const result = await syncSquareCatalog()
      console.log(`[square] ${type}: synced`, result)
    })
  }

  return new Response('ok')
}
