import {createClient} from '@sanity/client'
import {apiVersion, dataset, projectId} from './env'

// Server-only: never import from client components.
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  perspective: 'raw',
})
