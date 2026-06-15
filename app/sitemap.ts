import { fetchSanity } from '@/lib/sanity'
import { POSTS_QUERY, ALL_PROJECTS_QUERY } from '@/lib/sanity-queries'
import type { MetadataRoute } from 'next'

type SanitySlug = { slug: { current: string } }
type SanityItem = { _updatedAt?: string } & SanitySlug

const baseUrl = 'https://javiermorcillonuevo.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/proyectos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cv`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/stats`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ]

  // Add dynamic blog post routes
  try {
    const posts = await fetchSanity<SanityItem[]>(POSTS_QUERY) || []
    if (posts?.length) {
      for (const post of posts) {
        entries.push({
          url: `${baseUrl}/blog/${post.slug.current}`,
          lastModified: post._updatedAt ? new Date(post._updatedAt) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  } catch {
    // Sanity unavailable during build — skip dynamic blog routes
  }

  // Add dynamic project routes
  try {
    const projects = await fetchSanity<SanityItem[]>(ALL_PROJECTS_QUERY) || []
    if (projects?.length) {
      for (const project of projects) {
        entries.push({
          url: `${baseUrl}/proyectos/${project.slug.current}`,
          lastModified: project._updatedAt ? new Date(project._updatedAt) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    }
  } catch {
    // Sanity unavailable during build — skip dynamic project routes
  }

  return entries
}
