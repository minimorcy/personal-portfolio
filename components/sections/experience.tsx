import { fetchSanity, urlFor } from '@/lib/sanity'
import { EXPERIENCES_QUERY } from '@/lib/sanity-queries'
import type { Experience } from '@/types/sanity'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { t } from '@/lib/i18n'
import Image from 'next/image'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric' }).format(date)
}

export default async function ExperienceSection() {
  const experiences = await fetchSanity<Experience[]>(EXPERIENCES_QUERY) || []
  const { sections } = t()

  if (!Array.isArray(experiences) || experiences.length === 0) return null

  return (
    <section id="experiencia" className="py-12 sm:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {sections.experience}
      </h2>

      <div className="space-y-8">
        {experiences.map((exp, i) => {
          const logoUrl = exp.logo
            ? urlFor(exp.logo).width(64).height(64).fit('crop').url()
            : null

          const startDate = exp.startDate ? formatDate(exp.startDate) : ''
          const endDate = exp.endDate ? formatDate(exp.endDate) : 'Actualidad'
          const dateRange = startDate ? `${startDate} — ${endDate}` : ''

          return (
            <div
              key={exp._id}
              className="animate-slide-up opacity-0"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex gap-4 sm:gap-6">
                {/* Timeline line + dot */}
                <div className="relative flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-brand-600 dark:bg-brand-400 ring-4 ring-brand-100 dark:ring-brand-900 z-10 mt-2" />
                  {i < experiences.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700" />
                  )}
                </div>

                {/* Content card */}
                <Card className="flex-1">
                  <CardContent className="p-4 sm:p-6 space-y-3">
                    {/* Header: logo + role + company */}
                    <div className="flex items-start gap-3">
                      {logoUrl && (
                        <Image
                          src={logoUrl}
                          alt={exp.company}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {exp.role}
                        </h3>
                        <p className="text-brand-600 dark:text-brand-400 font-medium">
                          {exp.company}
                        </p>
                        {dateRange && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">
                            {dateRange}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {exp.description && (
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}

                    {/* Tech badges */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
