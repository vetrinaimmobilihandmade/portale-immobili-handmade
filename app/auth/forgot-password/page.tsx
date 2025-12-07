// app/auth/forgot-password/page.tsx
// Pagina per richiedere reset password

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Inserisci la tua email');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Errore reset password:', err);
      setError('Errore durante l\'invio. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Email Inviata! ✅
            </h2>
            <p className="text-text-secondary mb-6">
              Controlla la tua casella di posta. Ti abbiamo inviato un link per resettare la password.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>📧 Email inviata a:</strong><br/>
                {email}
              </p>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              Il link è valido per <strong>1 ora</strong>. Se non ricevi l'email, controlla lo spam.
            </p>
            <Link href="/auth/login">
              <Button variant="primary" fullWidth>
                Torna al Login
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
        
        <div className="mb-6">
          <Link href="/auth/login" className="inline-flex items-center text-text-secondary hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna al login
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-lighter rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Password Dimenticata?
          </h1>
          <p className="text-text-secondary">
            Nessun problema! Inserisci la tua email e ti invieremo un link per resettare la password.
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
              label="Email"
              type="email"
              placeholder="mario.rossi@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
            >
              <Mail className="w-5 h-5 mr-2" />
              Invia Link di Reset
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Ti sei ricordato la password?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Accedi
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Suggerimento:</strong> Se non ricevi l'email entro pochi minuti, controlla la cartella spam o contattaci all'indirizzo{' '}
            <a href="mailto:andrealongonet@gmail.com" className="underline">andrealongonet@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// app/auth/reset-password/page.tsx
// Pagina per impostare nuova password (dopo aver cliccato link email)

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

// Aggiorna app/auth/login/page.tsx
// Aggiungi il link "Password dimenticata?" sotto il form di login

// Trova la sezione dopo il pulsante "Accedi" e aggiungi:

/*
<div className="mt-4 text-center">
  <Link 
    href="/auth/forgot-password"
    className="text-sm text-primary hover:underline"
  >
    Password dimenticata?
  </Link>
</div>
*/
