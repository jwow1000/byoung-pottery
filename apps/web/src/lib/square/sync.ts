import {randomUUID} from 'node:crypto'
import type {Square} from 'square'
import {writeClient} from '../../sanity/write-client'
import {getStockCounts, locationId, square} from './client'

type SquareStore = {
  _type: 'squareStore'
  itemId: string
  variationId: string | null
  name: string | null
  price: number | null
  currency: string | null
  available: number | null
  status: 'active' | 'archived' | 'deleted'
  lastSyncedAt: string
}

export type SyncResult = {created: string[]; updated: number; removed: number}

/**
 * Mirrors the Square catalog into Sanity `product` documents.
 *
 * - Square item with no matching piece → new *draft* piece (the artist adds photos, then publishes).
 * - Existing piece (draft and/or published) → `store` is overwritten; editorial fields are untouched.
 * - Piece whose Square item no longer exists → `store.status` becomes "deleted".
 *
 * Safe to run repeatedly; triggered by the Square webhook and `pnpm square:sync`.
 */
export async function syncSquareCatalog(): Promise<SyncResult> {
  const now = new Date().toISOString()

  const items: Square.CatalogObject.Item[] = []
  for await (const object of await square.catalog.list({types: 'ITEM'})) {
    if (object.type === 'ITEM' && !object.isDeleted) items.push(object)
  }

  // Pieces are one variation per item; if the artist adds more in Square we use the first.
  const variations = new Map(
    items.map((item) => [
      item.id,
      item.itemData?.variations?.find(
        (v): v is Square.CatalogObject.ItemVariation => v.type === 'ITEM_VARIATION' && !v.isDeleted,
      ),
    ]),
  )
  const tracked = [...variations.values()].filter((v) => v?.itemVariationData?.trackInventory).map((v) => v!.id)
  const stock = await getStockCounts(tracked)

  const existing = await writeClient.fetch<{_id: string; itemId: string}[]>(
    `*[_type == "product" && defined(store.itemId)]{_id, "itemId": store.itemId}`,
  )
  const idsByItem = Map.groupBy(existing, (doc) => doc.itemId)

  const tx = writeClient.transaction()
  const result: SyncResult = {created: [], updated: 0, removed: 0}

  for (const item of items) {
    const variation = variations.get(item.id)
    const data = variation?.itemVariationData
    const soldOut = data?.locationOverrides?.some((o) => o.locationId === locationId && o.soldOut)
    const store: SquareStore = {
      _type: 'squareStore',
      itemId: item.id,
      variationId: variation?.id ?? null,
      name: item.itemData?.name ?? null,
      price: data?.priceMoney?.amount != null ? Number(data.priceMoney.amount) : null,
      currency: data?.priceMoney?.currency ?? null,
      available: soldOut ? 0 : data?.trackInventory ? (stock.get(variation!.id) ?? 0) : null,
      status: item.itemData?.isArchived ? 'archived' : 'active',
      lastSyncedAt: now,
    }

    const docs = idsByItem.get(item.id)
    if (docs) {
      for (const {_id} of docs) tx.patch(_id, (p) => p.set({store}))
      result.updated++
      continue
    }

    const title = item.itemData?.name ?? 'Untitled piece'
    const description = item.itemData?.descriptionPlaintext?.trim()
    tx.create({
      _id: `drafts.${randomUUID()}`,
      _type: 'product',
      title,
      slug: {_type: 'slug', current: slugify(`${title}-${item.id.slice(-4)}`)},
      ...(description && {
        description: [
          {_type: 'block', style: 'normal', markDefs: [], children: [{_type: 'span', text: description, marks: []}]},
        ],
      }),
      store,
    })
    result.created.push(title)
  }

  const liveItemIds = new Set(items.map((item) => item.id))
  for (const doc of existing) {
    if (liveItemIds.has(doc.itemId)) continue
    tx.patch(doc._id, (p) => p.set({'store.status': 'deleted', 'store.lastSyncedAt': now}))
    result.removed++
  }

  await tx.commit({autoGenerateArrayKeys: true})
  return result
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}
