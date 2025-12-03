import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Home, Bed, Bath, Maximize, Calendar, Mail, Phone, User, MessageCircle, Lock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // Verifica se l'utente è loggato
  const { data: { user } } = await supabase.auth.getUser();

  const { data: property, error } = await supabase
    .from('properties')
    .select(`
      *,
      regions (name),
      provinces (name, code),
      property_images (thumbnail_url, full_url, display_order)
    `)
    .eq('id', params.id)
    .eq('status', 'approved')
    .single();

  if (error || !property) {
    notFound();
  }

  const typeLabels = {
    vendita: 'Vendita',
    affitto: 'Affitto',
    affitto_breve: 'Affitto Breve',
  };

  const categoryLabels = {
    appartamento: 'Appartamento',
    villa: 'Villa',
    terreno: 'Terreno',
    ufficio: 'Ufficio',
    negozio: 'Negozio',
    garage: 'Garage',
    altro: 'Altro',
  };

  const images = property.property_images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];

  // Prepara messaggio WhatsApp
  const whatsappMessage = encodeURIComponent(
    `Ciao! Sono interessato a: ${property.title}\nLink: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://portale-immobili-handmade.vercel.app'}/immobili/${params.id}`
  );
  const whatsappLink = `https://wa.me/${property.contact_phone?.replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-neutral-main py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-xl overflow-hidden shadow-md">
          
          {/* Galleria Immagini */}
          <div className="relative aspect-[16/9] bg-neutral-main">
            {property.cover_image_url || images[0] ? (
              <Image
                src={property.cover_image_url || images[0]?.full_url}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home className="w-24 h-24 text-text-disabled" />
              </div>
            )}
            
            <div className="absolute top-4 left-4">
              <Badge variant="default" className="bg-primary text-white text-base">
                {typeLabels[property.property_type as keyof typeof typeLabels]}
              </Badge>
            </div>
          </div>

          <div className="p-8">
            
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-2">
                    {property.title}
                  </h1>
                  {(property.municipality_name || property.provinces?.name) && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <MapPin className="w-5 h-5" />
                      <span>
                        {property.municipality_name}
                        {property.provinces?.name && ` (${property.provinces.code})`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="w-4 h-4" />
                <span>Pubblicato il {formatDate(property.created_at)}</span>
              </div>
            </div>

            {/* Caratteristiche */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 pb-8 border-b border-neutral-border">
              {property.surface_mq && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center">
                    <Maximize className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">Superficie</div>
                    <div className="font-semibold text-text-primary">{property.surface_mq} m²</div>
                  </div>
                </div>
              )}
              
              {property.rooms && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center">
                    <Home className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">Locali</div>
                    <div className="font-semibold text-text-primary">{property.rooms}</div>
                  </div>
                </div>
              )}
              
              {property.bedrooms && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center">
                    <Bed className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">Camere</div>
                    <div className="font-semibold text-text-primary">{property.bedrooms}</div>
                  </div>
                </div>
              )}
              
              {property.bathrooms && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center">
                    <Bath className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">Bagni</div>
                    <div className="font-semibold text-text-primary">{property.bathrooms}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Descrizione */}
            {property.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Descrizione</h2>
                <p className="text-text-secondary whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Dettagli */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Dettagli</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex justify-between py-3 border-b border-neutral-border">
                  <span className="text-text-secondary">Categoria</span>
                  <span className="font-medium text-text-primary">
                    {categoryLabels[property.property_category as keyof typeof categoryLabels]}
                  </span>
                </div>
                {property.floor && (
                  <div className="flex justify-between py-3 border-b border-neutral-border">
                    <span className="text-text-secondary">Piano</span>
                    <span className="font-medium text-text-primary">{property.floor}</span>
                  </div>
                )}
                {property.year_built && (
                  <div className="flex justify-between py-3 border-b border-neutral-border">
                    <span className="text-text-secondary">Anno costruzione</span>
                    <span className="font-medium text-text-primary">{property.year_built}</span>
                  </div>
                )}
                {property.energy_class && (
                  <div className="flex justify-between py-3 border-b border-neutral-border">
                    <span className="text-text-secondary">Classe energetica</span>
                    <span className="font-medium text-text-primary">{property.energy_class}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contatti - Solo se loggato */}
            <div className="bg-primary-lighter rounded-xl p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Contatta l'inserzionista
              </h2>
              
              {user ? (
                <>
                  <div className="space-y-3 mb-4">
                    {property.contact_name && (
                      <div className="flex items-center gap-3 text-text-primary">
                        <User className="w-5 h-5" />
                        <span>{property.contact_name}</span>
                      </div>
                    )}
                    {property.contact_phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-text-primary" />
                        <a href={`tel:${property.contact_phone}`} className="text-primary hover:underline font-medium">
                          {property.contact_phone}
                        </a>
                      </div>
                    )}
                    {property.contact_email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-text-primary" />
                        <a href={`mailto:${property.contact_email}`} className="text-primary hover:underline font-medium">
                          {property.contact_email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Bottone WhatsApp */}
                  {property.contact_phone && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="primary" fullWidth className="bg-green-600 hover:bg-green-700">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Contatta su WhatsApp
                      </Button>
                    </a>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-neutral-main rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-text-disabled" />
                  </div>
                  <p className="text-text-secondary mb-4">
                    Devi essere registrato per vedere i contatti dell'inserzionista
                  </p>
                  <Link href={`/auth/login?redirect=/immobili/${params.id}`}>
                    <Button variant="primary">
                      Accedi o Registrati
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
