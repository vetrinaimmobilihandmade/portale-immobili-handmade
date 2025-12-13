'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { AlertCircle, CheckCircle, Shield, ExternalLink, Briefcase } from 'lucide-react';
import { isValidEmail, isValidPhone } from '@/lib/utils';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accept_agency_contact: false, // 🆕 NUOVO CAMPO
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
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
    setSuccess(false);
    try {
      const res1 = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (res1.error) {
        setErrors({ general: res1.error.message });
        setLoading(false);
        return;
      }
      if (res1.data.user) {
        const res2 = await supabase.from('user_profiles').insert({
          id: res1.data.user.id,
          email: formData.email,
          full_name: formData.nome + ' ' + formData.cognome,
          phone: formData.phone,
          role: 'viewer',
          accept_agency_contact: formData.accept_agency_contact, // 🆕 SALVA IL FLAG
        });
        if (res2.error) {
          setErrors({ general: 'Errore creazione profilo' });
          setLoading(false);
          return;
        }
      }
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setErrors({ general: 'Errore durante la registrazione' });
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-main flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Registrati</h1>
          <p className="text-text-secondary">Crea il tuo account gratuito</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Account Creato con Successo!</h3>
              <p className="text-text-secondary mb-2">Controlla la tua email per confermare l&apos;account.</p>
              <p className="text-sm text-text-secondary mb-6">Ti abbiamo inviato un link di verifica a <strong>{formData.email}</strong></p>
              <Link href="/auth/login"><Button variant="primary" fullWidth>Vai al Login</Button></Link>
            </div>
          ) : (
            <>
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1 text-sm">💡 Proteggi la tua Privacy</h3>
                    <p className="text-xs text-text-secondary mb-3">Vuoi registrarti senza rivelare la tua email reale? Usa un servizio di <strong>Email Forwarding Anonimo</strong>!</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <a href="https://simplelogin.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 p-2 bg-white rounded-lg hover:shadow-sm transition-all text-xs group">
                    <span className="font-medium text-primary group-hover:underline">SimpleLogin</span>
                    <ExternalLink className="w-3 h-3 text-text-secondary" />
                  </a>
                  <a href="https://anonaddy.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 p-2 bg-white rounded-lg hover:shadow-sm transition-all text-xs group">
                    <span className="font-medium text-primary group-hover:underline">AnonAddy</span>
                    <ExternalLink className="w-3 h-3 text-text-secondary" />
                  </a>
                  <a href="https://relay.firefox.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 p-2 bg-white rounded-lg hover:shadow-sm transition-all text-xs group">
                    <span className="font-medium text-primary group-hover:underline">Firefox Relay</span>
                    <ExternalLink className="w-3 h-3 text-text-secondary" />
                  </a>
                  <a href="https://duckduckgo.com/email" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 p-2 bg-white rounded-lg hover:shadow-sm transition-all text-xs group">
                    <span className="font-medium text-primary group-hover:underline">DuckDuckGo</span>
                    <ExternalLink className="w-3 h-3 text-text-secondary" />
                  </a>
                </div>
                <p className="text-xs text-text-secondary"><strong>Come funziona:</strong> Crei un alias email che inoltra i messaggi alla tua vera email mantenendola nascosta.</p>
              </div>
              {errors.general && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <p className="text-sm font-medium text-red-800">{errors.general}</p>
                </div>
              )}
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Nome" placeholder="Mario" value={formData.nome} onChange={(e) => handleChange('nome', e.target.value)} error={errors.nome} required />
                  <Input label="Cognome" placeholder="Rossi" value={formData.cognome} onChange={(e) => handleChange('cognome', e.target.value)} error={errors.cognome} required />
                </div>
                <Input label="Email" type="email" placeholder="mario.rossi@email.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} error={errors.email} helperText="Usa una email anonima per maggiore privacy" required />
                <Input label="Telefono" type="tel" placeholder="333 123 4567" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} error={errors.phone} helperText="Il tuo numero rimarra privato e non sara mai visibile ad altri utenti" required />
                <Input label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} error={errors.password} helperText="Minimo 8 caratteri" required />
                <Input label="Conferma Password" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} error={errors.confirmPassword} required />
                
                {/* 🆕 NUOVO: Checkbox Contatto Agenzia */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="accept_agency_contact"
                      checked={formData.accept_agency_contact}
                      onChange={(e) => handleChange('accept_agency_contact', e.target.checked)}
                      className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <div className="flex-1">
                      <label htmlFor="accept_agency_contact" className="font-medium text-text-primary cursor-pointer flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        Contatto Agenzie Immobiliari
                      </label>
                      <p className="text-sm text-text-secondary mt-1">
                        Sono interessato a ricevere supporto da professionisti del settore immobiliare
                      </p>
                      <p className="text-xs text-text-secondary mt-2 italic">
                        ℹ️ Opzionale - Puoi modificare questa preferenza in qualsiasi momento dal tuo profilo
                      </p>
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>Registrati</Button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-text-secondary">Hai gia un account? <Link href="/auth/login" className="text-primary hover:underline font-medium">Accedi</Link></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
