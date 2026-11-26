'use server'

import {randomUUID} from 'node:crypto'
import {redirect} from 'next/navigation'
import {getStockCounts, locationId, square} from '@/lib/square/client'

/**
 * Creates a Square-hosted checkout for a single piece and redirects to it.
 * Square prices the order from its catalog, so the client can't tamper with it.
 */
export async function buyNow(formData: FormData) {
  const variationId = formData.get('variationId')
  if (typeof variationId !== 'string' || !variationId) throw new Error('Missing variation')

  // Synced stock can lag a few seconds behind Square; check live before checkout.
  const {object} = await square.catalog.object.get({objectId: variationId})
  if (object?.type !== 'ITEM_VARIATION') throw new Error('Unknown piece')
  if (object.itemVariationData?.trackInventory) {
    const stock = await getStockCounts([variationId])
    if (!stock.get(variationId)) redirect('/shop?soldOut=1')
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const {paymentLink} = await square.checkout.paymentLinks.create({
    idempotencyKey: randomUUID(),
    order: {
      locationId,
      lineItems: [{catalogObjectId: variationId, quantity: '1'}],
    },
    checkoutOptions: {
      redirectUrl: `${siteUrl}/checkout/success`,
      askForShippingAddress: true,
    },
  })

  if (!paymentLink?.url) throw new Error('Square did not return a checkout URL')
  redirect(paymentLink.url)
}
