import type {Metadata} from 'next'
import Image from 'next/image'
import {PortableText} from '@/components/portable-text'
import {urlFor} from '@/sanity/image'
import {cachedFetch} from '@/sanity/live'
import {ABOUT_QUERY} from '@/sanity/queries'

export const metadata: Metadata = {title: 'About'}

export default async function AboutPage() {
  const about = await cachedFetch(ABOUT_QUERY)

  return (
    <div className="space-y-10">
      <h1 className="text-center font-serif text-xl">{about?.heading ?? 'About'}</h1>
      <div className="grid gap-10 md:grid-cols-[2fr_3fr]">
        {about?.portrait && (
          <Image
            src={urlFor(about.portrait).width(900).height(1200).url()}
            alt={about.portrait.alt ?? ''}
            width={900}
            height={1200}
            className="h-auto w-full"
          />
        )}
        <div className="space-y-8">
          {about?.bio && <PortableText value={about.bio} />}
          {about?.artistStatement && (
            <section className="space-y-4">
              <h2 className="font-serif text-2xl">Artist statement</h2>
              <PortableText value={about.artistStatement} />
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
