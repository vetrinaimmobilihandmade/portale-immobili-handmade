// PARTE 1 di 2 - Copia questo, poi continua con PARTE 2

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function NuovoAnnuncioPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'property';
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [regions, setRegions] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    region_id: '',
    province_id: '',
    municipality_name: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
  });

  useEffect(() => {
    loadRegions();
    if (type === 'product') loadCategories();
  }, [type]);

  useEffect(() => {
    if (formData.region_id) {
      loadProvinces(formData.region_id);
    }
  }, [formData.region_id]);

  const loadRegions = async () => {
    const { data } = await supabase.from('regions').select('*').order('name');
    if (data) setRegions(data);
  };

  const loadProvinces = async (regionId: number) => {
    const { data } = await supabase
      .from('provinces')
      .select('*')
      .eq('region_id', regionId)
      .order('name');
    if (data) setProvinces(data);
  };

  const loadCategories = async () => {
    const { data } = await supabase
      .from('product_categories')
      .select('*')
      .eq('status', 'approved')
      .order('name');
    if (data) setCategories(data);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (type === 'property') {
        const { error: insertError } = await supabase.from('properties').insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          property_type: formData.property_type,
          property_category: formData.property_category,
          region_id: formData.region_id ? Number(formData.region_id) : null,
          province_id: formData.province_id ? Number(formData.province_id) : null,
          municipality_name: formData.municipality_name,
          surface_mq: formData.surface_mq ? Number(formData.surface_mq) : null,
          rooms: formData.rooms ? Number(formData.rooms) : null,
          bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
          contact_name: formData.contact_name,
          contact_phone: formData.contact_phone,
          contact_email: formData.contact_email,
          status: 'pending',
        });

        if (insertError) throw insertError;
      } else {
        const { error: insertError } = await supabase.from('products').insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category_id: formData.category_id || null,
          region_id: formData.region_id ? Number(formData.region_id) : null,
          province_id: formData.province_id ? Number(formData.province_id) : null,
          municipality_name: formData.municipality_name,
          materials: formData.materials,
          dimensions: formData.dimensions,
          is_customizable: formData.is_customizable || false,
          contact_name: formData.contact_name,
          contact_phone: formData.contact_phone,
          contact_email: formData.contact_email,
          status: 'pending',
        });

        if (insertError) throw insertError;
      }

      router.push('/dashboard/annunci');
    } catch (err: any) {
      setError(err.message || 'Errore durante la creazione');
    } finally {
      setLoading(false);
    }
  };

// CONTINUA con PARTE 2...
// PARTE 2 di 2 - Aggiungi DOPO la PARTE 1, chiudendo la funzione handleSubmit

  return (
    <div className="min-h-screen bg-neutral-main py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {type === 'property' ? 'Nuovo Immobile' : 'Nuovo Prodotto'}
          </h1>
          <p className="text-text-secondary">
            L'annuncio sarà moderato prima della pubblicazione
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <Input
              label="Titolo"
              placeholder={type === 'property' ? 'es. Appartamento luminoso centro' : 'es. Vaso in ceramica artigianale'}
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Descrizione
              </label>
              <textarea
                rows={5}
                placeholder="Descrivi nel dettaglio..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {type === 'property' ? (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Tipo *</label>
                    <select
                      value={formData.property_type}
                      onChange={(e) => handleChange('property_type', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-neutral-border rounded-lg"
                    >
                      <option value="">Seleziona</option>
                      <option value="vendita">Vendita</option>
                      <option value="affitto">Affitto</option>
                      <option value="affitto_breve">Affitto Breve</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Categoria *</label>
                    <select
                      value={formData.property_category}
                      onChange={(e) => handleChange('property_category', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-neutral-border rounded-lg"
                    >
                      <option value="">Seleziona</option>
                      <option value="appartamento">Appartamento</option>
                      <option value="villa">Villa</option>
                      <option value="terreno">Terreno</option>
                      <option value="ufficio">Ufficio</option>
                      <option value="negozio">Negozio</option>
                      <option value="garage">Garage</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Input label="Superficie (m²)" type="number" value={formData.surface_mq} onChange={(e) => handleChange('surface_mq', e.target.value)} />
                  <Input label="Locali" type="number" value={formData.rooms} onChange={(e) => handleChange('rooms', e.target.value)} />
                  <Input label="Bagni" type="number" value={formData.bathrooms} onChange={(e) => handleChange('bathrooms', e.target.value)} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Categoria</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => handleChange('category_id', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-border rounded-lg"
                  >
                    <option value="">Seleziona</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <Input label="Materiali" placeholder="es. Ceramica, legno" value={formData.materials} onChange={(e) => handleChange('materials', e.target.value)} />
                <Input label="Dimensioni" placeholder="es. 20x30x15 cm" value={formData.dimensions} onChange={(e) => handleChange('dimensions', e.target.value)} />
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_customizable}
                    onChange={(e) => handleChange('is_customizable', e.target.checked)}
                    className="w-5 h-5 text-secondary"
                  />
                  <span className="text-text-primary">Personalizzabile</span>
                </label>
              </>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Regione</label>
                <select value={formData.region_id} onChange={(e) => handleChange('region_id', e.target.value)} className="w-full px-4 py-3 border border-neutral-border rounded-lg">
                  <option value="">Seleziona</option>
                  {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Provincia</label>
                <select value={formData.province_id} onChange={(e) => handleChange('province_id', e.target.value)} disabled={!formData.region_id} className="w-full px-4 py-3 border border-neutral-border rounded-lg">
                  <option value="">Seleziona</option>
                  {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <Input label="Comune" placeholder="es. Milano" value={formData.municipality_name} onChange={(e) => handleChange('municipality_name', e.target.value)} />

            <div className="border-t border-neutral-border pt-6">
              <h3 className="font-semibold text-lg text-text-primary mb-4">Contatti</h3>
              <div className="space-y-4">
                <Input label="Nome contatto" value={formData.contact_name} onChange={(e) => handleChange('contact_name', e.target.value)} />
                <Input label="Telefono" type="tel" value={formData.contact_phone} onChange={(e) => handleChange('contact_phone', e.target.value)} />
                <Input label="Email" type="email" value={formData.contact_email} onChange={(e) => handleChange('contact_email', e.target.value)} />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
              Pubblica Annuncio
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
