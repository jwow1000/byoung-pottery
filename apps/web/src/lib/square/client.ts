import {SquareClient, SquareEnvironment} from 'square'

export const square = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.SQUARE_ENVIRONMENT === 'production'
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
})

export const locationId = process.env.SQUARE_LOCATION_ID!

/** Units IN_STOCK at our location, keyed by variation ID. */
export async function getStockCounts(variationIds: string[]) {
  const counts = new Map<string, number>()
  if (!variationIds.length) return counts

  const page = await square.inventory.batchGetCounts({
    catalogObjectIds: variationIds,
    locationIds: [locationId],
    states: ['IN_STOCK'],
  })
  for await (const count of page) {
    if (!count.catalogObjectId) continue
    counts.set(count.catalogObjectId, (counts.get(count.catalogObjectId) ?? 0) + Number(count.quantity ?? 0))
  }
  return counts
}
