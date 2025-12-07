'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import { User, Mail, Phone, FileText, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
  });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          bio: profile.bio || '',
        });
      }
    } catch (err: any) {
      console.error('Errore caricamento profilo:', err);
      setError('Errore nel caricamento del profilo');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          bio: formData.bio,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setSuccess('Profilo aggiornato con successo!');
      
      // Refresh per aggiornare l'header
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error('Errore salvataggio:', err);
      setError('Errore nel salvataggio del profilo');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  return (
    <>
      <div className="min-h-screen bg-neutral-main py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Il Tuo Profilo
            </h1>
            <p className="text-text-secondary">
              Gestisci le tue informazioni personali
            </p>
          </div>

          {/* Alert Success */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          )}

          {/* Alert Error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Nome Completo */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nome Completo
                </label>
                <Input
                  placeholder="Mario Rossi"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  required
                />
              </div>

              {/* Email (non modificabile) */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-neutral-main cursor-not-allowed"
                />
                <p className="text-xs text-text-secondary mt-1">
                  L'email non può essere modificata
                </p>
              </div>

              {/* Telefono */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefono
                </label>
                <Input
                  type="tel"
                  placeholder="333 123 4567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Bio
                </label>
                <textarea
                  placeholder="Racconta qualcosa di te..."
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Massimo 500 caratteri
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={saving}
                  className="flex-1"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Salva Modifiche
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                >
                  Annulla
                </Button>
              </div>
            </form>
          </div>

          {/* Sezione Sicurezza */}
          <div className="mt-6 bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Sicurezza
            </h2>
            <p className="text-text-secondary mb-4">
              Gestisci la sicurezza del tuo account
            </p>
            <Button
              variant="secondary"
              onClick={() => setPasswordModalOpen(true)}
            >
              Cambia Password
            </Button>
          </div>

        </div>
      </div>

      {/* Password Modal */}
      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </>
  );
}
