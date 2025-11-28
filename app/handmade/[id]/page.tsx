import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Palette, Calendar, Mail, Phone, User, Sparkles, Package } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_categories (name),
      provinces (name, code),
      product_images (thumbnail_url, full_url, display_order)
    `)
    .eq('id', params.id)
    .eq('status', 'approved')
    .single();

  if (error || !product) {
    notFound();
  }

  const images = product.product_images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];

  return (
    <div className="min-h-screen bg-neutral-main py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-xl overflow-hidden shadow-md">
          
          <div className="relative aspect-[16/9] bg-neutral-main">
            {product.cover_image_url || images[0] ? (
              <Image
                src={product.cover_image_url || images[0]?.full_url}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Palette className="w-24 h-24 text-text-disabled" />
              </div>
            )}
            
            {product.is_customizable && (
              <div className="absolute top-4 left-4">
                <Badge variant="default" className="bg-secondary text-white text-base">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Personalizzabile
                </Badge>
              </div>
            )}
          </div>

          <div className="p-8">
            
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-2">
                    {product.title}
                  </h1>
                  {(product.municipality_name || product.provinces?.name) && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <MapPin className="w-5 h-5" />
                      <span>
                        {product.municipality_name}
                        {product.provinces?.name && ` (${product.provinces.code})`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {product.product_categories && (
                <Badge variant="default" className="mb-4">
                  {product.product_categories.name}
                </Badge>
              )}

              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="w-4 h-4" />
                <span>Pubblicato il {formatDate(product.created_at)}</span>
              </div>
            </div>

            {product.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Descrizione</h2>
                <p className="text-text-secondary whitespace-pre-line">{product.description}</p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Dettagli</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                
                {product.materials && (
                  <div className="flex justify-between py-3 border-b border-neutral-border">
                    <span className="text-text-secondary">Materiali</span>
                    <span className="font-medium text-text-primary">{product.materials}</span>
                  </div>
                )}
                
                {product.dimensions && (
                  <div className="flex justify-between py-3 border-b border-neutral-border">
                    <span className="text-text-secondary">Dimensioni</span>
                    <span className="font-medium text-text-primary">{product.dimensions}</span>
                  </div>
                )}
                
                {product.weight_grams && (
                  <div className="flex justify-between py-3 border-b border-neutral-border">
                    <span className="text-text-secondary">Peso</span>
                    <span className="font-medium text-text-primary">{product.weight_grams}g</span>
                  </div>
                )}
                
                {product.production_time_days && (
                  <div className="flex justify-between py-3 border-b border-neutral-border">
                    <span className="text-text-secondary">Tempo realizzazione</span>
                    <span className="font-medium text-text-primary">{product.production_time_days} giorni</span>
                  </div>
                )}
              </div>
            </div>

            {product.is_customizable && product.customization_notes && (
              <div className="mb-8 bg-secondary-lighter border border-secondary-light rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-secondary mt-1" />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Personalizzazione</h3>
                    <p className="text-text-secondary">{product.customization_notes}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-secondary-lighter rounded-xl p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Contatta l'artigiano</h2>
              <div className="space-y-3">
                {product.contact_name && (
                  <div className="flex items-center gap-3 text-text-primary">
                    <User className="w-5 h-5" />
                    <span>{product.contact_name}</span>
                  </div>
                )}
                {product.contact_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-text-primary" />
                    <a href={`tel:${product.contact_phone}`} className="text-secondary hover:underline">
                      {product.contact_phone}
                    </a>
                  </div>
                )}
                {product.contact_email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-text-primary" />
                    <a href={`mailto:${product.contact_email}`} className="text-secondary hover:underline">
                      {product.contact_email}
                    </a>
                  </div>
                )}
              </div>
              <Button variant="secondary" fullWidth className="mt-4">
                Invia Messaggio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
