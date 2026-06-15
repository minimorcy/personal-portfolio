import { fetchSanity, urlFor } from '@/lib/sanity'
import { EDUCATION_QUERY } from '@/lib/sanity-queries'
import type { Education } from '@/types/sanity'
import { Card, CardContent } from '@/components/ui/card'
import { t } from '@/lib/i18n'
import Image from 'next/image'

export default async function EducationSection() {
  const education = await fetchSanity<Education[]>(EDUCATION_QUERY) || []
  const { sections } = t()

  if (!education?.length) return null

  return (
    <section id="educacion" className="py-12 sm:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {sections.education}
      </h2>

      <div className="grid gap-6">
        {education.map((edu) => (
          <Card key={edu._id}>
            <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
              {/* Institution logo */}
              {edu.logo && (
                <div className="shrink-0">
                  <Image
                    src={urlFor(edu.logo).width(80).height(80).url()}
                    alt={edu.institution}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}

              {/* Details */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {edu.degree}
                </h3>
                <p className="text-brand-600 dark:text-brand-400 font-medium">
                  {edu.institution}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {edu.startDate && new Date(edu.startDate).getFullYear()}
                  {' — '}
                  {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Presente'}
                </p>
                {edu.description && (
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
