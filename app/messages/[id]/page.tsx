'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Send, Home, Palette } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>(null);
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadConversation();
      subscribeToMessages();
    }
  }, [user, params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUser = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      router.push('/auth/login?redirect=/messages');
      return;
    }

    setUser(currentUser);
  };

  const loadConversation = async () => {
    try {
      // Carica conversazione
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select(`
          *,
          property:properties (id, title, cover_image_url),
          product:products (id, title, cover_image_url),
          user1:user_profiles!conversations_user1_id_fkey (id, full_name, email),
          user2:user_profiles!conversations_user2_id_fkey (id, full_name, email)
        `)
        .eq('id', params.id)
        .single();

      if (convError) throw convError;

      setConversation(conv);
      
      // Identifica l'altro utente
      const other = conv.user1_id === user?.id ? conv.user2 : conv.user1;
      setOtherUser(other);

      // Carica messaggi
      const { data: msgs, error: msgsError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', params.id)
        .order('created_at', { ascending: true });

      if (msgsError) throw msgsError;

      setMessages(msgs || []);

      // Segna come letti i messaggi ricevuti
      await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', params.id)
        .eq('is_read', false)
        .neq('sender_id', user?.id);

    } catch (err) {
      console.error('Error loading conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`conversation:${params.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${params.id}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
          
          // Se il messaggio non è mio, segnalo come letto
          if (payload.new.sender_id !== user?.id) {
            supabase
              .from('messages')
              .update({ is_read: true, read_at: new Date().toISOString() })
              .eq('id', payload.new.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !user) return;

    setSending(true);

    try {
      // Calcola expires_at (30 giorni da ora)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: params.id as string,
          sender_id: user.id,
          content: newMessage.trim(),
          is_read: false,
          expires_at: expiresAt.toISOString(),
        });

      if (error) throw error;

      // Aggiorna last_message_at nella conversazione
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', params.id);

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Conversazione non trovata
          </h2>
          <Link href="/messages">
            <Button variant="primary">Torna ai Messaggi</Button>
          </Link>
        </div>
      </div>
    );
  }

  const listing = conversation.property || conversation.product;
  const listingType = conversation.property_id ? 'property' : 'product';
  const listingUrl = `/${listingType === 'property' ? 'immobili' : 'handmade'}/${listing?.id}`;
  const Icon = conversation.property_id ? Home : Palette;

  return (
    <div className="min-h-screen bg-neutral-main flex flex-col">
      
      {/* Header */}
      <div className="bg-white border-b border-neutral-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/messages">
              <button className="p-2 hover:bg-neutral-main rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </Link>
            
            <div className="flex-1">
              <h2 className="font-semibold text-text-primary">
                {otherUser?.full_name || 'Utente'}
              </h2>
              {listing && (
                <Link href={listingUrl} className="text-sm text-text-secondary hover:text-primary flex items-center gap-1">
                  <Icon className="w-4 h-4" />
                  {listing.title}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messaggi */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">Nessun messaggio. Inizia la conversazione!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const isMine = message.sender_id === user?.id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isMine ? 'bg-primary text-white' : 'bg-white border border-neutral-border text-text-primary'} rounded-2xl px-4 py-3`}>
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      <p className={`text-xs mt-1 ${isMine ? 'text-blue-100' : 'text-text-disabled'}`}>
                        {new Date(message.created_at).toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {isMine && message.is_read && ' · Letto'}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Messaggio */}
      <div className="bg-white border-t border-neutral-border sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Scrivi un messaggio..."
              rows={1}
              className="flex-1 px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!newMessage.trim() || sending}
              isLoading={sending}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <p className="text-xs text-text-secondary mt-2">
            Premi Invio per inviare, Shift+Invio per andare a capo
          </p>
        </div>
      </div>
    </div>
  );
}
