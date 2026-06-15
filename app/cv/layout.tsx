import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CV | Javier Morcillo',
  description:
    'Currículum profesional de Javier Morcillo — experiencia, formación y habilidades como Desarrollador Full-Stack.',
}

export default function CVLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
