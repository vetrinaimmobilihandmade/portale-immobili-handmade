'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Lock, X, CheckCircle, AlertCircle } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Rimuovi errore del campo quando l'utente digita
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Inserisci la vecchia password';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Inserisci la nuova password';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'La password deve essere di almeno 8 caratteri';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Conferma la nuova password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non corrispondono';
    }

    if (formData.oldPassword && formData.newPassword && formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = 'La nuova password deve essere diversa dalla vecchia';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      // Step 1: Verifica la vecchia password (re-login)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        throw new Error('Utente non trovato');
      }

      // Tenta il login con la vecchia password per verificarla
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: formData.oldPassword,
      });

      if (signInError) {
        setErrors({ oldPassword: 'La vecchia password non è corretta' });
        setLoading(false);
        return;
      }

      // Step 2: Aggiorna con la nuova password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) throw updateError;

      // Successo!
      setSuccess(true);
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });

      // Chiudi il modal dopo 2 secondi
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error('Errore cambio password:', err);
      setError(err.message || 'Errore durante il cambio password. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // Non chiudere durante il caricamento
    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 hover:bg-neutral-main rounded-lg transition-colors disabled:opacity-50"
          aria-label="Chiudi"
        >
          <X className="w-5 h-5 text-text-secondary" />
        </button>

        {/* Success State */}
        {success ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              Password Aggiornata! 🎉
            </h3>
            <p className="text-text-secondary">
              La tua password è stata modificata con successo
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-lighter rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Cambia Password
                </h2>
                <p className="text-sm text-text-secondary">
                  Aggiorna la tua password di accesso
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <Input
                label="Vecchia Password"
                type="password"
                placeholder="Inserisci la vecchia password"
                value={formData.oldPassword}
                onChange={(e) => handleChange('oldPassword', e.target.value)}
                error={errors.oldPassword}
                required
                disabled={loading}
              />

              <div className="pt-2 border-t border-neutral-border">
                <Input
                  label="Nuova Password"
                  type="password"
                  placeholder="Minimo 8 caratteri"
                  value={formData.newPassword}
                  onChange={(e) => handleChange('newPassword', e.target.value)}
                  error={errors.newPassword}
                  helperText="Minimo 8 caratteri"
                  required
                  disabled={loading}
                />
              </div>

              <Input
                label="Conferma Nuova Password"
                type="password"
                placeholder="Ripeti la nuova password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                required
                disabled={loading}
              />

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Suggerimenti per una password sicura:</strong>
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• Almeno 8 caratteri</li>
                  <li>• Usa lettere maiuscole e minuscole</li>
                  <li>• Includi numeri e simboli</li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  onClick={handleClose}
                  disabled={loading}
                >
                  Annulla
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={loading}
                >
                  Cambia Password
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
