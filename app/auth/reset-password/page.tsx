'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    // Verifica se c'è un token valido
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setTokenValid(false);
        setError('Link non valido o scaduto. Richiedi un nuovo link.');
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validazione
    if (password.length < 8) {
      setError('La password deve essere di almeno 8 caratteri');
      return;
    }

    if (password !== confirmPassword) {
      setError('Le password non corrispondono');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);

      // Redirect al login dopo 3 secondi
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);

    } catch (err: any) {
      console.error('Errore aggiornamento password:', err);
      setError(err.message || 'Errore durante il reset della password');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Link Non Valido
            </h2>
            <p className="text-text-secondary mb-6">
              Il link per il reset della password è scaduto o non è valido.
            </p>
            <Link href="/auth/forgot-password">
              <Button variant="primary" fullWidth>
                Richiedi Nuovo Link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Password Aggiornata! 🎉
            </h2>
            <p className="text-text-secondary mb-6">
              La tua password è stata aggiornata con successo. Ora puoi accedere con la nuova password.
            </p>
            <p className="text-sm text-text-secondary mb-4">
              Verrai reindirizzato al login tra pochi secondi...
            </p>
            <Link href="/auth/login">
              <Button variant="primary" fullWidth>
                Vai al Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-main flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-lighter rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Imposta Nuova Password
          </h1>
          <p className="text-text-secondary">
            Scegli una password sicura per il tuo account
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <Input
              label="Nuova Password"
              type="password"
              placeholder="Minimo 8 caratteri"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />

            <Input
              label="Conferma Password"
              type="password"
              placeholder="Ripeti la password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Suggerimenti:</strong>
              </p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>✓ Almeno 8 caratteri</li>
                <li>✓ Usa lettere maiuscole e minuscole</li>
                <li>✓ Includi numeri e simboli</li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
            >
              <Lock className="w-5 h-5 mr-2" />
              Aggiorna Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
