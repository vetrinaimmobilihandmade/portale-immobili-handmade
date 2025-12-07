'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { AlertCircle, CheckCircle, Palette, ArrowLeft } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    materials: '',
    dimensions: '',
    weight_grams: '',
    production_time_days: '',
    is_customizable: false,
    customization_notes: '',
    municipality_name: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCategories();
    checkOwnershipAndLoad();
  }, [params.id]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('product_categories')
      .select('*')
      .eq('status', 'approved')
      .order('name');
    
    if (data) setCategories(data);
  };

  const checkOwnershipAndLoad = async () => {
    try {
      // Verifica utente loggato
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUserId(user.id);

      // Carica prodotto
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          product_images (thumbnail_url, full_url, display_order)
        `)
        .eq('id', params.id)
        .single();

      if (fetchError) throw fetchError;

      // ✅ VERIFICA 1: Solo il proprietario può modificare
      if (data.user_id !== user.id) {
        setError('Non hai i permessi per modificare questo annuncio');
        setTimeout(() => router.push('/dashboard/annunci'), 2000);
        return;
      }

      // ✅ VERIFICA 2: Non si possono modificare annunci archiviati o rifiutati
      if (data.status === 'archived' || data.status === 'rejected') {
        setError(`Non puoi modificare annunci ${data.status === 'archived' ? 'archiviati' : 'rifiutati'}`);
        setTimeout(() => router.push('/dashboard/annunci'), 2000);
        return;
      }

      setProduct(data);
      
      setFormData({
        title: data.title || '',
        description: data.description || '',
        category_id: data.category_id || '',
        materials: data.materials || '',
        dimensions: data.dimensions || '',
        weight_grams: data.weight_grams?.toString() || '',
        production_time_days: data.production_time_days?.toString() || '',
        is_customizable: data.is_customizable || false,
        customization_notes: data.customization_notes || '',
        municipality_name: data.municipality_name || '',
      });

      const images = data.product_images
        ?.sort((a: any, b: any) => a.display_order - b.display_order)
        .map((img: any) => img.full_url) || [];
      setImageUrls(images);

    } catch (err: any) {
      console.error('Error loading product:', err);
      setError('Errore nel caricamento del prodotto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
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
    if (!formData.municipality_name.trim()) newErrors.municipality_name = 'Comune richiesto';
    
    if (imageUrls.length === 0) {
      newErrors.images = 'Devi caricare almeno 3 foto del prodotto';
    } else if (imageUrls.length < 3) {
      newErrors.images = `Hai caricato ${imageUrls.length} foto. Minimo richiesto: 3 foto`;
    }
    
    if (formData.is_customizable && !formData.customization_notes.trim()) {
      newErrors.customization_notes = 'Specifica le opzioni di personalizzazione';
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
      // ✅ UPDATE: Aggiorna prodotto e TORNA IN PENDING
      const { error: updateError } = await supabase
        .from('products')
        .update({
          title: formData.title,
          description: formData.description,
          category_id: formData.category_id || null,
          materials: formData.materials || null,
          dimensions: formData.dimensions || null,
          weight_grams: formData.weight_grams ? parseInt(formData.weight_grams) : null,
          production_time_days: formData.production_time_days ? parseInt(formData.production_time_days) : null,
          is_customizable: formData.is_customizable,
          customization_notes: formData.customization_notes || null,
          municipality_name: formData.municipality_name,
          cover_image_url: imageUrls[0] || null,
          status: 'pending', // ✅ TORNA IN PENDING
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (updateError) throw updateError;

      // Aggiorna immagini
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', params.id);

      if (imageUrls.length > 0) {
        const imageRecords = imageUrls.map((url, index) => ({
          product_id: params.id as string,
          thumbnail_url: url,
          full_url: url,
          display_order: index,
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageRecords);

        if (imagesError) {
          console.error('Error inserting images:', imagesError);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/annunci');
      }, 1500);

    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.message || 'Errore durante l\'aggiornamento');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
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
            Prodotto Aggiornato!
          </h2>
          <p className="text-text-secondary mb-4">
            Le modifiche sono state salvate. L'annuncio è tornato in attesa di approvazione.
          </p>
          <p className="text-sm text-text-secondary">
            Reindirizzamento alla dashboard...
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
            onClick={() => router.push('/dashboard/annunci')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna agli Annunci
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-8 h-8 text-secondary" />
            <h1 className="text-3xl font-bold text-text-primary">
              Modifica Prodotto
            </h1>
          </div>
          <p className="text-text-secondary">
            Modifica i dati del tuo prodotto. Dopo il salvataggio tornerà in attesa di approvazione.
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
            <label className="block text-sm font-medium text-text-primary mb-2">
              Foto Prodotto * (minimo 3)
            </label>
            <ImageUpload
              bucket="product-images"
              userId={userId || ''}
              maxImages={10}
              maxSizeMB={5}
              onImagesChange={setImageUrls}
              initialImages={imageUrls}
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-text-secondary">
                Foto caricate: <strong className={imageUrls.length >= 3 ? 'text-green-600' : 'text-red-600'}>
                  {imageUrls.length}/3 (minimo)
                </strong>
              </p>
              {imageUrls.length < 3 && (
                <p className="text-xs text-red-600 font-medium">
                  ⚠️ Mancano {3 - imageUrls.length} foto
                </p>
              )}
            </div>
            {errors.images && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.images}
              </p>
            )}
          </div>

          <div className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Categoria
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => handleChange('category_id', e.target.value)}
                className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                <option value="">Seleziona categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Titolo Prodotto *"
              placeholder="Es: Vaso in ceramica fatto a mano"
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
                placeholder="Descrivi il prodotto, i materiali utilizzati, le tecniche di lavorazione..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent resize-none ${
                  errors.description ? 'border-red-500' : 'border-neutral-border'
                }`}
                required
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-text-secondary mt-1">Minimo 50 caratteri</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Materiali"
                placeholder="Es: Argilla, smalti naturali"
                value={formData.materials}
                onChange={(e) => handleChange('materials', e.target.value)}
                helperText="Materiali utilizzati"
              />
              <Input
                label="Dimensioni"
                placeholder="Es: 20cm x 15cm x 10cm"
                value={formData.dimensions}
                onChange={(e) => handleChange('dimensions', e.target.value)}
                helperText="Lunghezza x Larghezza x Altezza"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Peso (grammi)"
                type="number"
                placeholder="500"
                value={formData.weight_grams}
                onChange={(e) => handleChange('weight_grams', e.target.value)}
                helperText="Peso del prodotto in grammi"
              />
              <Input
                label="Tempo di realizzazione (giorni)"
                type="number"
                placeholder="7"
                value={formData.production_time_days}
                onChange={(e) => handleChange('production_time_days', e.target.value)}
                helperText="Giorni necessari per la produzione"
              />
            </div>

            <Input
              label="Comune *"
              placeholder="Milano"
              value={formData.municipality_name}
              onChange={(e) => handleChange('municipality_name', e.target.value)}
              error={errors.municipality_name}
              required
            />

            <div className="bg-secondary-lighter border border-secondary-light rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <input
                  type="checkbox"
                  id="customizable"
                  checked={formData.is_customizable}
                  onChange={(e) => handleChange('is_customizable', e.target.checked)}
                  className="mt-1 w-5 h-5 text-secondary border-gray-300 rounded focus:ring-secondary"
                />
                <div className="flex-1">
                  <label htmlFor="customizable" className="font-medium text-text-primary cursor-pointer">
                    Prodotto personalizzabile
                  </label>
                  <p className="text-sm text-text-secondary mt-1">
                    Offri la possibilità di personalizzare questo prodotto su richiesta
                  </p>
                </div>
              </div>

              {formData.is_customizable && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Note sulla personalizzazione *
                  </label>
                  <textarea
                    placeholder="Descrivi le opzioni di personalizzazione disponibili (colori, incisioni, dimensioni custom, ecc.)"
                    value={formData.customization_notes}
                    onChange={(e) => handleChange('customization_notes', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent resize-none ${
                      errors.customization_notes ? 'border-red-500' : 'border-neutral-border'
                    }`}
                  />
                  {errors.customization_notes && (
                    <p className="text-sm text-red-600 mt-1">{errors.customization_notes}</p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Nota:</strong> Dopo aver salvato le modifiche, l'annuncio tornerà in stato "In Attesa" e dovrà essere nuovamente approvato dai moderatori.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/dashboard/annunci')}
                disabled={saving}
              >
                Annulla
              </Button>
              <Button
                type="submit"
                variant="secondary"
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
