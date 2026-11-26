import {defineLive} from 'next-sanity/live'
import {client} from './client'

const token = process.env.SANITY_API_READ_TOKEN

export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})

// The app's single 'use cache' boundary for Sanity content. sanityFetch sets
// cacheTag/cacheLife internally so <SanityLive /> can revalidate on publish.
export async function cachedFetch<const Q extends string>(
  query: Q,
  params: Record<string, string> = {},
) {
  'use cache'
  const {data} = await sanityFetch({query, params, perspective: 'published', stega: false})
  return data
}
