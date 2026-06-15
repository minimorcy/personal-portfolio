import { fetchSanity } from '@/lib/sanity'
import { SOCIAL_LINKS_QUERY } from '@/lib/sanity-queries'
import type { SocialLink } from '@/types/sanity'
import { t } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default async function ContactSection() {
  const links = await fetchSanity<SocialLink[]>(SOCIAL_LINKS_QUERY) || []
  const { sections } = t()

  if (!links?.length) return null

  return (
    <section id="contacto" className="py-12 sm:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {sections.contact}
      </h2>

      <Card className="max-w-3xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            ¿Hablamos? Puedes encontrarme en:
          </p>
          <div className="flex flex-wrap gap-4">
            {links.map((link) => (
              <Button key={link._id} variant="outline" size="lg" asChild>
                <a
                  href={link.platform === 'Email' ? `mailto:${link.url}` : link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  {link.icon && (
                    <span className="w-5 h-5 flex items-center justify-center">
                      {link.icon}
                    </span>
                  )}
                  <span>{link.platform}</span>
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
