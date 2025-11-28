'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import PropertyCard from '@/components/annunci/PropertyCard';
import PropertyFilters, { FilterValues } from '@/components/annunci/PropertyFilters';
import Loading from '@/components/ui/Loading';
import { Home } from 'lucide-react';

export default function ImmobiliPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({});
  const supabase = createClient();

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    setLoading(true);
    
    let query = supabase
      .from('properties')
      .select(`
        *,
        regions (name),
        provinces (name, code)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    if (filters.property_type) {
      query = query.eq('property_type', filters.property_type);
    }

    if (filters.property_category) {
      query = query.eq('property_category', filters.property_category);
    }

    if (filters.region_id) {
      query = query.eq('region_id', filters.region_id);
    }

    if (filters.province_id) {
      query = query.eq('province_id', filters.province_id);
    }

    if (filters.municipality_name) {
      query = query.ilike('municipality_name', `%${filters.municipality_name}%`);
    }

    if (filters.rooms_min) {
      query = query.gte('rooms', filters.rooms_min);
    }

    if (filters.surface_min) {
      query = query.gte('surface_mq', filters.surface_min);
    }

    const { data, error } = await query;

    if (data) {
      setProperties(data);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-main py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            Immobili
          </h1>
          <p className="text-text-secondary">
            Trova la casa perfetta per te
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          <aside className="lg:col-span-1">
            <PropertyFilters onFilterChange={setFilters} />
          </aside>

          <main className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loading size="lg" text="Caricamento immobili..." />
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-xl border border-neutral-border p-12 text-center">
                <Home className="w-16 h-16 text-text-disabled mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Nessun immobile trovato
                </h3>
                <p className="text-text-secondary">
                  Prova a modificare i filtri di ricerca
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-text-secondary">
                  {properties.length} {properties.length === 1 ? 'immobile trovato' : 'immobili trovati'}
                </div>
                
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
                    />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
