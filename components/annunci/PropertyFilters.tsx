'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

interface PropertyFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  search?: string;
  property_type?: string;
  property_category?: string;
  region_id?: number;
  province_id?: number;
  municipality_name?: string;
  rooms_min?: number;
  surface_min?: number;
}

export default function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({});
  const [regions, setRegions] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    loadRegions();
  }, []);

  useEffect(() => {
    if (filters.region_id) {
      loadProvinces(filters.region_id);
    } else {
      setProvinces([]);
    }
  }, [filters.region_id]);

  const loadRegions = async () => {
    const { data } = await supabase
      .from('regions')
      .select('*')
      .order('name');
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

  const handleChange = (key: keyof FilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    
    if (key === 'region_id') {
      delete newFilters.province_id;
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    setProvinces([]);
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-border p-6 space-y-4">
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-text-primary">Filtri</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-text-secondary"
        >
          <X className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      <Input
        placeholder="Cerca per titolo..."
        value={filters.search || ''}
        onChange={(e) => handleChange('search', e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-4">
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Tipo
          </label>
          <select
            value={filters.property_type || ''}
            onChange={(e) => handleChange('property_type', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tutti</option>
            <option value="vendita">Vendita</option>
            <option value="affitto">Affitto</option>
            <option value="affitto_breve">Affitto Breve</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Categoria
          </label>
          <select
            value={filters.property_category || ''}
            onChange={(e) => handleChange('property_category', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tutte</option>
            <option value="appartamento">Appartamento</option>
            <option value="villa">Villa</option>
            <option value="terreno">Terreno</option>
            <option value="ufficio">Ufficio</option>
            <option value="negozio">Negozio</option>
            <option value="garage">Garage</option>
            <option value="altro">Altro</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Regione
          </label>
          <select
            value={filters.region_id || ''}
            onChange={(e) => handleChange('region_id', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-4 py-3 bg-white border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tutte</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Provincia
          </label>
          <select
            value={filters.province_id || ''}
            onChange={(e) => handleChange('province_id', e.target.value ? Number(e.target.value) : undefined)}
            disabled={!filters.region_id}
            className="w-full px-4 py-3 bg-white border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-neutral-main disabled:cursor-not-allowed"
          >
            <option value="">Tutte</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label="Comune"
        placeholder="es. Milano"
        value={filters.municipality_name || ''}
        onChange={(e) => handleChange('municipality_name', e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Locali minimo"
          type="number"
          min="1"
          placeholder="es. 2"
          value={filters.rooms_min || ''}
          onChange={(e) => handleChange('rooms_min', e.target.value ? Number(e.target.value) : undefined)}
        />

        <Input
          label="Superficie minima (m²)"
          type="number"
          min="1"
          placeholder="es. 50"
          value={filters.surface_min || ''}
          onChange={(e) => handleChange('surface_min', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>
    </div>
  );
}
