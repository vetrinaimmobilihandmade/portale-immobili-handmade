'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { AlertCircle, CheckCircle, Home, Palette, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminEditListingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const listingId = params.id as string;
  const listingType = searchParams.get('type') as 'property' | 'product';

  const [user, setUser] = useState<any>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    if (canEdit) {
      loadListing();
      if (listingType === 'product') {
        loadCategories();
      }
    }
  }, [canEdit, listingId, listingType]);

  const checkPermissions = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single() as { data: { role: string } | null };

    const canMod = profile?.role === 'admin' || profile?.role === 'editor';
    setCanEdit(canMod);
    setUser(currentUser);

    if (!canMod) {
      router.push('/dashboard');
    }
  };

  const loadCategories = async () => {
    const { data } = await supabase
      .from('product_categories')
      .select('*')
      .eq('status', 'approved')
      .order('name');
    
    if (data) setCategories(data);
  };

  const loadListing = async () => {
    setLoading(true);
    const table = listingType === 'property' ? 'properties' : 'products';
    const imagesTable = listingType === 'property' ? 'property_images' : 'product_images';

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', listingId)
      .single();

    if (error || !data) {
      setError('Annuncio non trovato');
      setLoading(false);
      return;
    }

    setFormData(data);

    // Carica immagini
    const { data: images } = await supabase
      .from(imagesTable)
      .select('full_url, display_order')
      .eq(listingType === 'property' ? 'property_id' : 'product_id', listingId)
      .order('display_order');

    if (images) {
      setImageUrls(images.map(img => img.full_url));
    }

    setLoading(false);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) newErrors.title = 'Titolo richiesto';
    if (formData.title?.length < 10) newErrors.title = 'Minimo 10 caratteri';
    if (!formData.description?.trim()) newErrors.description = 'Descrizione richiesta';
    if (formData.description?.length < 50) newErrors.description = 'Minimo 50 caratteri';

    if (listingType === 'property') {
      if (!formData.municipality_name?.trim()) newErrors.municipality_name = 'Comune richiesto';
    }

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
      const table = listingType === 'property' ? 'properties' : 'products';
      const imagesTable = listingType === 'property' ? 'property_images' : 'product_images';
      const idField = listingType === 'property' ? 'property_id' : 'product_id';

      // Update annuncio
      const updateData = {
        ...formData,
        cover_image_url: imageUrls[0] || null,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', listingId);

      if (updateError) throw updateError;

      // Update immagini se cambiate
      if (imageUrls.length > 0) {
        // Elimina vecchie immagini
        await supabase
          .from(imagesTable)
          .delete()
          .eq(idField, listingId);

        // Inserisci nuove immagini
        const imageRecords = imageUrls.map((url, index) => ({
          [idField]: listingId,
          thumbnail_url: url,
          full_url: url,
          display_order: index,
        }));

        await supabase.from(imagesTable).insert(imageRecords);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/moderation');
      }, 2000);

    } catch (err: any) {
      console.error('Error updating listing:', err);
      setError(err.message || 'Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
            Annuncio Aggiornato!
          </h2>
          <p className="text-text-secondary mb-4">
            Le modifiche sono state salvate con successo.
          </p>
          <Button onClick={() => router.push('/admin/moderation')} variant="primary">
            Torna alla Moderazione
          </Button>
        </div>
      </div>
    );
  }

  const isProperty = listingType === 'property';
  const Icon = isProperty ? Home : Palette;

  return (
    <div className="min-h-screen bg-neutral-main py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/moderation"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna alla Moderazione
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <Icon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-text-primary">
              Modifica {isProperty ? 'Immobile' : 'Prodotto'}
            </h1>
          </div>
          <p className="text-text-secondary">
            Modifica i dettagli dell'annuncio come amministratore
          </p>
        </div>

        {/* Error generale */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8">
          
          {/* Immagini */}
          <div className="mb-8">
            <ImageUpload
              bucket={isProperty ? 'property-images' : 'product-images'}
              userId={formData.user_id || ''}
              maxImages={10}
              maxSizeMB={5}
              onImagesChange={setImageUrls}
              initialImages={imageUrls}
            />
          </div>

          <div className="space-y-6">
            
            {/* Tipo e Categoria (Property) */}
            {isProperty && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Tipo Annuncio *
                  </label>
                  <select
                    value={formData.property_type || 'vendita'}
                    onChange={(e) => handleChange('property_type', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                    value={formData.property_category || 'appartamento'}
                    onChange={(e) => handleChange('property_category', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
            )}

            {/* Categoria (Product) */}
            {!isProperty && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Categoria
                </label>
                <select
                  value={formData.category_id || ''}
                  onChange={(e) => handleChange('category_id', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Seleziona categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Titolo */}
            <Input
              label="Titolo *"
              placeholder="Titolo annuncio"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              error={errors.title}
              required
            />

            {/* Descrizione */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Descrizione *
              </label>
              <textarea
                placeholder="Descrizione dettagliata..."
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                  errors.description ? 'border-red-500' : 'border-neutral-border'
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Campi specifici Property */}
            {isProperty && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Indirizzo"
                    value={formData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                  <Input
                    label="Comune *"
                    value={formData.municipality_name || ''}
                    onChange={(e) => handleChange('municipality_name', e.target.value)}
                    error={errors.municipality_name}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Input
                    label="Superficie (mq)"
                    type="number"
                    value={formData.surface_mq || ''}
                    onChange={(e) => handleChange('surface_mq', e.target.value)}
                  />
                  <Input
                    label="Locali"
                    type="number"
                    value={formData.rooms || ''}
                    onChange={(e) => handleChange('rooms', e.target.value)}
                  />
                  <Input
                    label="Camere"
                    type="number"
                    value={formData.bedrooms || ''}
                    onChange={(e) => handleChange('bedrooms', e.target.value)}
                  />
                  <Input
                    label="Bagni"
                    type="number"
                    value={formData.bathrooms || ''}
                    onChange={(e) => handleChange('bathrooms', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Campi specifici Product */}
            {!isProperty && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Materiali"
                    value={formData.materials || ''}
                    onChange={(e) => handleChange('materials', e.target.value)}
                  />
                  <Input
                    label="Dimensioni"
                    value={formData.dimensions || ''}
                    onChange={(e) => handleChange('dimensions', e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Peso (grammi)"
                    type="number"
                    value={formData.weight_grams || ''}
                    onChange={(e) => handleChange('weight_grams', e.target.value)}
                  />
                  <Input
                    label="Tempo realizzazione (giorni)"
                    type="number"
                    value={formData.production_time_days || ''}
                    onChange={(e) => handleChange('production_time_days', e.target.value)}
                  />
                </div>

                <Input
                  label="Comune"
                  value={formData.municipality_name || ''}
                  onChange={(e) => handleChange('municipality_name', e.target.value)}
                />

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="customizable"
                    checked={formData.is_customizable || false}
                    onChange={(e) => handleChange('is_customizable', e.target.checked)}
                    className="mt-1 w-5 h-5"
                  />
                  <label htmlFor="customizable" className="flex-1 cursor-pointer">
                    <span className="font-medium text-text-primary">Prodotto personalizzabile</span>
                    <p className="text-sm text-text-secondary mt-1">
                      Offri la possibilità di personalizzare questo prodotto
                    </p>
                  </label>
                </div>

                {formData.is_customizable && (
                  <Input
                    label="Note personalizzazione"
                    value={formData.customization_notes || ''}
                    onChange={(e) => handleChange('customization_notes', e.target.value)}
                  />
                )}
              </>
            )}

            {/* Status Admin */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Stato Annuncio
              </label>
              <select
                value={formData.status || 'pending'}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="pending">In Attesa</option>
                <option value="approved">Approvato</option>
                <option value="rejected">Rifiutato</option>
                <option value="archived">Archiviato</option>
              </select>
              <p className="text-xs text-blue-800 mt-2">
                ℹ️ Puoi modificare lo stato direttamente da qui
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Link href="/admin/moderation" className="flex-1">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={saving}
                  fullWidth
                >
                  Annulla
                </Button>
              </Link>
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
