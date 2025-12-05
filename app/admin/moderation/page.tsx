'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Home, Palette, Check, X, Eye, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

type ListingType = 'all' | 'property' | 'product';

export default function ModerationPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<any>(null);
  const [canModerate, setCanModerate] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<ListingType>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectItem, setRejectItem] = useState<{ id: string; type: 'property' | 'product' } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    if (canModerate) {
      loadPendingListings();
    }
  }, [canModerate, filterType]);

  const checkPermissions = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    const canMod = profile?.role === 'admin' || profile?.role === 'editor';
    setCanModerate(canMod);
    setUser(currentUser);
    setLoading(false);

    if (!canMod) {
      router.push('/dashboard');
    }
  };

  const loadPendingListings = async () => {
    // Carica immobili pending
    if (filterType === 'all' || filterType === 'property') {
      const { data: propertiesData } = await supabase
        .from('properties')
        .select(`
          *,
          user_profiles (full_name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      setProperties(propertiesData || []);
    } else {
      setProperties([]);
    }

    // Carica prodotti pending
    if (filterType === 'all' || filterType === 'product') {
      const { data: productsData } = await supabase
        .from('products')
        .select(`
          *,
          user_profiles (full_name, email),
          product_categories (name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      setProducts(productsData || []);
    } else {
      setProducts([]);
    }
  };

  const handleApprove = async (id: string, type: 'property' | 'product') => {
    if (!user) return;
    
    setProcessingId(id);
    const table = type === 'property' ? 'properties' : 'products';
    
    const { error } = await supabase
      .from(table)
      .update({
        status: 'approved',
        approved_by: user.id,
        approved_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      alert('Errore durante l\'approvazione');
      console.error(error);
    } else {
      loadPendingListings();
    }
    
    setProcessingId(null);
  };

  const openRejectModal = (id: string, type: 'property' | 'product') => {
    setRejectItem({ id, type });
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!rejectItem || !user || !rejectReason.trim()) {
      alert('Inserisci un motivo per il rifiuto');
      return;
    }

    setProcessingId(rejectItem.id);
    const table = rejectItem.type === 'property' ? 'properties' : 'products';
    
    const { error } = await supabase
      .from(table)
      .update({
        status: 'rejected',
        rejected_reason: rejectReason,
        approved_by: user.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', rejectItem.id);

    if (error) {
      alert('Errore durante il rifiuto');
      console.error(error);
    } else {
      loadPendingListings();
      setRejectModalOpen(false);
      setRejectItem(null);
    }
    
    setProcessingId(null);
  };

  const ModerationCard = ({ item, type }: { item: any; type: 'property' | 'product' }) => {
    const isProperty = type === 'property';
    const icon = isProperty ? Home : Palette;
    const Icon = icon;
    const detailUrl = isProperty ? `/immobili/${item.id}` : `/handmade/${item.id}`;

    return (
      <div className="bg-white rounded-lg border border-neutral-border overflow-hidden">
        <div className="flex gap-4 p-6">
          
          {/* Immagine */}
          <div className="relative w-40 h-40 flex-shrink-0 bg-neutral-main rounded-lg overflow-hidden">
            {item.cover_image_url ? (
              <Image
                src={item.cover_image_url}
                alt={item.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon className="w-16 h-16 text-text-disabled" />
              </div>
            )}
          </div>

          {/* Contenuto */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" className={isProperty ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}>
                    {isProperty ? 'Immobile' : 'Handmade'}
                  </Badge>
                  <span className="text-sm text-text-secondary">
                    {formatDate(item.created_at)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {item.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-text-secondary line-clamp-3 mb-4">
              {item.description}
            </p>

            {/* Info Inserzionista */}
            <div className="bg-neutral-main rounded-lg p-3 mb-4">
              <p className="text-xs text-text-secondary mb-1">Pubblicato da:</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">
                    {item.user_profiles?.full_name || 'Utente'}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {item.user_profiles?.email}
                  </p>
                </div>
                {item.contact_phone && (
                  <p className="text-sm text-text-secondary">
                    📞 {item.contact_phone}
                  </p>
                )}
              </div>
            </div>

            {/* Dettagli specifici */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              {isProperty ? (
                <>
                  {item.property_type && (
                    <div>
                      <span className="text-text-secondary">Tipo: </span>
                      <span className="font-medium text-text-primary capitalize">
                        {item.property_type.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                  {item.surface_mq && (
                    <div>
                      <span className="text-text-secondary">Superficie: </span>
                      <span className="font-medium text-text-primary">{item.surface_mq} m²</span>
                    </div>
                  )}
                  {item.municipality_name && (
                    <div>
                      <span className="text-text-secondary">Comune: </span>
                      <span className="font-medium text-text-primary">{item.municipality_name}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {item.product_categories?.name && (
                    <div>
                      <span className="text-text-secondary">Categoria: </span>
                      <span className="font-medium text-text-primary">{item.product_categories.name}</span>
                    </div>
                  )}
                  {item.materials && (
                    <div>
                      <span className="text-text-secondary">Materiali: </span>
                      <span className="font-medium text-text-primary">{item.materials}</span>
                    </div>
                  )}
                  {item.is_customizable && (
                    <div className="col-span-2">
                      <Badge variant="default" className="bg-purple-100 text-purple-800">
                        ✨ Personalizzabile
                      </Badge>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Azioni */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => handleApprove(item.id, type)}
                isLoading={processingId === item.id}
                disabled={!!processingId}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                Approva
              </Button>
              <Button
                variant="secondary"
                onClick={() => openRejectModal(item.id, type)}
                disabled={!!processingId}
                className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
              >
                <X className="w-4 h-4 mr-2" />
                Rifiuta
              </Button>
              <Link href={detailUrl} target="_blank">
                <Button variant="ghost" disabled={!!processingId}>
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const allPending = [
    ...properties.map(p => ({ ...p, type: 'property' as const })),
    ...products.map(p => ({ ...p, type: 'product' as const })),
  ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!canModerate) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-neutral-main py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-text-primary">
                Moderazione Annunci
              </h1>
            </div>
            <p className="text-text-secondary">
              Approva o rifiuta gli annunci in attesa di moderazione
            </p>
          </div>

          {/* Statistiche */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-neutral-border p-4">
              <p className="text-sm text-text-secondary mb-1">In Attesa</p>
              <p className="text-2xl font-bold text-yellow-600">
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
          </div>

          {/* Filtro */}
          <div className="bg-white rounded-lg border border-neutral-border p-4 mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Filtra per Tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ListingType)}
              className="w-full md:w-64 px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tutti gli annunci</option>
              <option value="property">Solo Immobili</option>
              <option value="product">Solo Prodotti</option>
            </select>
          </div>

          {/* Lista Annunci */}
          {allPending.length === 0 ? (
            <div className="bg-white rounded-xl border border-neutral-border p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Nessun annuncio in attesa
              </h3>
              <p className="text-text-secondary">
                {filterType !== 'all'
                  ? 'Prova a modificare il filtro'
                  : 'Tutti gli annunci sono stati moderati'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allPending.map((listing) => (
                <ModerationCard key={listing.id} item={listing} type={listing.type} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Rifiuto */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary">
                  Rifiuta Annuncio
                </h3>
                <p className="text-sm text-text-secondary">
                  Specifica il motivo del rifiuto
                </p>
              </div>
            </div>

            <textarea
              placeholder="Es: Le immagini non sono chiare, la descrizione è incompleta, ecc."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 resize-none"
              autoFocus
            />

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectItem(null);
                }}
                disabled={!!processingId}
                className="flex-1"
              >
                Annulla
              </Button>
              <Button
                variant="primary"
                onClick={handleReject}
                isLoading={!!processingId}
                disabled={!rejectReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Conferma Rifiuto
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
