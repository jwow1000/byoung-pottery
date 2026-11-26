import Link from 'next/link'
import {cachedFetch} from '@/sanity/live'
import {SETTINGS_QUERY} from '@/sanity/queries'

export async function SiteHeader() {
  const settings = await cachedFetch(SETTINGS_QUERY)

  return (
    <header className="border-b border-foreground/10">
      {settings?.shopAnnouncement && (
        <p className="bg-accent px-4 py-2 text-center text-sm text-white">{settings.shopAnnouncement}</p>
      )}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="font-serif text-2xl">
          {settings?.title ?? 'BYOUNG POTTERY'} 
        </Link>
        <ul className="flex gap-6 text-sm">
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>
      </nav>
    </header>
  )
}
