'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import ImageUpload from '@/components/ImageUpload';
import ShareSocial from '@/components/ShareSocial';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { AlertCircle, CheckCircle, Palette } from 'lucide-react';

export default function NuovoHandmadePage() {
  const router = useRouter();
  const { userId, canPublishListings, loading: roleLoading } = useUserRole();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

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
    if (!roleLoading && !canPublishListings) {
      router.push('/dashboard/nuovo');
    }
    loadCategories();
  }, [roleLoading, canPublishListings, router]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('product_categories')
      .select('*')
      .eq('status', 'approved')
      .order('name');
    
    if (data) setCategories(data);
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
      newErrors.images = 'Devi caricare almeno 2 foto del prodotto';
    } else if (imageUrls.length < 2) {
      newErrors.images = `Hai caricato ${imageUrls.length} foto. Minimo richiesto: 2 foto`;
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

    if (!userId) {
      setError('Devi essere loggato per pubblicare un annuncio');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('email, phone, full_name')
        .eq('id', userId)
        .single();

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          user_id: userId,
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
          contact_name: profile?.full_name || null,
          contact_email: profile?.email || null,
          contact_phone: profile?.phone || null,
          status: 'pending',
          views_count: 0,
          is_featured: false,
        })
        .select()
        .single();

      if (productError) throw productError;

      if (imageUrls.length > 0 && product) {
        const imageRecords = imageUrls.map((url, index) => ({
          product_id: product.id,
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

      setCreatedProductId(product.id);
      setSuccess(true);

    } catch (err: any) {
      console.error('Error creating product:', err);
      setError(err.message || 'Errore durante la creazione dell\'annuncio');
    } finally {
      setLoading(false);
    }
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (success && createdProductId) {
    const productUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/handmade/${createdProductId}`;
    
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2 text-center">
            Prodotto Creato!
          </h2>
          <p className="text-text-secondary mb-6 text-center">
            Il tuo prodotto è stato inviato in approvazione. Riceverai una notifica quando sarà pubblicato.
          </p>

          <ShareSocial
            title={formData.title}
            url={productUrl}
            type="product"
          />

          <Button 
            onClick={() => router.push('/dashboard/annunci')} 
            variant="secondary"
            fullWidth
          >
            Vai ai Miei Annunci
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-main py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-8 h-8 text-secondary" />
            <h1 className="text-3xl font-bold text-text-primary">
              Nuovo Prodotto Handmade
            </h1>
          </div>
          <p className="text-text-secondary">
            Vendi le tue creazioni artigianali uniche
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
              Foto Prodotto * (minimo 2)
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
                Foto caricate: <strong className={imageUrls.length >= 2 ? 'text-green-600' : 'text-red-600'}>
                  {imageUrls.length}/2 (minimo)
                </strong>
              </p>
              {imageUrls.length < 2 && (
                <p className="text-xs text-red-600 font-medium">
                  ⚠️ Mancano {2 - imageUrls.length} foto
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Nota:</strong> I tuoi dati di contatto (email e telefono) saranno visibili agli utenti interessati al tuo prodotto.
              </p>
            </div>

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
                variant="secondary"
                isLoading={loading}
                className="flex-1"
              >
                Pubblica Prodotto
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
