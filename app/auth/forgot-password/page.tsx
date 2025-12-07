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
