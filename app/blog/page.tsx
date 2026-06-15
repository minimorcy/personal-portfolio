import { fetchSanity } from '@/lib/sanity'
import { POSTS_QUERY } from '@/lib/sanity-queries'
import type { Post } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'
import { t } from '@/lib/i18n'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Blog | Javier Morcillo',
  description: 'Artículos sobre desarrollo web, tecnología y más.',
}

export default async function BlogPage() {
  const posts = await fetchSanity<Post[]>(POSTS_QUERY) || []

  if (!posts?.length) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">{t().nav.blog}</h1>
        <p>{t().common.coming_soon}</p>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t().nav.blog}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/blog/${post.slug.current}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {post.coverImage && (
                  <Image
                    src={urlFor(post.coverImage).width(600).height(300).url()}
                    alt={post.title}
                    width={600}
                    height={300}
                    className="rounded mb-4 object-cover w-full h-48"
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-muted-foreground mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('es-ES')
                    : ''}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
