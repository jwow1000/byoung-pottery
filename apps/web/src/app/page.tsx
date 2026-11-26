import Image from 'next/image'
import Link from 'next/link'
import {ProductGrid} from '@/components/product-grid'
import {urlFor} from '@/sanity/image'
import {cachedFetch} from '@/sanity/live'
import {SETTINGS_QUERY, UPCOMING_EXHIBITIONS_QUERY} from '@/sanity/queries'

export default async function HomePage() {
  const [settings, exhibitions] = await Promise.all([
    cachedFetch(SETTINGS_QUERY),
    cachedFetch(UPCOMING_EXHIBITIONS_QUERY),
  ])

  return (
    <div className="space-y-20">
      <section className="space-y-6">
        {settings?.heroImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={urlFor(settings.heroImage).width(2000).height(1125).url()}
              alt={settings.heroImage.alt ?? ''}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}
        {settings?.tagline && <p className="font-serif text-3xl sm:text-4xl">{settings.tagline}</p>}
      </section>

      {!!settings?.featuredProducts?.length && (
        <section className="space-y-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl">Featured pieces</h2>
            <Link href="/shop" className="text-sm underline underline-offset-4">Shop all</Link>
          </div>
          <ProductGrid products={settings.featuredProducts} />
        </section>
      )}

      {!!exhibitions.length && (
        <section className="space-y-4">
          <h2 className="font-serif text-2xl">Upcoming shows & markets</h2>
          <ul className="divide-y divide-foreground/10">
            {exhibitions.map((show) => (
              <li key={show._id} className="flex flex-wrap justify-between gap-2 py-3">
                <span>
                  {show.url ? <a href={show.url} className="underline underline-offset-4">{show.title}</a> : show.title}
                  {show.venue && <span className="text-muted"> — {show.venue}</span>}
                </span>
                <span className="text-sm text-muted">
                  {show.startDate}
                  {show.endDate && show.endDate !== show.startDate && ` – ${show.endDate}`}
                  {show.location && ` · ${show.location}`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
