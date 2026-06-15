'use client';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">Algo salió mal</h1>
      <p className="text-muted-foreground mb-8">Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.</p>
      <Button onClick={reset}>Reintentar</Button>
    </main>
  );
}
