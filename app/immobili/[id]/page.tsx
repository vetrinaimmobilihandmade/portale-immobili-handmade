'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Home, Bed, Bath, Maximize, Calendar, Lock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ContactSection from '@/components/ContactSection';
import { formatDate } from '@/lib/utils';

export default function PropertyDetailPage() {
  const params = useParams();
  const supabase = createClient();
  
  const [property, setProperty] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 🆕 Stati per la galleria
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      // Carica utente
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      // Carica immobile
      const { data, error } = await supabase
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

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Funzioni galleria
  const images = property?.property_images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];
  
  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!lightboxOpen) return;
    if (e.key === 'ArrowLeft') handlePrevImage();
    if (e.key === 'ArrowRight') handleNextImage();
    if (e.key === 'Escape') setLightboxOpen(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, selectedImageIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Annuncio non trovato</h1>
          <Link href="/immobili">
            <Button variant="primary">Torna agli immobili</Button>
          </Link>
        </div>
      </div>
    );
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

  const currentImage = images[selectedImageIndex]?.full_url || property.cover_image_url;

  return (
    <>
      <div className="min-h-screen bg-neutral-main py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            
            {/* 🆕 Galleria Immagini Principale */}
            <div className="relative">
              
              {/* Immagine principale */}
              <div 
                className="relative aspect-[16/9] bg-neutral-main cursor-pointer group"
                onClick={() => setLightboxOpen(true)}
              >
                {currentImage ? (
                  <Image
                    src={currentImage}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-24 h-24 text-text-disabled" />
                  </div>
                )}
                
                {/* Badge tipo */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="default" className="bg-primary text-white text-base">
                    {typeLabels[property.property_type as keyof typeof typeLabels]}
                  </Badge>
                </div>

                {/* Contatore immagini */}
                {images.length > 0 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium bg-black/50 px-4 py-2 rounded-lg">
                    Click per ingrandire
                  </span>
                </div>
              </div>

              {/* 🆕 Thumbnails scorrevoli */}
              {images.length > 1 && (
                <div className="bg-neutral-main p-4">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? 'border-primary shadow-md scale-105'
                            : 'border-neutral-border hover:border-primary/50'
                        }`}
                      >
                        <Image
                          src={img.thumbnail_url}
                          alt={`Foto ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
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

              {/* Contatti */}
              {user ? (
                <ContactSection
                  listingType="property"
                  listingTitle={property.title}
                  sellerEmail={property.contact_email}
                  sellerName={property.contact_name}
                />
              ) : (
                <div className="bg-primary-lighter rounded-xl p-6 text-center">
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

      {/* 🆕 Lightbox Full Screen */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          
          {/* Chiudi */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Contatore */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-sm z-10">
            {selectedImageIndex + 1} / {images.length}
          </div>

          {/* Immagine */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={currentImage}
              alt={property.title}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Freccia Sinistra */}
          {images.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
          )}

          {/* Freccia Destra */}
          {images.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          )}

          {/* Thumbnails in basso */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-2xl w-full px-4">
              <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-white shadow-lg scale-110'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <Image
                      src={img.thumbnail_url}
                      alt={`Foto ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSS per nascondere scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
