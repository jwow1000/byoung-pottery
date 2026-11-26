import type {Metadata} from 'next'
import {ProductGrid} from '@/components/product-grid'
import {cachedFetch} from '@/sanity/live'
import {PRODUCTS_QUERY} from '@/sanity/queries'

export const metadata: Metadata = {title: 'Shop'}

export default async function ShopPage() {
  const products = await cachedFetch(PRODUCTS_QUERY)

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl">Shop</h1>
      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-muted">The shop is empty right now — check back after the next update.</p>
      )}
    </div>
  )
}
