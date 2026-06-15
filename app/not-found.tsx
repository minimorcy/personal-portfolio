import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';

export default function NotFound() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-brand-600 dark:text-brand-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
      <p className="text-muted-foreground mb-8">La página que buscas no existe o ha sido movida.</p>
      <Button asChild><Link href="/">Volver al inicio</Link></Button>
    </main>
  );
}
