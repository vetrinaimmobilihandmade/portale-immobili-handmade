'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-main flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Qualcosa è andato storto
        </h2>
        <p className="text-text-secondary mb-8">
          Si è verificato un errore. Prova a ricaricare la pagina.
        </p>
        <Button variant="primary" size="lg" onClick={reset}>
          <RefreshCw className="w-5 h-5" />
          Riprova
        </Button>
      </div>
    </div>
  );
}
