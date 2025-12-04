'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { Home, Palette, MoreVertical, Eye, Edit, Trash2, Archive, Clock, CheckCircle, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

type ListingStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'archived';
type ListingType = 'all' | 'property' | 'product';

export default function AnnunciPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<ListingStatus>('all');
  const [filterType, setFilterType] = useState<ListingType>('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [filterStatus, filterType]);

  const loadData = async () => {
    setLoading(true);
    
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    
    setUser(currentUser);

    // Carica immobili
    if (filterType === 'all' || filterType === 'property') {
      let propertyQuery = supabase
        .from('properties')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        propertyQuery = propertyQuery.eq('status', filterStatus);
      }

      const { data: propertiesData } = await propertyQuery;
      setProperties(propertiesData || []);
    } else {
      setProperties([]);
    }

    // Carica prodotti
    if (filterType === 'all' || filterType === 'product') {
      let productQuery = supabase
        .from('products')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        productQuery = productQuery.eq('status', filterStatus);
      }

      const { data: productsData } = await productQuery;
      setProducts(productsData || []);
    } else {
      setProducts([]);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string, type: 'property' | 'product') => {
    if (!confirm('Sei sicuro di voler eliminare questo annuncio? Questa azione non può essere annullata.')) {
      return;
    }

    const table = type === 'property' ? 'properties' : 'products';
    const { error } = await supabase.from(table).delete().eq('id', id);

    if (error) {
      alert('Errore durante l\'eliminazione');
      console.error(error);
      return;
    }

    loadData();
    setOpenMenu(null);
  };

  const handleArchive = async (id: string, type: 'property' | 'product') => {
    const table = type === 'property' ? 'properties' : 'products';
    const { error } = await supabase
      .from(table)
      .update({ status: 'archived' })
      .eq('id', id);

    if (error) {
      alert('Errore durante l\'archiviazione');
      console.error(error);
      return;
    }

    loadData();
    setOpenMenu(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            In Attesa
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approvato
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rifiutato
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="default" className="bg-gray-100 text-gray-800">
            <Archive className="w-3 h-3 mr-1" />
            Archiviato
          </Badge>
        );
      default:
        return null;
    }
  };

  const ListingCard = ({ item, type }: { item: any; type: 'property' | 'product' }) => {
    const isProperty = type === 'property';
    const detailUrl = isProperty ? `/immobili/${item.id}` : `/handmade/${item.id}`;
    const icon = isProperty ? Home : Palette;
    const Icon = icon;

    return (
      <div className="bg-white rounded-lg border border-neutral-border overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex gap-4 p-4">
          
          {/* Immagine */}
          <div className="relative w-32 h-32 flex-shrink-0 bg-neutral-main rounded-lg overflow-hidden">
            {item.cover_image_url ? (
              <Image
                src={item.cover_image_url}
                alt={item.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon className="w-12 h-12 text-text-disabled" />
              </div>
            )}
          </div>

          {/* Contenuto */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary truncate mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Icon className="w-4 h-4" />
                  <span>{isProperty ? 'Immobile' : 'Prodotto Handmade'}</span>
                </div>
              </div>
              {getStatusBadge(item.status)}
            </div>

            <p className="text-sm text-text-secondary line-clamp-2 mb-3">
              {item.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-text-secondary">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{item.views_count || 0} visualizzazioni</span>
                </div>
                <span>Creato il {formatDate(item.created_at)}</span>
              </div>

              {/* Menu Azioni */}
              <div className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}
                  className="p-2 hover:bg-neutral-main rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-text-secondary" />
                </button>

                {openMenu === item.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenu(null)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-border z-20 py-1">
                      {item.status === 'approved' && (
                        <Link
                          href={detailUrl}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-neutral-main transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Visualizza
                        </Link>
                      )}
                      
                      {item.status !== 'archived' && (
                        <button
                          onClick={() => handleArchive(item.id, type)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-neutral-main transition-colors"
                        >
                          <Archive className="w-4 h-4" />
                          Archivia
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(item.id, type)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Elimina
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Motivo rifiuto */}
            {item.status === 'rejected' && item.rejected_reason && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Motivo rifiuto:</strong> {item.rejected_reason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const allListings = [
    ...properties.map(p => ({ ...p, type: 'property' as const })),
    ...products.map(p => ({ ...p, type: 'product' as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-main py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              I Miei Annunci
            </h1>
            <p className="text-text-secondary">
              Gestisci tutti i tuoi annunci pubblicati
            </p>
          </div>
          <Link href="/dashboard/nuovo">
            <Button variant="primary">
              Nuovo Annuncio
            </Button>
          </Link>
        </div>

        {/* Filtri */}
        <div className="bg-white rounded-xl border border-neutral-border p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* Filtro Tipo */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tipo Annuncio
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as ListingType)}
                className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Tutti</option>
                <option value="property">Immobili</option>
                <option value="product">Prodotti Handmade</option>
              </select>
            </div>

            {/* Filtro Status */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Stato
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as ListingStatus)}
                className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Tutti</option>
                <option value="pending">In Attesa</option>
                <option value="approved">Approvati</option>
                <option value="rejected">Rifiutati</option>
                <option value="archived">Archiviati</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistiche */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-neutral-border p-4">
            <p className="text-sm text-text-secondary mb-1">Totali</p>
            <p className="text-2xl font-bold text-text-primary">
              {properties.length + products.length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-neutral-border p-4">
            <p className="text-sm text-text-secondary mb-1">Immobili</p>
            <p className="text-2xl font-bold text-primary">{properties.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-neutral-border p-4">
            <p className="text-sm text-text-secondary mb-1">Prodotti</p>
            <p className="text-2xl font-bold text-secondary">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-neutral-border p-4">
            <p className="text-sm text-text-secondary mb-1">Visualizzazioni</p>
            <p className="text-2xl font-bold text-accent">
              {[...properties, ...products].reduce((sum, item) => sum + (item.views_count || 0), 0)}
            </p>
          </div>
        </div>

        {/* Lista Annunci */}
        {allListings.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-border p-12 text-center">
            <div className="w-16 h-16 bg-primary-lighter rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Nessun annuncio trovato
            </h3>
            <p className="text-text-secondary mb-6">
              {filterStatus !== 'all' || filterType !== 'all'
                ? 'Prova a modificare i filtri di ricerca'
                : 'Inizia pubblicando il tuo primo annuncio'}
            </p>
            {filterStatus === 'all' && filterType === 'all' && (
              <Link href="/dashboard/nuovo">
                <Button variant="primary">
                  Pubblica Annuncio
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {allListings.map((listing) => (
              <ListingCard key={listing.id} item={listing} type={listing.type} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
