import { fetchSanity, urlFor } from '@/lib/sanity';
import { FEATURED_PROJECTS_QUERY } from '@/lib/sanity-queries';
import type { Project } from '@/types/sanity';
import { t } from '@/lib/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = { title: 'Proyectos | Javier Morcillo', description: 'Proyectos destacados de desarrollo web y software.' };

export default async function ProjectsPage() {
  const projects = await fetchSanity<Project[]>(FEATURED_PROJECTS_QUERY) || [];
  if (!projects?.length) return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">{t().nav.projects}</h1>
      <p className="text-muted-foreground">Proyectos destacados próximamente. Mientras tanto, visita mi <a href="https://github.com/minimorcy" className="text-brand-600 hover:underline">GitHub</a>.</p>
    </main>
  );

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t().nav.projects}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <Link key={project._id} href={`/proyectos/${project.slug.current}`}>
            <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] animate-slide-up opacity-0" style={{animationDelay:`${i*100}ms`,animationFillMode:'forwards'}}>
              <CardContent className="p-0">
                {project.mainImage && <Image src={urlFor(project.mainImage).width(400).height(200).url()} alt={project.title} width={400} height={200} className="rounded-t-lg w-full h-48 object-cover" />}
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{project.title}</h2>
                  {project.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>}
                  <div className="flex flex-wrap gap-1">
                    {project.technologies?.map(tech => <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
