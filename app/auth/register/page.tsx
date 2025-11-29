'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';
import { isValidEmail, isValidPhone } from '@/lib/utils';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome richiesto';
    if (!formData.cognome.trim()) newErrors.cognome = 'Cognome richiesto';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email richiesta';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefono richiesto';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Numero non valido';
    }

    if (!formData.password) {
      newErrors.password = 'Password richiesta';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Minimo 8 caratteri';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non corrispondono';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setErrors({ general: authError.message });
        setLoading(false);
        return;
      }

      if (authData.user) {
        await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: `${formData.nome} ${formData.cognome}`,
            phone: formData.phone,
            role: 'viewer',
          });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setErrors({ general: 'Errore durante la registrazione' });
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-main flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Registrati
          </h1>
          <p className="text-text-secondary">
            Crea il tuo account gratuito
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm font-medium text-red-800">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nome"
                placeholder="Mario"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                error={errors.nome}
                required
              />

              <Input
                label="Cognome"
                placeholder="Rossi"
                value={formData.cognome}
                onChange={(e) => handleChange('cognome', e.target.value)}
                error={errors.cognome}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="mario.rossi@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
            />

            <Input
              label="Telefono"
              type="tel"
              placeholder="333 123 4567"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
              helperText="Formato italiano"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              helperText="Minimo 8 caratteri"
              required
            />

            <Input
              label="Conferma Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
            >
              Registrati
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Hai già un account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Accedi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
