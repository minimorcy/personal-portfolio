import {createClient, type ClientConfig} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

if (!PROJECT_ID) {
  console.warn(
    'NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Sanity client will use a placeholder.'
  )
}

const config: ClientConfig = {
  projectId: PROJECT_ID || 'your-project-id',
  dataset: DATASET,
  apiVersion: '2026-06-07',
  useCdn: process.env.NODE_ENV === 'production',
}

export const sanityClient = createClient(config)

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export async function fetchSanity<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T> {
  try {
    return await sanityClient.fetch<T>(query, params ?? {})
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return (null as unknown) as T
  }
}
