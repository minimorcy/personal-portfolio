import { fetchSanity } from '@/lib/sanity'
import { POST_BY_SLUG_QUERY, POSTS_QUERY } from '@/lib/sanity-queries'
import type { Post } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { t } from '@/lib/i18n'

type Props = {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await fetchSanity<Post[]>(POSTS_QUERY) || []
  return posts.map((post) => ({ slug: post.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchSanity<Post>(POST_BY_SLUG_QUERY, {
    slug: params.slug,
  })
  if (!post) return { title: 'Post no encontrado' }
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await fetchSanity<Post>(POST_BY_SLUG_QUERY, {
    slug: params.slug,
  })
  if (!post) notFound()

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/blog"
        className="text-brand-600 dark:text-brand-400 hover:underline mb-6 inline-block"
      >
        ← {t().common.back}
      </Link>
      <article>
        {post.coverImage && (
          <Image
            src={urlFor(post.coverImage).width(800).height(400).url()}
            alt={post.title}
            width={800}
            height={400}
            className="rounded-lg mb-8 w-full object-cover"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : ''}
        </p>
        {post.body && (
          <div className="prose dark:prose-invert max-w-none">
            <PortableText value={post.body} />
          </div>
        )}
      </article>
    </main>
  )
}
