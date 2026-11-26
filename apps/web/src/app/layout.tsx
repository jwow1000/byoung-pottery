import type {Metadata} from 'next'
import {Fraunces, Geist} from 'next/font/google'
import {Suspense} from 'react'
import {SiteHeader} from '@/components/site-header'
import {SanityLive} from '@/sanity/live'
import './globals.css'

const geistSans = Geist({variable: '--font-geist-sans', subsets: ['latin']})
const fraunces = Fraunces({variable: '--font-fraunces', subsets: ['latin']})

export const metadata: Metadata = {
  title: {default: 'BYoung Pottery', template: '%s · BYoung Pottery'},
  description: 'Handmade ceramics',
}

export default function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
        <Suspense>
          <SanityLive />
        </Suspense>
      </body>
    </html>
  )
}
