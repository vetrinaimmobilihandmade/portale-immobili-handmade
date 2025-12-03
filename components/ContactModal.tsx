'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { X, Send, AlertCircle, CheckCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingType: 'property' | 'product';
  listingId: string;
  listingTitle: string;
  sellerEmail: string;
  sellerName: string;
}

export default function ContactModal({
  isOpen,
  onClose,
  listingType,
  listingId,
  listingTitle,
  sellerEmail,
  sellerName,
}: ContactModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const supabase = createClient();

  // Carica dati utente al mount
  useState(() => {
    loadUserData();
  });

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name, email, phone')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData({
          name: profile.full_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          message: `Ciao, sono interessato a: ${listingTitle}`,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const listingUrl = `${window.location.origin}/${listingType === 'property' ? 'immobili' : 'handmade'}/${listingId}`;

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingType,
          listingTitle,
          listingUrl,
          sellerEmail,
          sellerName,
          buyerName: formData.name,
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore nell\'invio del messaggio');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);

    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Errore nell\'invio del messaggio');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-border">
          <h2 className="text-2xl font-bold text-text-primary">
            Contatta l'inserzionista
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-main rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Listing Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-text-secondary mb-1">Annuncio:</p>
            <p className="font-semibold text-text-primary">{listingTitle}</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Messaggio Inviato!
              </h3>
              <p className="text-text-secondary">
                L'inserzionista ti risponderà via email
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Nome */}
              <Input
                label="Il tuo nome *"
                placeholder="Mario Rossi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              {/* Email */}
              <Input
                label="La tua email *"
                type="email"
                placeholder="mario.rossi@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              {/* Telefono */}
              <Input
                label="Il tuo telefono (opzionale)"
                type="tel"
                placeholder="333 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              {/* Messaggio */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Messaggio *
                </label>
                <textarea
                  placeholder="Scrivi il tuo messaggio..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Privacy Note */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Privacy:</strong> I tuoi dati saranno inviati solo all'inserzionista e non saranno condivisi con terze parti.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Annulla
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  className="flex-1"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Invia Messaggio
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
