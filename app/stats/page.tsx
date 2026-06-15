import { fetchGitHub, getUsername } from '@/lib/github'
import type { Repo } from '@/types/github'
import { t } from '@/lib/i18n'
import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Estadísticas GitHub | Javier Morcillo',
  description: 'Estadísticas y actividad de GitHub.',
}

export default async function StatsPage() {
  const username = getUsername()
  let repos: Repo[] = []
  let user: { public_repos?: number; followers?: number } | null = null

  try {
    const [fetchedRepos, fetchedUser] = await Promise.all([
      fetchGitHub<Repo[]>(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
      ),
      fetchGitHub<{ public_repos?: number; followers?: number }>(
        `https://api.github.com/users/${username}`
      ),
    ])
    repos = Array.isArray(fetchedRepos) ? fetchedRepos : []
    user = fetchedUser
  } catch {
    repos = []
  }

  const totalStars = repos.reduce(
    (sum, r) => sum + (r.stargazers_count || 0),
    0
  )
  const totalForks = repos.reduce(
    (sum, r) => sum + (r.forks_count || 0),
    0
  )

  // Language breakdown
  const langCount: Record<string, number> = {}
  repos.forEach((r) => {
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1
  })
  const languages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  const maxLangCount = Math.max(...languages.map(([, c]) => c), 1)

  // Top repos by stars
  const topRepos = [...repos]
    .sort(
      (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)
    )
    .slice(0, 10)

  return (
    <section>
      <h1 className="text-3xl font-bold mb-8">{t().nav.stats}</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-brand-600">
              {user?.public_repos || repos.length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Repositorios
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-brand-600">
              {totalStars}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Estrellas
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-brand-600">
              {totalForks}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Forks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-brand-600">
              {user?.followers || 0}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Seguidores
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language breakdown */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Lenguajes</h2>
          {languages.length === 0 ? (
            <p className="text-muted-foreground">No hay datos disponibles</p>
          ) : (
            <div className="space-y-3">
              {languages.map(([lang, count]) => (
                <div key={lang}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{lang}</span>
                    <span>{count} repos</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className="bg-brand-600 dark:bg-brand-400 h-3 rounded-full transition-all duration-1000"
                      style={{
                        width: `${(count / maxLangCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top repos */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Top Repositorios
          </h2>
          <div className="space-y-2">
            {topRepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between items-center p-3 rounded hover:bg-secondary transition-colors"
              >
                <div>
                  <span className="font-medium">{repo.name}</span>
                  {repo.description && (
                    <p className="text-sm text-muted-foreground">
                      {repo.description}
                    </p>
                  )}
                </div>
                <span className="text-sm text-nowrap ml-4">
                  ⭐ {repo.stargazers_count || 0}
                </span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
