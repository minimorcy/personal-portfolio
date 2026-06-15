import { fetchSanity, urlFor } from '@/lib/sanity'
import { fetchGitHub, getUsername } from '@/lib/github'
import { PROFILE_QUERY, SKILLS_QUERY } from '@/lib/sanity-queries'
import { t } from '@/lib/i18n'
import { SITE_NAME } from '@/lib/design-tokens'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Profile, Skill } from '@/types/sanity'
import type { Metadata } from 'next'
import Image from 'next/image'
import ExperienceSection from '@/components/sections/experience'
import EducationSection from '@/components/sections/education'
import SkillsSection from '@/components/sections/skills'
import ContactSection from '@/components/sections/contact'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const username = getUsername()
  return {
    title: `${SITE_NAME} | Portfolio`,
    description: `Portfolio profesional de ${SITE_NAME} — Desarrollador Full-Stack`,
  }
}

interface GitHubStats {
  public_repos: number
  followers: number
}

export default async function HomePage() {
  const translations = t()

  // Fetch Sanity data in parallel
  const [profile, skills] = await Promise.all([
    fetchSanity<Profile | null>(PROFILE_QUERY),
    fetchSanity<Skill[]>(SKILLS_QUERY).then(r => r || []),
  ])

  // Fetch GitHub stats
  let githubStats: GitHubStats | null = null
  const username = getUsername()
  try {
    const [repos, user] = await Promise.all([
      fetchGitHub<any[]>(`https://api.github.com/users/${username}/repos?per_page=1`),
      fetchGitHub<any>(`https://api.github.com/users/${username}`),
    ])
    githubStats = {
      public_repos: user?.public_repos ?? 0,
      followers: user?.followers ?? 0,
    }
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
  }

  // Fallback if Sanity has no data
  if (!profile) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">Configurando portfolio...</p>
      </main>
    )
  }

  const avatarUrl = profile.avatar
    ? urlFor(profile.avatar).width(128).height(128).fit('crop').url()
    : null

  const topSkills = Array.isArray(skills) ? skills.slice(0, 8) : []

  return (
    <main className="max-w-5xl mx-auto px-4">
      {/* Hero Section */}
      <section className="animate-slide-up flex flex-col md:flex-row items-center gap-8 md:gap-12 py-16 md:py-24 border-b border-gray-200 dark:border-gray-800">
        {/* Avatar */}
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt={profile.name || username}
            width={128}
            height={128}
            className="w-28 h-28 md:w-36 md:h-36 rounded-full ring-4 ring-brand-200 dark:ring-brand-800 shadow-lg object-cover"
            priority
          />
        )}

        {/* Info */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
            {profile.name || username}
          </h1>
          {profile.title && (
            <p className="mt-2 text-lg text-brand-600 dark:text-brand-400 font-medium">
              {profile.title}
            </p>
          )}
          {profile.bio && (
            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
              {profile.bio}
            </p>
          )}
          {profile.location && (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">
              📍 {profile.location}
            </p>
          )}

          {/* GitHub Stats Teaser */}
          {githubStats && (
            <div className="mt-6 flex gap-6 justify-center md:justify-start">
              <a href="/stats" className="text-center hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                <span className="block text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {githubStats.public_repos}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-500">Repositorios</span>
              </a>
              <a href="/stats" className="text-center hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                <span className="block text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {githubStats.followers}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-500">Seguidores</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Skills Preview */}
      {topSkills.length > 0 && (
        <section className="animate-fade-in py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            {translations.sections.skills}
          </h2>
          <div className="flex flex-wrap gap-2">
            {topSkills.map((skill) => (
              <Badge
                key={skill._id}
                variant="secondary"
                className="text-sm px-3 py-1"
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      <ExperienceSection />

      {/* Skills Section (detail) */}
      <SkillsSection />

      {/* Education Section */}
      <EducationSection />

      {/* CTA Buttons */}
      <section className="animate-slide-up py-12 flex flex-wrap gap-4 justify-center md:justify-start">
        <Button asChild size="lg">
          <a href="/proyectos">{translations.hero.cta_projects}</a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="/cv">{translations.hero.cta_cv}</a>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <a href="#contacto">{translations.hero.cta_contact}</a>
        </Button>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </main>
  )
}
