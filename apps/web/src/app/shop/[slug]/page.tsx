import type {Metadata} from 'next'
import Image from 'next/image'
import {notFound} from 'next/navigation'
import {buyNow} from '@/app/actions'
import {PortableText} from '@/components/portable-text'
import {formatPrice} from '@/lib/format'
import {urlFor} from '@/sanity/image'
import {cachedFetch} from '@/sanity/live'
import {PRODUCT_QUERY, PRODUCT_SLUGS_QUERY} from '@/sanity/queries'
import type {PRODUCT_QUERY_RESULT} from '@/sanity/types'

export async function generateStaticParams() {
  return cachedFetch(PRODUCT_SLUGS_QUERY)
}

export async function generateMetadata({params}: PageProps<'/shop/[slug]'>): Promise<Metadata> {
  const product = await cachedFetch(PRODUCT_QUERY, await params)
  return {
    title: product?.seo?.title ?? product?.title,
    description: product?.seo?.description,
  }
}

export default async function ProductPage({params}: PageProps<'/shop/[slug]'>) {
  const product = await cachedFetch(PRODUCT_QUERY, await params)
  if (!product) notFound()

  const {dimensions} = product
  const details = [
    ['Clay', product.clayBody],
    ['Glaze', product.glaze],
    ['Height', dimensions?.height && `${dimensions.height}″`],
    ['Width', dimensions?.width && `${dimensions.width}″`],
    ['Capacity', dimensions?.capacity],
  ].filter((row): row is [string, string] => !!row[1])

  return (
    <article className="grid gap-10 md:grid-cols-2">
      <div className="space-y-4">
        {product.images?.map((image) => (
          <Image
            key={image._key}
            src={urlFor(image).width(1200).url()}
            alt={image.alt ?? ''}
            width={1200}
            height={1500}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="h-auto w-full"
          />
        ))}
      </div>

      <div className="space-y-6 md:sticky md:top-10 md:self-start">
        <h1 className="font-serif text-4xl">{product.title}</h1>
        <BuyBox store={product.store} />
        {product.description && <PortableText value={product.description} />}
        {!!details.length && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
            {details.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-muted">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  )
}

function BuyBox({store}: {store: NonNullable<PRODUCT_QUERY_RESULT>['store']}) {
  if (!store?.variationId || store.price == null || store.status !== 'active') return null

  const soldOut = store.available === 0
  return (
    <form action={buyNow} className="space-y-3">
      <p className="text-xl">{formatPrice(store.price, store.currency ?? undefined)}</p>
      <input type="hidden" name="variationId" value={store.variationId} />
      <button
        type="submit"
        disabled={soldOut}
        className="w-full bg-foreground px-6 py-3 text-background transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        {soldOut ? 'Sold out' : 'Buy now'}
      </button>
    </form>
  )
}
