'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Settings, AlertCircle, CheckCircle, Save, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { canModerate, userId, loading: roleLoading } = useUserRole();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [logoUrls, setLogoUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    site_name: '',
    site_logo_letter: '',
    site_tagline: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    // 🆕 NUOVI CAMPI
    support_email: '',
    support_phone: '',
    legal_email: '',
    privacy_email: '',
    company_address: '',
  });

  useEffect(() => {
    if (!roleLoading) {
      if (!canModerate) {
        router.push('/dashboard');
      } else {
        loadSettings();
      }
    }
  }, [roleLoading, canModerate]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setFormData({
          site_name: data.site_name || '',
          site_logo_letter: data.site_logo_letter || '',
          site_tagline: data.site_tagline || '',
          site_description: data.site_description || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          // 🆕 CARICA NUOVI CAMPI
          support_email: data.support_email || '',
          support_phone: data.support_phone || '',
          legal_email: data.legal_email || '',
          privacy_email: data.privacy_email || '',
          company_address: data.company_address || '',
        });

        if (data.site_logo_url) {
          setLogoUrls([data.site_logo_url]);
        }
      }
    } catch (err: any) {
      console.error('Error loading settings:', err);
      setError('Errore nel caricamento delle impostazioni');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.site_name.trim()) {
      setError('Il nome del sito è obbligatorio');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const updateData = {
        site_name: formData.site_name,
        site_logo_url: logoUrls[0] || null,
        site_logo_letter: formData.site_logo_letter || formData.site_name.charAt(0).toUpperCase(),
        site_tagline: formData.site_tagline || null,
        site_description: formData.site_description || null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        // 🆕 SALVA NUOVI CAMPI
        support_email: formData.support_email || null,
        support_phone: formData.support_phone || null,
        legal_email: formData.legal_email || null,
        privacy_email: formData.privacy_email || null,
        company_address: formData.company_address || null,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      };

      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .single();

      if (existing) {
        const { error: updateError } = await supabase
          .from('site_settings')
          .update(updateData)
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert(updateData);

        if (insertError) throw insertError;
      }

      setSuccess(true);
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Impostazioni Salvate!
          </h2>
          <p className="text-text-secondary">
            Le modifiche verranno applicate al ricaricamento della pagina...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-main py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/moderation')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna al Pannello Admin
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-text-primary">
              Impostazioni Sito
            </h1>
          </div>
          <p className="text-text-secondary">
            Configura nome, logo, contatti e informazioni del portale
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Sezione Logo e Branding */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Logo e Branding
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Logo del Sito (opzionale)
                </label>
                <ImageUpload
                  bucket="avatars"
                  userId={userId || 'admin'}
                  maxImages={1}
                  maxSizeMB={2}
                  onImagesChange={setLogoUrls}
                  initialImages={logoUrls}
                />
                <p className="text-xs text-text-secondary mt-2">
                  Se non carichi un logo, verrà usata la lettera iniziale del nome
                </p>
              </div>

              <Input
                label="Nome del Sito *"
                placeholder="es. Portale, ImmobiliOnline, HandmadeItalia..."
                value={formData.site_name}
                onChange={(e) => handleChange('site_name', e.target.value)}
                helperText="Questo nome apparirà nell'header e footer"
                required
              />

              <Input
                label="Lettera Logo (se non usi immagine)"
                placeholder="P"
                maxLength={2}
                value={formData.site_logo_letter}
                onChange={(e) => handleChange('site_logo_letter', e.target.value.toUpperCase())}
                helperText="Max 2 caratteri, usata se non c'è logo immagine"
              />

              <Input
                label="Slogan/Tagline"
                placeholder="Il tuo marketplace italiano"
                value={formData.site_tagline}
                onChange={(e) => handleChange('site_tagline', e.target.value)}
                helperText="Breve descrizione sotto il logo"
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Descrizione Sito
                </label>
                <textarea
                  placeholder="Descrizione completa del portale..."
                  value={formData.site_description}
                  onChange={(e) => handleChange('site_description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Anteprima */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-2"><strong>Anteprima:</strong></p>
                <div className="flex items-center gap-3">
                  {logoUrls[0] ? (
                    <img 
                      src={logoUrls[0]} 
                      alt="Logo" 
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {formData.site_logo_letter || formData.site_name.charAt(0) || 'P'}
                      </span>
                    </div>
                  )}
                  <span className="font-bold text-xl text-primary">
                    {formData.site_name || 'Nome Sito'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 🆕 SEZIONE CONTATTI LEGALI */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contatti Legali e Supporto
            </h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>💡 Info:</strong> Questi contatti appariranno nelle pagine Privacy Policy, Termini e Cookie Policy.
              </p>
            </div>

            <div className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Email Supporto"
                  type="email"
                  placeholder="info@tuosito.it"
                  value={formData.support_email}
                  onChange={(e) => handleChange('support_email', e.target.value)}
                  helperText="Email per richieste generali"
                />

                <Input
                  label="Telefono Supporto"
                  type="tel"
                  placeholder="+39 XXX XXX XXXX"
                  value={formData.support_phone}
                  onChange={(e) => handleChange('support_phone', e.target.value)}
                  helperText="Numero per assistenza"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Email Privacy"
                  type="email"
                  placeholder="privacy@tuosito.it"
                  value={formData.privacy_email}
                  onChange={(e) => handleChange('privacy_email', e.target.value)}
                  helperText="Per questioni privacy/GDPR"
                />

                <Input
                  label="Email Legale"
                  type="email"
                  placeholder="legal@tuosito.it"
                  value={formData.legal_email}
                  onChange={(e) => handleChange('legal_email', e.target.value)}
                  helperText="Per questioni legali/termini"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Indirizzo Azienda
                </label>
                <textarea
                  placeholder="Via Esempio 123, 00000 Città, Italia"
                  value={formData.company_address}
                  onChange={(e) => handleChange('company_address', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Indirizzo legale dell'azienda (opzionale)
                </p>
              </div>
            </div>
          </div>

          {/* Sezione Contatti Header/Footer (vecchia) */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contatti Header/Footer
            </h2>
            
            <div className="space-y-4">
              <Input
                label="Email di Contatto"
                type="email"
                placeholder="info@tuosito.it"
                value={formData.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                helperText="Email mostrata nell'header/footer"
              />

              <Input
                label="Telefono di Contatto"
                type="tel"
                placeholder="+39 347 123 4567"
                value={formData.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                helperText="Telefono mostrato nell'header/footer"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/admin/moderation')}
              disabled={saving}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={saving}
              className="flex-1"
            >
              <Save className="w-5 h-5 mr-2" />
              Salva Impostazioni
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
