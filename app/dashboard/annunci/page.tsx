'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import PropertyCard from '@/components/annunci/PropertyCard';
import ProductCard from '@/components/annunci/ProductCard';
import Loading from '@/components/ui/Loading';
import Button from '@/components/ui/Button';

export default function AnnunciPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'properties' | 'products'>('properties');
  const supabase = createClient();

  useEffect(() => {
    loadAnnunci();
  }, []);

  const loadAnnunci = async () => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const [propertiesRes, productsRes] = await Promise.all([
      supabase
        .from('properties')
        .select(`*, provinces (name, code)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      
      supabase
        .from('products')
        .select(`*, product_categories (name), provinces (name, code)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ]);

    if (propertiesRes.data) setProperties(propertiesRes.data);
    if (productsRes.data) setProducts(productsRes.data);
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-main py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            I Miei Annunci
          </h1>
          <p className="text-text-secondary">
            Gestisci tutti i tuoi annunci pubblicati
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-border mb-6">
          <div className="flex border-b border-neutral-border">
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'properties'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Immobili ({properties.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'products'
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Prodotti ({products.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loading size="lg" text="Caricamento..." />
          </div>
        ) : (
          <>
            {activeTab === 'properties' && (
              <>
                {properties.length === 0 ? (
                  <div className="bg-white rounded-xl border border-neutral-border p-12 text-center">
                    <p className="text-text-secondary mb-4">Nessun immobile pubblicato</p>
                    <Button variant="primary" onClick={() => window.location.href = '/dashboard/nuovo?type=property'}>
                      Pubblica Immobile
                    </Button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        id={property.id}
                        title={property.title}
                        description={property.description}
                        property_type={property.property_type}
                        property_category={property.property_category}
                        municipality_name={property.municipality_name}
                        province_name={property.provinces?.code}
                        cover_image_url={property.cover_image_url}
                        surface_mq={property.surface_mq}
                        rooms={property.rooms}
                        bathrooms={property.bathrooms}
                        created_at={property.created_at}
                        status={property.status}
                        showStatus={true}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'products' && (
              <>
                {products.length === 0 ? (
                  <div className="bg-white rounded-xl border border-neutral-border p-12 text-center">
                    <p className="text-text-secondary mb-4">Nessun prodotto pubblicato</p>
                    <Button variant="secondary" onClick={() => window.location.href = '/dashboard/nuovo?type=product'}>
                      Pubblica Prodotto
                    </Button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        description={product.description}
                        category_name={product.product_categories?.name}
                        municipality_name={product.municipality_name}
                        province_name={product.provinces?.code}
                        cover_image_url={product.cover_image_url}
                        materials={product.materials}
                        is_customizable={product.is_customizable}
                        created_at={product.created_at}
                        status={product.status}
                        showStatus={true}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
