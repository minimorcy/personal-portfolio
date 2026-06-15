'use client'

import { useState, useEffect } from 'react'
import { fetchSanity, urlFor } from '@/lib/sanity'
import {
  PROFILE_QUERY,
  EXPERIENCES_QUERY,
  SKILLS_QUERY,
  EDUCATION_QUERY,
} from '@/lib/sanity-queries'
import type { Profile, Experience, Skill, Education } from '@/types/sanity'
import { t } from '@/lib/i18n'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function CVPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchSanity<Profile>(PROFILE_QUERY),
      fetchSanity<Experience[]>(EXPERIENCES_QUERY),
      fetchSanity<Skill[]>(SKILLS_QUERY),
      fetchSanity<Education[]>(EDUCATION_QUERY),
    ])
      .then(([p, ex, sk, ed]) => {
        if (p && typeof p === 'object' && '_id' in p) setProfile(p as Profile)
        if (Array.isArray(ex)) setExperiences(ex)
        if (Array.isArray(sk)) setSkills(sk)
        if (Array.isArray(ed)) setEducation(ed)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <p>{t().common.loading}</p>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 cv-print">
      {/* Print styles: hide navigation, header, footer, no-print elements */}
      <style jsx global>{`
        @media print {
          header,
          nav,
          footer,
          .no-print {
            display: none !important;
          }
          body {
            font-size: 12pt;
            color: #000;
            background: #fff;
          }
          .cv-print {
            max-width: 100% !important;
            padding: 0 !important;
          }
          @page {
            margin: 2cm;
          }
        }
      `}</style>

      {/* Download / Print button — hidden when printing */}
      <div className="no-print mb-8 flex justify-end">
        <Button onClick={() => window.print()}>{t().hero.cta_cv}</Button>
      </div>

      {/* Header */}
      {profile && (
        <div className="text-center mb-8">
          {profile.avatar && (
            <Image
              src={urlFor(profile.avatar).width(120).height(120).url()}
              alt={profile.name}
              width={120}
              height={120}
              className="rounded-full mx-auto mb-4"
            />
          )}
          <h1 className="text-4xl font-bold">{profile.name}</h1>
          {profile.title && (
            <p className="text-xl text-brand-600 dark:text-brand-400 mt-2">
              {profile.title}
            </p>
          )}
          <div className="flex justify-center gap-4 mt-3 text-sm text-muted-foreground">
            {profile.location && <span>{profile.location}</span>}
            {profile.email && <span>{profile.email}</span>}
          </div>
          {profile.bio && (
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              {profile.bio}
            </p>
          )}
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold border-b pb-2 mb-4">
            {t().sections.experience}
          </h2>
          {experiences.map((exp) => (
            <div key={exp._id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{exp.role}</h3>
                  <p className="text-brand-600 dark:text-brand-400">
                    {exp.company}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                  {exp.startDate
                    ? new Date(exp.startDate).getFullYear()
                    : ''}{' '}
                  -{' '}
                  {exp.endDate
                    ? new Date(exp.endDate).getFullYear()
                    : 'Presente'}
                </span>
              </div>
              {exp.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {exp.description}
                </p>
              )}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-secondary px-2 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold border-b pb-2 mb-4">
            {t().sections.education}
          </h2>
          {education.map((edu) => (
            <div key={edu._id} className="mb-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-brand-600 dark:text-brand-400">
                    {edu.institution}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                  {edu.startDate
                    ? new Date(edu.startDate).getFullYear()
                    : ''}{' '}
                  -{' '}
                  {edu.endDate
                    ? new Date(edu.endDate).getFullYear()
                    : 'Presente'}
                </span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold border-b pb-2 mb-4">
            {t().sections.skills}
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill._id}
                className="bg-secondary px-3 py-1 rounded-full text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
