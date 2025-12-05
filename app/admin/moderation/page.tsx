'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Home, Palette, Check, X, Eye, AlertCircle, RotateCcw, Archive, Trash2, MoreVertical } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

type ListingStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'archived';
type ListingType = 'all' | 'property' | 'product';

export default function ModerationPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<any>(null);
  const [canModerate, setCanModerate] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<ListingStatus>('all');
  const [filterType, setFilterType] = useState<ListingType>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionItem, setActionItem] = useState<{ id: string; type: 'property' | 'product'; title: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    archived: 0,
  });

  // 🔍 DEBUG: Log per capire cosa sta succedendo
  useEffect(() => {
    console.log('🔍 Admin Moderation Debug:');
    console.log('  - Filter Status:', filterStatus);
    console.log('  - Filter Type:', filterType);
    console.log('  - Properties:', properties.length);
    console.log('  - Products:', products.length);
  }, [filterStatus, filterType, properties, products]);

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    if (canModerate) {
      loadListings();
      loadStats();
    }
  }, [canModerate, filterStatus, filterType]);

  const checkPermissions = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    const { data: profile }: any = await supabase
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

  const loadStats = async () => {
    const statuses: Array<'pending' | 'approved' | 'rejected' | 'archived'> = ['pending', 'approved', 'rejected', 'archived'];
    const newStats: any = {};

    for (const status of statuses) {
      const { count: propCount, error: propError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', status);

      const { count: prodCount, error: prodError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', status);

      // 🔍 DEBUG: Log errori
      if (propError) console.error('❌ Errore count properties:', propError);
      if (prodError) console.error('❌ Errore count products:', prodError);

      newStats[status] = (propCount || 0) + (prodCount || 0);
    }

    console.log('📊 Stats:', newStats);
    setStats(newStats);
  };

  const loadListings = async () => {
  console.log('🔄 Loading listings...');
  
  // 📦 CARICA IMMOBILI - ✅ CORRETTO
  if (filterType === 'all' || filterType === 'property') {
    let propertyQuery = supabase
      .from('properties')
      .select(`
        *,
        user_profiles!properties_user_id_fkey (full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (filterStatus !== 'all') {
      propertyQuery = propertyQuery.eq('status', filterStatus);
    }

    const { data: propertiesData, error: propError } = await propertyQuery;
    
    if (propError) {
      console.error('❌ Errore caricamento properties:', propError);
    } else {
      console.log('✅ Properties caricate:', propertiesData?.length || 0);
      setProperties(propertiesData || []);
    }
  } else {
    setProperties([]);
  }

  // 🎨 CARICA PRODOTTI - ✅ CORRETTO
  if (filterType === 'all' || filterType === 'product') {
    let productQuery = supabase
      .from('products')
      .select(`
        *,
        user_profiles!products_user_id_fkey (full_name, email),
        product_categories (name)
      `)
      .order('created_at', { ascending: false });

    if (filterStatus !== 'all') {
      productQuery = productQuery.eq('status', filterStatus);
    }

    const { data: productsData, error: prodError } = await productQuery;
    
    if (prodError) {
      console.error('❌ Errore caricamento products:', prodError);
    } else {
      console.log('✅ Products caricati:', productsData?.length || 0);
      setProducts(productsData || []);
    }
  } else {
    setProducts([]);
  }
};
  const handleAction = async (action: string, id: string, type: 'property' | 'product') => {
    if (!user) return;
    
    setProcessingId(id);
    setOpenMenu(null);
    
    let updateData: any = {};

    switch (action) {
      case 'approve':
        updateData = {
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
          rejected_reason: null,
        };
        break;
      
      case 'restore':
        updateData = {
          status: 'pending',
          rejected_reason: null,
          approved_by: null,
          approved_at: null,
        };
        break;
      
      case 'archive':
        updateData = {
          status: 'archived',
        };
        break;
    }

    let error = null;
    
    if (type === 'property') {
      const result = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id);
      error = result.error;
    } else {
      const result = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);
      error = result.error;
    }

    if (error) {
      alert('Errore durante l\'operazione');
      console.error(error);
    } else {
      loadListings();
      loadStats();
    }
    
    setProcessingId(null);
  };

  const openRejectModal = (id: string, type: 'property' | 'product', title: string) => {
    setActionItem({ id, type, title });
    setRejectReason('');
    setRejectModalOpen(true);
    setOpenMenu(null);
  };

  const handleReject = async () => {
    if (!actionItem || !user || !rejectReason.trim()) {
      alert('Inserisci un motivo per il rifiuto');
      return;
    }

    setProcessingId(actionItem.id);
    
    let error = null;
    
    if (actionItem.type === 'property') {
      const result = await supabase
        .from('properties')
        .update({
          status: 'rejected',
          rejected_reason: rejectReason,
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', actionItem.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('products')
        .update({
          status: 'rejected',
          rejected_reason: rejectReason,
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', actionItem.id);
      error = result.error;
    }

    if (error) {
      alert('Errore durante il rifiuto');
      console.error(error);
    } else {
      loadListings();
      loadStats();
      setRejectModalOpen(false);
      setActionItem(null);
    }
    
    setProcessingId(null);
  };

  const openDeleteModal = (id: string, type: 'property' | 'product', title: string) => {
    setActionItem({ id, type, title });
    setDeleteModalOpen(true);
    setOpenMenu(null);
  };

  const handleDelete = async () => {
    if (!actionItem) return;

    setProcessingId(actionItem.id);
    
    let error = null;
    
    if (actionItem.type === 'property') {
      const result = await supabase
        .from('properties')
        .delete()
        .eq('id', actionItem.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('products')
        .delete()
        .eq('id', actionItem.id);
      error = result.error;
    }

    if (error) {
      alert('Errore durante l\'eliminazione');
      console.error(error);
    } else {
      loadListings();
      loadStats();
      setDeleteModalOpen(false);
      setActionItem(null);
    }
    
    setProcessingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            In Attesa
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Approvato
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            Rifiutato
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="default" className="bg-gray-100 text-gray-800">
            Archiviato
          </Badge>
        );
      default:
        return null;
    }
  };

  const ModerationCard = ({ item, type }: { item: any; type: 'property' | 'product' }) => {
    const isProperty = type === 'property';
    const icon = isProperty ? Home : Palette;
    const Icon = icon;
    const detailUrl = isProperty ? `/immobili/${item.id}` : `/handmade/${item.id}`;

    return (
      <div className="bg-white rounded-lg border border-neutral-border">
        <div className="flex gap-4 p-6">
          
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

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" className={isProperty ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}>
                    {isProperty ? 'Immobile' : 'Handmade'}
                  </Badge>
                  {getStatusBadge(item.status)}
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
              </div>
            </div>

            {item.status === 'rejected' && item.rejected_reason && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Motivo rifiuto:</strong> {item.rejected_reason}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3">
              
              {item.status === 'pending' && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => handleAction('approve', item.id, type)}
                    isLoading={processingId === item.id}
                    disabled={!!processingId}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approva
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => openRejectModal(item.id, type, item.title)}
                    disabled={!!processingId}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rifiuta
                  </Button>
                </>
              )}

              {item.status !== 'pending' && (
                <Button
                  variant="primary"
                  onClick={() => handleAction('restore', item.id, type)}
                  isLoading={processingId === item.id}
                  disabled={!!processingId}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Ripristina a Pending
                </Button>
              )}

              {item.status === 'approved' && (
                <Link href={detailUrl} target="_blank">
                  <Button variant="ghost" disabled={!!processingId}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
              )}

              <div className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}
                  className="p-2 hover:bg-neutral-main rounded-lg transition-colors"
                  disabled={!!processingId}
                  aria-label="Altre azioni"
                >
                  <MoreVertical className="w-5 h-5 text-text-secondary" />
                </button>

                {openMenu === item.id && (
                  <>
                    <div
                      className="fixed inset-0 z-[100]"
                      onClick={() => setOpenMenu(null)}
                    />
                    <div 
                      className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-neutral-border z-[101] py-1"
                      style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                    >
                      
                      {item.status === 'approved' && (
                        <Link
                          href={detailUrl}
                          target="_blank"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-neutral-main transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Visualizza
                        </Link>
                      )}

                      <div className="border-t border-neutral-border my-1"></div>

                      {item.status !== 'approved' && (
                        <button
                          onClick={() => handleAction('approve', item.id, type)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Approva
                        </button>
                      )}

                      {item.status !== 'rejected' && (
                        <button
                          onClick={() => openRejectModal(item.id, type, item.title)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Rifiuta
                        </button>
                      )}

                      {(item.status === 'rejected' || item.status === 'archived') && (
                        <button
                          onClick={() => handleAction('restore', item.id, type)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Ripristina
                        </button>
                      )}

                      {item.status !== 'archived' && (
                        <button
                          onClick={() => handleAction('archive', item.id, type)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-neutral-main transition-colors"
                        >
                          <Archive className="w-4 h-4" />
                          Archivia
                        </button>
                      )}

                      <div className="border-t border-neutral-border my-1"></div>

                      <button
                        onClick={() => openDeleteModal(item.id, type, item.title)}
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

  if (!canModerate) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-neutral-main py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-text-primary">
                Pannello Moderazione
              </h1>
            </div>
            <p className="text-text-secondary">
              Gestisci e modera tutti gli annunci della piattaforma
            </p>
            
            {/* 🔍 DEBUG INFO */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-mono text-blue-800">
                🔍 Debug: Properties: {properties.length} | Products: {products.length} | Total: {allListings.length}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { value: 'all', label: 'Tutti', count: stats.pending + stats.approved + stats.rejected + stats.archived },
              { value: 'pending', label: 'In Attesa', count: stats.pending },
              { value: 'approved', label: 'Approvati', count: stats.approved },
              { value: 'rejected', label: 'Rifiutati', count: stats.rejected },
              { value: 'archived', label: 'Archiviati', count: stats.archived },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value as ListingStatus)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === tab.value
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-primary hover:bg-neutral-main'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

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

          {allListings.length === 0 ? (
            <div className="bg-white rounded-xl border border-neutral-border p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Nessun annuncio trovato
              </h3>
              <p className="text-text-secondary">
                {filterStatus !== 'all' || filterType !== 'all'
                  ? 'Prova a modificare i filtri'
                  : 'Non ci sono annunci da moderare'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-text-secondary mb-4">
                {allListings.length} {allListings.length === 1 ? 'annuncio trovato' : 'annunci trovati'}
              </div>
              {allListings.map((listing) => (
                <ModerationCard key={listing.id} item={listing} type={listing.type} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODALS - Unchanged */}
      {rejectModalOpen && actionItem && (
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
                <p className="text-sm text-text-secondary line-clamp-1">
                  {actionItem.title}
                </p>
              </div>
            </div>

            <textarea
              placeholder="Specifica il motivo del rifiuto..."
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
                  setActionItem(null);
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

      {deleteModalOpen && actionItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary">
                  Elimina Annuncio
                </h3>
                <p className="text-sm text-text-secondary">
                  Questa azione è irreversibile
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800 mb-2">
                <strong>Stai per eliminare:</strong>
              </p>
              <p className="text-sm text-red-900 font-medium">
                "{actionItem.title}"
              </p>
            </div>

            <p className="text-sm text-text-secondary mb-6">
              L'annuncio sarà eliminato definitivamente.
            </p>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setActionItem(null);
                }}
                disabled={!!processingId}
                className="flex-1"
              >
                Annulla
              </Button>
              <Button
                variant="primary"
                onClick={handleDelete}
                isLoading={!!processingId}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Elimina Definitivamente
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
