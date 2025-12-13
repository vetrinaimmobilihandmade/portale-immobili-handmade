'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface UpgradeToInserzionisaProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UpgradeToInserzionista({ userId, onSuccess, onCancel }: UpgradeToInserzionisaProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');

    try {
      // Aggiorna il ruolo a inserzionista
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ role: 'inserzionista' })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Successo!
      onSuccess();
      
      // Ricarica la pagina per aggiornare i permessi
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err: any) {
      console.error('Errore upgrade:', err);
      setError('Errore durante l\'aggiornamento. Riprova.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
        
        {/* Icon */}
        <div className="w-16 h-16 bg-primary-lighter rounded-full flex items-center justify-center mx-auto mb-6">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-text-primary text-center mb-4">
          Diventa Inserzionista
        </h2>

        {/* Description */}
        <p className="text-text-secondary text-center mb-6">
          Per pubblicare annunci devi diventare <strong>Inserzionista</strong>. 
          È completamente gratuito e richiede solo un click!
        </p>

        {/* Benefits */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            Cosa puoi fare:
          </h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>Pubblicare annunci di immobili</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>Pubblicare prodotti handmade</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>Gestire i tuoi annunci dalla dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>Ricevere contatti da potenziali acquirenti</span>
            </li>
          </ul>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={onCancel}
            disabled={loading}
          >
            Annulla
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleUpgrade}
            isLoading={loading}
          >
            Conferma
          </Button>
        </div>
      </div>
    </div>
  );
}
