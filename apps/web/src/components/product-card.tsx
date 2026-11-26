import Image from 'next/image'
import Link from 'next/link'
import {formatPrice} from '@/lib/format'
import {urlFor} from '@/sanity/image'
import type {PRODUCTS_QUERY_RESULT} from '@/sanity/types'

export type ProductCardData = PRODUCTS_QUERY_RESULT[number]

export function ProductCard({title, slug, image, price, currency, available}: ProductCardData) {
  return (
    <Link href={`/shop/${slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-foreground/5">
        {image && (
          <Image
            src={urlFor(image).width(800).height(1000).url()}
            alt={image.alt ?? ''}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        {available === 0 && (
          <span className="absolute left-3 top-3 bg-background px-2 py-1 text-xs uppercase tracking-wide">
            Sold out
          </span>
        )}
      </div>
      <div className="mt-3 flex justify-between gap-4 text-sm">
        <span>{title}</span>
        {price != null && <span className="text-muted">{formatPrice(price, currency ?? undefined)}</span>}
      </div>
    </Link>
  )
}
