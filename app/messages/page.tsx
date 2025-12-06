'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { MessageSquare, Home, Palette, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function MessagesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      router.push('/auth/login?redirect=/messages');
      return;
    }

    setUser(currentUser);
    loadConversations(currentUser.id);
  };

  const loadConversations = async (userId: string) => {
    try {
      // Carica conversazioni dove l'utente è user1 o user2
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          property:properties (id, title, cover_image_url),
          product:products (id, title, cover_image_url),
          user1:user_profiles!conversations_user1_id_fkey (id, full_name, email),
          user2:user_profiles!conversations_user2_id_fkey (id, full_name, email)
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Per ogni conversazione, carica l'ultimo messaggio e conta non letti
      const conversationsWithMessages = await Promise.all(
        (data || []).map(async (conv) => {
          // Ultimo messaggio
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Conta messaggi non letti (ricevuti dall'altro utente)
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_read', false)
            .neq('sender_id', userId);

          return {
            ...conv,
            lastMessage: lastMsg,
            unreadCount: unreadCount || 0,
          };
        })
      );

      setConversations(conversationsWithMessages);
    } catch (err) {
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Identifica l'altro utente nella conversazione
  const getOtherUser = (conversation: any) => {
    if (!user) return null;
    return conversation.user1_id === user.id ? conversation.user2 : conversation.user1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-main py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-text-primary">
              Messaggi
            </h1>
          </div>
          <p className="text-text-secondary">
            Le tue conversazioni
          </p>
        </div>

        {/* Lista Conversazioni */}
        {conversations.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-border p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Nessun messaggio
            </h3>
            <p className="text-text-secondary mb-6">
              Quando contatterai qualcuno, le conversazioni appariranno qui
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/immobili">
                <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                  Cerca Immobili
                </button>
              </Link>
              <Link href="/handmade">
                <button className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-hover transition-colors">
                  Cerca Handmade
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => {
              const otherUser = getOtherUser(conversation);
              const listing = conversation.property || conversation.product;
              const listingType = conversation.property_id ? 'property' : 'product';
              const Icon = conversation.property_id ? Home : Palette;

              return (
                <Link
                  key={conversation.id}
                  href={`/messages/${conversation.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg border border-neutral-border hover:shadow-md transition-all p-4">
                    <div className="flex gap-4">
                      
                      {/* Avatar o Immagine Annuncio */}
                      <div className="relative flex-shrink-0">
                        {listing?.cover_image_url ? (
                          <img
                            src={listing.cover_image_url}
                            alt={listing.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-neutral-main rounded-lg flex items-center justify-center">
                            <Icon className="w-8 h-8 text-text-disabled" />
                          </div>
                        )}
                        {conversation.unreadCount > 0 && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>

                      {/* Contenuto */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-text-primary truncate">
                            {otherUser?.full_name || 'Utente'}
                          </h3>
                          {conversation.lastMessage && (
                            <span className="text-xs text-text-disabled flex-shrink-0">
                              {formatRelativeTime(conversation.lastMessage.created_at)}
                            </span>
                          )}
                        </div>

                        {listing && (
                          <p className="text-sm text-text-secondary mb-2 truncate">
                            <Icon className="w-4 h-4 inline mr-1" />
                            {listing.title}
                          </p>
                        )}

                        {conversation.lastMessage && (
                          <p className={`text-sm truncate ${
                            conversation.unreadCount > 0 && conversation.lastMessage.sender_id !== user?.id
                              ? 'font-semibold text-text-primary'
                              : 'text-text-secondary'
                          }`}>
                            {conversation.lastMessage.sender_id === user?.id && 'Tu: '}
                            {conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
