'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { AlertCircle, CheckCircle, Home } from 'lucide-react';

export default function NuovoImmobilePage() {
  const router = useRouter();
  const { userId, canPublishListings, loading: roleLoading } = useUserRole();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'vendita',
    property_category: 'appartamento',
    address: '',
    municipality_name: '',
    surface_mq: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    total_floors: '',
    year_built: '',
    energy_class: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect se non può pubblicare
  useEffect(() => {
    if (!roleLoading && !canPublishListings) {
      router.push('/dashboard/nuovo');
    }
  }, [roleLoading, canPublishListings, router]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Titolo richiesto';
    if (formData.title.length < 10) newErrors.title = 'Minimo 10 caratteri';
    if (!formData.description.trim()) newErrors.description = 'Descrizione richiesta';
    if (formData.description.length < 50) newErrors.description = 'Minimo 50 caratteri';
    if (!formData.address.trim()) newErrors.address = 'Indirizzo richiesto';
    if (!formData.municipality_name.trim()) newErrors.municipality_name = 'Comune richiesto';
    if (imageUrls.length === 0) newErrors.images = 'Carica almeno 1 immagine';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!userId) {
      setError('Devi essere loggato per pubblicare un annuncio');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Ottieni email e telefono dal profilo
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('email, phone, full_name')
        .eq('id', userId)
        .single();

      // Inserisci immobile
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          user_id: userId,
          title: formData.title,
          description: formData.description,
          property_type: formData.property_type,
          property_category: formData.property_category,
          address: formData.address,
          municipality_name: formData.municipality_name,
          surface_mq: formData.surface_mq ? parseInt(formData.surface_mq) : null,
          rooms: formData.rooms ? parseInt(formData.rooms) : null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          floor: formData.floor ? parseInt(formData.floor) : null,
          total_floors: formData.total_floors ? parseInt(formData.total_floors) : null,
          year_built: formData.year_built ? parseInt(formData.year_built) : null,
          energy_class: formData.energy_class || null,
          cover_image_url: imageUrls[0] || null,
          contact_name: profile?.full_name || null,
          contact_email: profile?.email || null,
          contact_phone: profile?.phone || null,
          status: 'pending',
          views_count: 0,
          is_featured: false,
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Inserisci immagini nella tabella property_images
      if (imageUrls.length > 0 && property) {
  const imageRecords = imageUrls.map((url, index) => ({
    property_id: property.id,
    thumbnail_url: url,  // ✅ CAMPO CORRETTO
    full_url: url,       // ✅ CAMPO CORRETTO
    display_order: index,
    file_size: null,     // ✅ CAMPO OPZIONALE
  }));

  const { error: imagesError } = await supabase
    .from('property_images')
    .insert(imageRecords);

  if (imagesError) {
    console.error('Error inserting images:', imagesError);
  }
}

      setSuccess(true);
      
      // Redirect dopo 2 secondi
      setTimeout(() => {
        router.push('/dashboard/annunci');
      }, 2000);

    } catch (err: any) {
      console.error('Error creating property:', err);
      setError(err.message || 'Errore durante la creazione dell\'annuncio');
    } finally {
      setLoading(false);
    }
  };

  if (roleLoading) {
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
            Annuncio Creato!
          </h2>
          <p className="text-text-secondary mb-4">
            Il tuo annuncio è stato inviato in approvazione. Riceverai una notifica quando sarà pubblicato.
          </p>
          <Button onClick={() => router.push('/dashboard/annunci')} variant="primary">
            Vai ai Miei Annunci
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-main py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Home className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-text-primary">
              Nuovo Immobile
            </h1>
          </div>
          <p className="text-text-secondary">
            Compila tutti i campi per pubblicare il tuo annuncio immobiliare
          </p>
        </div>

        {/* Error generale */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {/* Error immagini */}
        {errors.images && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm font-medium text-red-800">{errors.images}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8">
          
          {/* Immagini */}
          <div className="mb-8">
            <ImageUpload
              bucket="property-images"
              userId={userId || ''}
              maxImages={10}
              maxSizeMB={5}
              onImagesChange={setImageUrls}
              initialImages={imageUrls}
            />
          </div>

          <div className="space-y-6">
            
            {/* Tipo e Categoria */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tipo Annuncio *
                </label>
                <select
                  value={formData.property_type}
                  onChange={(e) => handleChange('property_type', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="vendita">Vendita</option>
                  <option value="affitto">Affitto</option>
                  <option value="affitto_breve">Affitto Breve</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.property_category}
                  onChange={(e) => handleChange('property_category', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="appartamento">Appartamento</option>
                  <option value="villa">Villa</option>
                  <option value="terreno">Terreno</option>
                  <option value="ufficio">Ufficio</option>
                  <option value="negozio">Negozio</option>
                  <option value="garage">Garage</option>
                  <option value="altro">Altro</option>
                </select>
              </div>
            </div>

            {/* Titolo */}
            <Input
              label="Titolo Annuncio *"
              placeholder="Es: Bellissimo appartamento in centro"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              error={errors.title}
              helperText="Minimo 10 caratteri"
              required
            />

            {/* Descrizione */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Descrizione *
              </label>
              <textarea
                placeholder="Descrivi l'immobile in dettaglio..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                  errors.description ? 'border-red-500' : 'border-neutral-border'
                }`}
                required
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-text-secondary mt-1">Minimo 50 caratteri</p>
            </div>

            {/* Indirizzo e Comune */}
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Indirizzo *"
                placeholder="Via Roma 123"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                error={errors.address}
                required
              />
              <Input
                label="Comune *"
                placeholder="Milano"
                value={formData.municipality_name}
                onChange={(e) => handleChange('municipality_name', e.target.value)}
                error={errors.municipality_name}
                required
              />
            </div>

            {/* Caratteristiche */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Superficie (mq)"
                type="number"
                placeholder="80"
                value={formData.surface_mq}
                onChange={(e) => handleChange('surface_mq', e.target.value)}
              />
              <Input
                label="Locali"
                type="number"
                placeholder="3"
                value={formData.rooms}
                onChange={(e) => handleChange('rooms', e.target.value)}
              />
              <Input
                label="Camere"
                type="number"
                placeholder="2"
                value={formData.bedrooms}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
              />
              <Input
                label="Bagni"
                type="number"
                placeholder="1"
                value={formData.bathrooms}
                onChange={(e) => handleChange('bathrooms', e.target.value)}
              />
            </div>

            {/* Piano e Anno */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Input
                label="Piano"
                type="number"
                placeholder="3"
                value={formData.floor}
                onChange={(e) => handleChange('floor', e.target.value)}
              />
              <Input
                label="Piani Totali"
                type="number"
                placeholder="5"
                value={formData.total_floors}
                onChange={(e) => handleChange('total_floors', e.target.value)}
              />
              <Input
                label="Anno Costruzione"
                type="number"
                placeholder="2010"
                value={formData.year_built}
                onChange={(e) => handleChange('year_built', e.target.value)}
              />
            </div>

            {/* Classe Energetica */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Classe Energetica
              </label>
              <select
                value={formData.energy_class}
                onChange={(e) => handleChange('energy_class', e.target.value)}
                className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Non specificata</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Nota:</strong> I tuoi dati di contatto (email e telefono) saranno visibili solo agli utenti registrati.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/dashboard/nuovo')}
                disabled={loading}
              >
                Annulla
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="flex-1"
              >
                Pubblica Annuncio
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
