'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import ProductCard from '@/components/annunci/ProductCard';
import Loading from '@/components/ui/Loading';
import Input from '@/components/ui/Input';
import { Palette, X } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function HandmadePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [search, categoryId]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('product_categories')
      .select('*')
      .eq('status', 'approved')
      .order('name');
    
    if (data) setCategories(data);
  };

  const loadProducts = async () => {
    setLoading(true);
    
    let query = supabase
      .from('products')
      .select(`
        *,
        product_categories (name),
        provinces (name, code)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data } = await query;

    if (data) {
      setProducts(data);
    }
    
    setLoading(false);
  };

  const handleReset = () => {
    setSearch('');
    setCategoryId('');
  };

  return (
    <div className="min-h-screen bg-neutral-main py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            Prodotti Handmade
          </h1>
          <p className="text-text-secondary">
            Scopri creazioni artigianali uniche
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          <aside className="lg:col-span-1">
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
                placeholder="Cerca prodotti..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Categoria
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Tutte</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loading size="lg" text="Caricamento prodotti..." />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-xl border border-neutral-border p-12 text-center">
                <Palette className="w-16 h-16 text-text-disabled mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Nessun prodotto trovato
                </h3>
                <p className="text-text-secondary">
                  Prova a modificare i filtri di ricerca
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-text-secondary">
                  {products.length} {products.length === 1 ? 'prodotto trovato' : 'prodotti trovati'}
                </div>
                
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
