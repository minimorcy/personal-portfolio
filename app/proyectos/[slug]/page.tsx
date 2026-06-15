import { fetchSanity } from '@/lib/sanity'
import { PROJECT_BY_SLUG_QUERY, ALL_PROJECTS_QUERY } from '@/lib/sanity-queries'
import type { Project } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'

type Props = {
  params: { slug: string }
}

export async function generateStaticParams() {
  const projects = await fetchSanity<Project[]>(ALL_PROJECTS_QUERY) || []
  return projects.map((project) => ({ slug: project.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await fetchSanity<Project>(PROJECT_BY_SLUG_QUERY, {
    slug: params.slug,
  })
  if (!project) return { title: 'Proyecto no encontrado' }
  return {
    title: `${project.title} | Proyectos`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: Props) {
  const project = await fetchSanity<Project>(PROJECT_BY_SLUG_QUERY, {
    slug: params.slug,
  })
  if (!project) notFound()

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/proyectos"
        className="text-brand-600 dark:text-brand-400 hover:underline mb-6 inline-block"
      >
        ← Volver a proyectos
      </Link>
      <article>
        {project.mainImage && (
          <Image
            src={urlFor(project.mainImage).width(800).height(400).url()}
            alt={project.title}
            width={800}
            height={400}
            className="rounded-lg mb-8 w-full object-cover"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies?.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
        {project.description && (
          <p className="text-lg text-muted-foreground mb-8">{project.description}</p>
        )}
        <div className="flex gap-4">
          {project.demoUrl && (
            <Button asChild>
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                Ver Demo
              </a>
            </Button>
          )}
          {project.repoUrl && (
            <Button variant="outline" asChild>
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                Ver Repositorio
              </a>
            </Button>
          )}
        </div>
      </article>
    </main>
  )
}
