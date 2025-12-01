'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';
import UpgradeToInserzionista from '@/components/UpgradeToInserzionista';
import { PlusCircle, Home, Package } from 'lucide-react';

export default function NuovoAnnuncioPage() {
  const router = useRouter();
  const { role, userId, loading, canPublishListings } = useUserRole();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  // Se l'utente non è loggato, reindirizza al login
  useEffect(() => {
    if (!loading && !userId) {
      router.push('/auth/login?redirect=/dashboard/nuovo');
    }
  }, [loading, userId, router]);

  // Controlla se deve mostrare il modal di upgrade
  useEffect(() => {
    if (!loading && role === 'viewer' && !upgradeSuccess) {
      setShowUpgradeModal(true);
    }
  }, [loading, role, upgradeSuccess]);

  const handleUpgradeSuccess = () => {
    setUpgradeSuccess(true);
    setShowUpgradeModal(false);
  };

  const handleUpgradeCancel = () => {
    router.push('/dashboard');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Se è viewer e non ha ancora fatto l'upgrade
  if (role === 'viewer' && !upgradeSuccess) {
    return (
      <>
        {showUpgradeModal && userId && (
          <UpgradeToInserzionista
            userId={userId}
            onSuccess={handleUpgradeSuccess}
            onCancel={handleUpgradeCancel}
          />
        )}
        <div className="min-h-screen bg-neutral-main flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-text-secondary">Conferma per continuare...</p>
          </div>
        </div>
      </>
    );
  }

  // Se può pubblicare annunci, mostra il form
  if (canPublishListings || upgradeSuccess) {
    return (
      <div className="min-h-screen bg-neutral-main py-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Success Message dopo upgrade */}
          {upgradeSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
              <p className="text-green-800 font-medium flex items-center gap-2">
                <span className="text-xl">🎉</span>
                Complimenti! Sei diventato Inserzionista. Ora puoi pubblicare annunci.
              </p>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Nuovo Annuncio
            </h1>
            <p className="text-text-secondary">
              Scegli il tipo di annuncio che vuoi pubblicare
            </p>
          </div>

          {/* Tipo Annuncio */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            
            {/* Immobili */}
            <button
              onClick={() => router.push('/dashboard/nuovo/immobile')}
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg hover:scale-105 transition-all duration-200 text-left group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Home className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Immobile
              </h3>
              <p className="text-text-secondary mb-4">
                Pubblica un annuncio di vendita o affitto immobiliare. 
                Case, appartamenti, terreni e altro.
              </p>
              <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                <PlusCircle className="w-5 h-5" />
                <span>Crea Annuncio Immobile</span>
              </div>
            </button>

            {/* Handmade */}
            <button
              onClick={() => router.push('/dashboard/nuovo/handmade')}
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg hover:scale-105 transition-all duration-200 text-left group"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <Package className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Prodotto Handmade
              </h3>
              <p className="text-text-secondary mb-4">
                Vendi i tuoi prodotti artigianali fatti a mano. 
                Ceramiche, gioielli, legno e altro.
              </p>
              <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                <PlusCircle className="w-5 h-5" />
                <span>Crea Annuncio Handmade</span>
              </div>
            </button>

          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Suggerimenti per un buon annuncio
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span><strong>Foto di qualità:</strong> Usa immagini luminose e ad alta risoluzione</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span><strong>Descrizione dettagliata:</strong> Sii preciso e onesto nelle caratteristiche</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span><strong>Prezzo chiaro:</strong> Indica sempre il prezzo o specifica "Trattabile"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span><strong>Rispondi velocemente:</strong> Chi risponde prima ottiene più contatti</span>
              </li>
            </ul>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-text-secondary hover:text-primary transition-colors"
            >
              ← Torna alla Dashboard
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Fallback: non dovrebbe mai arrivare qui
  return null;
}
