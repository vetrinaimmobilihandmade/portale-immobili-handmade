'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { AlertCircle, CheckCircle, Home, ArrowLeft } from 'lucide-react';

export default function AdminEditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { canModerate, loading: roleLoading } = useUserRole();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [property, setProperty] = useState<any>(null);

  // 🆕 State per regioni e province
  const [regions, setRegions] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'vendita',
    property_category: 'appartamento',
    region_id: '', // 🆕 AGGIUNTO
    province_id: '', // 🆕 AGGIUNTO
    municipality_name: '',
    address: '',
    surface_mq: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    total_floors: '',
    year_built: '',
    energy_class: '',
    status: 'pending',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!roleLoading) {
      if (!canModerate) {
        router.push('/dashboard');
      } else {
        // 🆕 Carica regioni
        loadRegions();
        loadProperty();
      }
    }
  }, [roleLoading, canModerate]);

  // 🆕 Carica province quando cambia region_id
  useEffect(() => {
    if (formData.region_id) {
      loadProvinces(parseInt(formData.region_id));
    } else {
      setProvinces([]);
    }
  }, [formData.region_id]);

  // 🆕 Funzione per caricare regioni
  const loadRegions = async () => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('name');

      if (error) throw error;
      setRegions(data || []);
    } catch (err) {
      console.error('Error loading regions:', err);
    }
  };

  // 🆕 Funzione per caricare province di una regione
  const loadProvinces = async (regionId: number) => {
    setLoadingProvinces(true);
    try {
      const { data, error } = await supabase
        .from('provinces')
        .select('*')
        .eq('region_id', regionId)
        .order('name');

      if (error) throw error;
      setProvinces(data || []);
    } catch (err) {
      console.error('Error loading provinces:', err);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const loadProperty = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (thumbnail_url, full_url, display_order)
        `)
        .eq('id', params.id)
        .single();

      if (fetchError) throw fetchError;

      setProperty(data);
      
      // Popola form
      setFormData({
        title: data.title || '',
        description: data.description || '',
        property_type: data.property_type,
        property_category: data.property_category,
        region_id: data.region_id?.toString() || '', // 🆕 AGGIUNTO
        province_id: data.province_id?.toString() || '', // 🆕 AGGIUNTO
        municipality_name: data.municipality_name || '',
        address: data.address || '',
        surface_mq: data.surface_mq?.toString() || '',
        rooms: data.rooms?.toString() || '',
        bedrooms: data.bedrooms?.toString() || '',
        bathrooms: data.bathrooms?.toString() || '',
        floor: data.floor?.toString() || '',
        total_floors: data.total_floors?.toString() || '',
        year_built: data.year_built?.toString() || '',
        energy_class: data.energy_class || '',
        status: data.status,
      });

      // Carica immagini
      const images = data.property_images
        ?.sort((a: any, b: any) => a.display_order - b.display_order)
        .map((img: any) => img.full_url) || [];
      setImageUrls(images);

      // 🆕 Carica province se c'è già una regione
      if (data.region_id) {
        loadProvinces(data.region_id);
      }

    } catch (err: any) {
      console.error('Error loading property:', err);
      setError('Errore nel caricamento dell\'immobile');
    } finally {
      setLoading(false);
    }
  };

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
    
    // 🆕 Validazione regione e provincia
    if (!formData.region_id) newErrors.region_id = 'Seleziona una regione';
    if (!formData.province_id) newErrors.province_id = 'Seleziona una provincia';
    
    if (!formData.municipality_name.trim()) newErrors.municipality_name = 'Comune richiesto';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Aggiorna immobile
      const { error: updateError } = await supabase
        .from('properties')
        .update({
          title: formData.title,
          description: formData.description,
          property_type: formData.property_type,
          property_category: formData.property_category,
          region_id: formData.region_id ? parseInt(formData.region_id) : null, // 🆕 AGGIUNTO
          province_id: formData.province_id ? parseInt(formData.province_id) : null, // 🆕 AGGIUNTO
          municipality_name: formData.municipality_name,
          address: formData.address,
          surface_mq: formData.surface_mq ? parseInt(formData.surface_mq) : null,
          rooms: formData.rooms ? parseInt(formData.rooms) : null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          floor: formData.floor ? parseInt(formData.floor) : null,
          total_floors: formData.total_floors ? parseInt(formData.total_floors) : null,
          year_built: formData.year_built ? parseInt(formData.year_built) : null,
          energy_class: formData.energy_class || null,
          cover_image_url: imageUrls[0] || null,
          status: formData.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (updateError) throw updateError;

      // Aggiorna immagini (elimina vecchie e inserisci nuove)
      await supabase
        .from('property_images')
        .delete()
        .eq('property_id', params.id);

      if (imageUrls.length > 0) {
        const imageRecords = imageUrls.map((url, index) => ({
          property_id: params.id as string,
          thumbnail_url: url,
          full_url: url,
          display_order: index,
          file_size: null,
        }));

        const { error: imagesError } = await supabase
          .from('property_images')
          .insert(imageRecords);

        if (imagesError) {
          console.error('Error inserting images:', imagesError);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/moderation');
      }, 1500);

    } catch (err: any) {
      console.error('Error updating property:', err);
      setError(err.message || 'Errore durante l\'aggiornamento');
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
            Immobile Aggiornato!
          </h2>
          <p className="text-text-secondary">
            Le modifiche sono state salvate con successo.
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
            Torna alla Moderazione
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Home className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-text-primary">
              Modifica Immobile
            </h1>
          </div>
          <p className="text-text-secondary">
            Modifica i dati dell'immobile come admin
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8">
          
          <div className="mb-8">
            <ImageUpload
              bucket="property-images"
              userId={property?.user_id || ''}
              maxImages={10}
              maxSizeMB={5}
              onImagesChange={setImageUrls}
              initialImages={imageUrls}
            />
          </div>

          <div className="space-y-6">
            
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Stato Annuncio *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="pending">In Attesa</option>
                <option value="approved">Approvato</option>
                <option value="rejected">Rifiutato</option>
                <option value="archived">Archiviato</option>
              </select>
            </div>

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

            <Input
              label="Titolo Annuncio *"
              placeholder="Es: Bellissimo appartamento in centro"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              error={errors.title}
              helperText="Minimo 10 caratteri"
              required
            />

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

            {/* 🆕 SEZIONE LOCALITÀ */}
            <div className="pt-6 border-t border-neutral-border">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                📍 Località Immobile
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* 🆕 SELECT REGIONE */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Regione *
                  </label>
                  <select
                    value={formData.region_id}
                    onChange={(e) => handleChange('region_id', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.region_id ? 'border-red-500' : 'border-neutral-border'
                    }`}
                    required
                  >
                    <option value="">Seleziona regione</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  {errors.region_id && (
                    <p className="text-sm text-red-600 mt-1">{errors.region_id}</p>
                  )}
                </div>

                {/* 🆕 SELECT PROVINCIA */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Provincia *
                  </label>
                  <select
                    value={formData.province_id}
                    onChange={(e) => handleChange('province_id', e.target.value)}
                    disabled={!formData.region_id || loadingProvinces}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-neutral-main disabled:cursor-not-allowed ${
                      errors.province_id ? 'border-red-500' : 'border-neutral-border'
                    }`}
                    required
                  >
                    <option value="">
                      {!formData.region_id 
                        ? 'Prima seleziona una regione' 
                        : loadingProvinces 
                        ? 'Caricamento...' 
                        : 'Seleziona provincia'}
                    </option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name} ({province.code})
                      </option>
                    ))}
                  </select>
                  {errors.province_id && (
                    <p className="text-sm text-red-600 mt-1">{errors.province_id}</p>
                  )}
                </div>
              </div>

              {/* Campo Comune e Indirizzo */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Comune *"
                  placeholder="Milano"
                  value={formData.municipality_name}
                  onChange={(e) => handleChange('municipality_name', e.target.value)}
                  error={errors.municipality_name}
                  required
                />
                <Input
                  label="Indirizzo *"
                  placeholder="Via Roma 123"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  error={errors.address}
                  required
                />
              </div>
            </div>

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
                Salva Modifiche
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
