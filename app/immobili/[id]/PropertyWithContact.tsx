'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Home, Bed, Bath, Maximize, Calendar, MessageCircle, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ContactModal from '@/components/ContactModal';

interface PropertyWithContactProps {
  property: any;
  user: any;
  typeLabels: any;
  categoryLabels: any;
  images: any[];
  formatDate: (date: string) => string;
}

export default function PropertyWithContact({
  property,
  user,
  typeLabels,
  categoryLabels,
  images,
  formatDate,
}: PropertyWithContactProps) {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <>
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
                  {typeLabels[property.property_type]}
                </Badge>
              </div>
            </div>

            <div className="p-8">
              
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  {property.title}
                </h1>
                {(property.municipality_name || property.provinces?.name) && (
                  <div className="flex items-center gap-2 text-text-secondary mb-4">
                    <MapPin className="w-5 h-5" />
                    <span>
                      {property.municipality_name}
                      {property.provinces?.name && ` (${property.provinces.code})`}
                    </span>
                  </div>
                )}
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
                      {categoryLabels[property.property_category]}
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

              {/* Contatti */}
              <div className="bg-primary-lighter rounded-xl p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Contatta l'inserzionista
                </h2>
                
                {user ? (
                  <Button 
                    variant="primary" 
                    fullWidth
                    onClick={() => setShowContactModal(true)}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Invia Messaggio
                  </Button>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-neutral-main rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-text-disabled" />
                    </div>
                    <p className="text-text-secondary mb-4">
                      Devi essere registrato per contattare l'inserzionista
                    </p>
                    <Link href={`/auth/login?redirect=/immobili/${property.id}`}>
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

      {/* Contact Modal */}
      {user && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          listingType="property"
          listingId={property.id}
          listingTitle={property.title}
          sellerEmail={property.contact_email}
          sellerName={property.contact_name}
        />
      )}
    </>
  );
}
