import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-main flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Pagina non trovata
        </h2>
        <p className="text-text-secondary mb-8">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">
            <Home className="w-5 h-5" />
            Torna alla Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
