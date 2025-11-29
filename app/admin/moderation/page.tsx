'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import PropertyCard from '@/components/annunci/PropertyCard';
import ProductCard from '@/components/annunci/ProductCard';
import Loading from '@/components/ui/Loading';
import Button from '@/components/ui/Button';
import { Check, X } from 'lucide-react';

export default function ModerationPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'properties' | 'products'>('properties');
  const supabase = createClient();

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    setLoading(true);

    const [propertiesRes, productsRes] = await Promise.all([
      supabase
        .from('properties')
        .select(`*, provinces (name, code)`)
        .eq('status', 'pending')
        .order('created_at', { ascending: true }),
      
      supabase
        .from('products')
        .select(`*, product_categories (name), provinces (name, code)`)
        .eq('status', 'pending')
        .order('created_at', { ascending: true }),
    ]);

    if (propertiesRes.data) setProperties(propertiesRes.data);
    if (productsRes.data) setProducts(productsRes.data);
    
    setLoading(false);
  };

  const handleApprove = async (id: string, type: 'property' | 'product') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const table = type === 'property' ? 'properties' : 'products';
    
    await supabase
      .from(table)
      .update({
        status: 'approved',
        approved_by: user.id,
        approved_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
      })
      .eq('id', id);

    loadPending();
  };

  const handleReject = async (id: string, type: 'property' | 'product') => {
    const reason = prompt('Motivo rifiuto:');
    if (!reason) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const table = type === 'property' ? 'properties' : 'products';
    
    await supabase
      .from(table)
      .update({
        status: 'rejected',
        rejected_reason: reason,
        approved_by: user.id,
      })
      .eq('id', id);

    loadPending();
  };

  return (
    <div className="min-h-screen bg-neutral-main py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Moderazione Annunci
          </h1>
          <p className="text-text-secondary">
            Approva o rifiuta gli annunci in attesa
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
                    <p className="text-text-secondary">Nessun immobile da moderare</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <div key={property.id}>
                        <PropertyCard
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
                          status="pending"
                          showStatus={true}
                        />
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="primary"
                            size="sm"
                            fullWidth
                            onClick={() => handleApprove(property.id, 'property')}
                          >
                            <Check className="w-4 h-4" />
                            Approva
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            fullWidth
                            onClick={() => handleReject(property.id, 'property')}
                          >
                            <X className="w-4 h-4" />
                            Rifiuta
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'products' && (
              <>
                {products.length === 0 ? (
                  <div className="bg-white rounded-xl border border-neutral-border p-12 text-center">
                    <p className="text-text-secondary">Nessun prodotto da moderare</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product.id}>
                        <ProductCard
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
                          status="pending"
                          showStatus={true}
                        />
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="secondary"
                            size="sm"
                            fullWidth
                            onClick={() => handleApprove(product.id, 'product')}
                          >
                            <Check className="w-4 h-4" />
                            Approva
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            fullWidth
                            onClick={() => handleReject(product.id, 'product')}
                          >
                            <X className="w-4 h-4" />
                            Rifiuta
                          </Button>
                        </div>
                      </div>
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
