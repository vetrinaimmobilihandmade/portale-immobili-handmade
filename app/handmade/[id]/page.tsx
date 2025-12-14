'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Palette, Calendar, Lock, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ContactSection from '@/components/ContactSection';

export default function ProductDetailPage() {
  const params = useParams();
  const supabase = createClient();
  
  const [product, setProduct] = useState<any>(null);
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

      // Carica prodotto
      const { data, error } = await supabase
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

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Funzioni galleria
  const images = product?.product_images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];
  
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Prodotto non trovato</h1>
          <Link href="/handmade">
            <Button variant="secondary">Torna ai prodotti</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentImage = images[selectedImageIndex]?.full_url || product.cover_image_url;

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
                    alt={product.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Palette className="w-24 h-24 text-text-disabled" />
                  </div>
                )}
                
                {/* Badge personalizzabile */}
                {product.is_customizable && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="default" className="bg-secondary text-white text-base">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Personalizzabile
                    </Badge>
                  </div>
                )}

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
                            ? 'border-secondary shadow-md scale-105'
                            : 'border-neutral-border hover:border-secondary/50'
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

              {/* Descrizione */}
              {product.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">Descrizione</h2>
                  <p className="text-text-secondary whitespace-pre-line">{product.description}</p>
                </div>
              )}

              {/* Dettagli */}
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

              {/* Personalizzazione */}
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

              {/* Contatti */}
              {user ? (
                <ContactSection
                  listingType="product"
                  listingTitle={product.title}
                  sellerEmail={product.contact_email}
                  sellerName={product.contact_name}
                />
              ) : (
                <div className="bg-secondary-lighter rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-neutral-main rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-text-disabled" />
                  </div>
                  <p className="text-text-secondary mb-4">
                    Devi essere registrato per contattare l'artigiano
                  </p>
                  <Link href={`/auth/login?redirect=/handmade/${product.id}`}>
                    <Button variant="secondary">
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
              alt={product.title}
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
