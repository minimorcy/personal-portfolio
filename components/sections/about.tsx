import { fetchSanity } from '@/lib/sanity'
import { PROFILE_QUERY, SOCIAL_LINKS_QUERY } from '@/lib/sanity-queries'
import type { Profile, SocialLink } from '@/types/sanity'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { t } from '@/lib/i18n'

export default async function AboutSection() {
  const profile = await fetchSanity<Profile>(PROFILE_QUERY)
  const socialLinks = await fetchSanity<SocialLink[]>(SOCIAL_LINKS_QUERY) || []

  const { sections } = t()

  // Hide section entirely if no profile data
  if (!profile) return null

  const hasContent = profile.bio || profile.location || (socialLinks?.length ?? 0) > 0
  if (!hasContent) return null

  return (
    <section id="sobre-mi" className="py-12 sm:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {sections.about}
      </h2>

      <Card className="max-w-3xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Extended bio */}
          {profile.bio && (
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
          )}

          {/* Location badge */}
          {profile.location && (
            <Badge variant="secondary" className="inline-flex items-center gap-1.5 text-sm px-3 py-1">
              <span role="img" aria-label="location">📍</span>
              <span>{profile.location}</span>
            </Badge>
          )}

          {/* Social links */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <Button key={link._id} variant="outline" size="sm" asChild>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    {link.icon && (
                      <span className="w-4 h-4 flex items-center justify-center">
                        {link.icon}
                      </span>
                    )}
                    <span>{link.platform}</span>
                  </a>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
