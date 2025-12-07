'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Settings, AlertCircle, CheckCircle, Save, ArrowLeft, Palette } from 'lucide-react';

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
    logo_bg_color: '#2D5F8D', // Default: Blu primario
    logo_text_color: '#FFFFFF', // Default: Bianco
  });

  // Palette colori disponibili
  const bgColors = [
    { name: 'Blu Primario', value: '#2D5F8D', preview: 'bg-[#2D5F8D]' },
    { name: 'Arancione', value: '#E07A5F', preview: 'bg-[#E07A5F]' },
    { name: 'Verde Accent', value: '#81B29A', preview: 'bg-[#81B29A]' },
    { name: 'Grigio Scuro', value: '#3D3D3D', preview: 'bg-[#3D3D3D]' },
  ];

  const textColors = [
    { name: 'Bianco', value: '#FFFFFF', preview: 'bg-white border' },
    { name: 'Nero', value: '#3D3D3D', preview: 'bg-[#3D3D3D]' },
    { name: 'Blu Primario', value: '#2D5F8D', preview: 'bg-[#2D5F8D]' },
    { name: 'Arancione', value: '#E07A5F', preview: 'bg-[#E07A5F]' },
  ];

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
          logo_bg_color: data.logo_bg_color || '#2D5F8D',
          logo_text_color: data.logo_text_color || '#FFFFFF',
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
        site_logo_letter: formData.site_logo_letter || formData.site_name.substring(0, 3).toUpperCase(),
        site_tagline: formData.site_tagline || null,
        site_description: formData.site_description || null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        logo_bg_color: formData.logo_bg_color,
        logo_text_color: formData.logo_text_color,
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
            Configura nome, logo, colori e informazioni del portale
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8">
          
          {/* Sezione Logo */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Logo e Branding</h2>
            
            <div className="mb-6">
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

            <div className="mt-4">
              <Input
                label="Lettera Logo (se non usi immagine)"
                placeholder="PIH"
                maxLength={3}
                value={formData.site_logo_letter}
                onChange={(e) => handleChange('site_logo_letter', e.target.value.toUpperCase())}
                helperText="Max 3 caratteri, usata se non c'è logo immagine"
              />
            </div>

            {/* 🎨 SEZIONE COLORI LOGO */}
            <div className="mt-6 p-6 bg-purple-50 border-2 border-purple-200 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-text-primary">Colori Logo</h3>
              </div>

              {/* Colore Sfondo Logo */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Colore Sfondo Logo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {bgColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleChange('logo_bg_color', color.value)}
                      className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                        formData.logo_bg_color === color.value
                          ? 'border-purple-600 shadow-lg'
                          : 'border-neutral-border hover:border-purple-300'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-md ${color.preview} mb-2`}></div>
                      <p className="text-xs text-center font-medium text-text-primary">
                        {color.name}
                      </p>
                      {formData.logo_bg_color === color.value && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colore Testo Nome */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Colore Testo Nome Sito
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {textColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleChange('logo_text_color', color.value)}
                      className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                        formData.logo_text_color === color.value
                          ? 'border-purple-600 shadow-lg'
                          : 'border-neutral-border hover:border-purple-300'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-md ${color.preview} mb-2`}></div>
                      <p className="text-xs text-center font-medium text-text-primary">
                        {color.name}
                      </p>
                      {formData.logo_text_color === color.value && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Anteprima Logo */}
            <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl">
              <p className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span>👁️</span> Anteprima Logo:
              </p>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                {logoUrls[0] ? (
                  <img 
                    src={logoUrls[0]} 
                    alt="Logo" 
                    className="w-12 h-12 rounded-lg object-cover shadow-md"
                  />
                ) : (
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md"
                    style={{ backgroundColor: formData.logo_bg_color }}
                  >
                    <span 
                      className="font-bold text-lg"
                      style={{ color: formData.logo_text_color }}
                    >
                      {formData.site_logo_letter || formData.site_name.substring(0, 3).toUpperCase() || 'PIH'}
                    </span>
                  </div>
                )}
                <span 
                  className="font-bold text-2xl"
                  style={{ color: formData.logo_text_color }}
                >
                  {formData.site_name || 'Nome Sito'}
                </span>
              </div>
            </div>
          </div>

          {/* Sezione Info */}
          <div className="mb-8 pt-8 border-t border-neutral-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Informazioni Generali</h2>
            
            <div className="space-y-4">
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
            </div>
          </div>

          {/* Sezione Contatti */}
          <div className="mb-8 pt-8 border-t border-neutral-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Contatti</h2>
            
            <div className="space-y-4">
              <Input
                label="Email di Contatto"
                type="email"
                placeholder="info@tuosito.it"
                value={formData.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
              />

              <Input
                label="Telefono di Contatto"
                type="tel"
                placeholder="+39 347 123 4567"
                value={formData.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
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
