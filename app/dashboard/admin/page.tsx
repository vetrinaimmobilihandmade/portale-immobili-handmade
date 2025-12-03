'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import Button from '@/components/ui/Button';
import { CheckCircle, XCircle, Eye, Clock, Home, Package, AlertCircle } from 'lucide-react';

interface PendingItem {
  id: string;
  title: string;
  description: string;
  type: 'property' | 'product';
  created_at: string;
  user_id: string;
  user_name: string;
  user_email: string;
  cover_image_url: string | null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { canModerate, loading: roleLoading } = useUserRole();
  const supabase = createClient();

  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'property' | 'product'>('all');

  useEffect(() => {
    if (!roleLoading && !canModerate) {
      router.push('/dashboard');
    }
  }, [roleLoading, canModerate, router]);

  useEffect(() => {
    if (canModerate) {
      loadPendingItems();
    }
  }, [canModerate]);

  const loadPendingItems = async () => {
    try {
      setLoading(true);
      setError('');

      // Carica immobili in pending
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          description,
          created_at,
          user_id,
          cover_image_url,
          user_profiles (
            full_name,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (propError) throw propError;

      // Carica prodotti in pending
      const { data: products, error: prodError } = await supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          created_at,
          user_id,
          cover_image_url,
          user_profiles (
            full_name,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (prodError) throw prodError;

      // Combina risultati
      const allItems: PendingItem[] = [
        ...(properties || []).map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          type: 'property' as const,
          created_at: p.created_at,
          user_id: p.user_id,
          user_name: (p.user_profiles as any)?.full_name || 'N/A',
          user_email: (p.user_profiles as any)?.email || 'N/A',
          cover_image_url: p.cover_image_url,
        })),
        ...(products || []).map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          type: 'product' as const,
          created_at: p.created_at,
          user_id: p.user_id,
          user_name: (p.user_profiles as any)?.full_name || 'N/A',
          user_email: (p.user_profiles as any)?.email || 'N/A',
          cover_image_url: p.cover_image_url,
        })),
      ];

      // Ordina per data
      allItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setPendingItems(allItems);
    } catch (err: any) {
      console.error('Error loading pending items:', err);
      setError('Errore nel caricamento degli annunci');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item: PendingItem) => {
    setActionLoading(item.id);
    try {
      const table = item.type === 'property' ? 'properties' : 'products';
      
      const { error } = await supabase
        .from(table)
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      if (error) throw error;

      // Rimuovi dalla lista
      setPendingItems(prev => prev.filter(i => i.id !== item.id));
    } catch (err: any) {
      console.error('Error approving:', err);
      alert('Errore durante l\'approvazione');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (item: PendingItem) => {
    const reason = prompt('Motivo del rifiuto (opzionale):');
    
    setActionLoading(item.id);
    try {
      const table = item.type === 'property' ? 'properties' : 'products';
      
      const { error } = await supabase
        .from(table)
        .update({
          status: 'rejected',
          rejected_reason: reason || 'Annuncio non conforme',
        })
        .eq('id', item.id);

      if (error) throw error;

      // Rimuovi dalla lista
      setPendingItems(prev => prev.filter(i => i.id !== item.id));
    } catch (err: any) {
      console.error('Error rejecting:', err);
      alert('Errore durante il rifiuto');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredItems = filter === 'all' 
    ? pendingItems 
    : pendingItems.filter(item => item.type === filter);

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-main py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Pannello Moderazione
          </h1>
          <p className="text-text-secondary">
            Approva o rifiuta gli annunci in attesa
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-text-primary">{pendingItems.length}</p>
                <p className="text-sm text-text-secondary">In Attesa</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Home className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {pendingItems.filter(i => i.type === 'property').length}
                </p>
                <p className="text-sm text-text-secondary">Immobili</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {pendingItems.filter(i => i.type === 'product').length}
                </p>
                <p className="text-sm text-text-secondary">Prodotti</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtri */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-text-secondary hover:bg-neutral-main'
            }`}
          >
            Tutti ({pendingItems.length})
          </button>
          <button
            onClick={() => setFilter('property')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'property'
                ? 'bg-primary text-white'
                : 'bg-white text-text-secondary hover:bg-neutral-main'
            }`}
          >
            Immobili ({pendingItems.filter(i => i.type === 'property').length})
          </button>
          <button
            onClick={() => setFilter('product')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'product'
                ? 'bg-primary text-white'
                : 'bg-white text-text-secondary hover:bg-neutral-main'
            }`}
          >
            Prodotti ({pendingItems.filter(i => i.type === 'product').length})
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Lista Annunci */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Clock className="w-16 h-16 text-text-disabled mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Nessun annuncio in attesa
            </h3>
            <p className="text-text-secondary">
              Tutti gli annunci sono stati moderati
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex gap-6">
                  
                  {/* Immagine */}
                  <div className="flex-shrink-0">
                    {item.cover_image_url ? (
                      <img
                        src={item.cover_image_url}
                        alt={item.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-neutral-main rounded-lg flex items-center justify-center">
                        {item.type === 'property' ? (
                          <Home className="w-12 h-12 text-text-disabled" />
                        ) : (
                          <Package className="w-12 h-12 text-text-disabled" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.type === 'property'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {item.type === 'property' ? '🏠 Immobile' : '🎨 Handmade'}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-text-primary mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-text-secondary line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Utente */}
                    <div className="mb-4">
                      <p className="text-sm text-text-secondary">
                        <strong>Pubblicato da:</strong> {item.user_name}
                      </p>
                      <p className="text-sm text-text-secondary">
                        <strong>Email:</strong> {item.user_email}
                      </p>
                      <p className="text-xs text-text-disabled mt-1">
                        {new Date(item.created_at).toLocaleDateString('it-IT', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(item)}
                        isLoading={actionLoading === item.id}
                        disabled={!!actionLoading}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approva
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleReject(item)}
                        disabled={!!actionLoading}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rifiuta
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const url = item.type === 'property' 
                            ? `/immobili/${item.id}` 
                            : `/handmade/${item.id}`;
                          window.open(url, '_blank');
                        }}
                        disabled={!!actionLoading}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizza
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
