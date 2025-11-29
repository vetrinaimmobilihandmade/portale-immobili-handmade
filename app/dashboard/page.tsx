import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Home, Palette, Plus, Heart, MessageSquare, Settings } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { count: propertiesCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: favoritesCount } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  return (
    <div className="min-h-screen bg-neutral-main py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Benvenuto, {profile?.full_name || 'Utente'}!
          </h1>
          <p className="text-text-secondary">
            Gestisci i tuoi annunci e le tue attività
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Immobili</p>
                <p className="text-2xl font-bold text-text-primary">{propertiesCount || 0}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary-lighter rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Prodotti</p>
                <p className="text-2xl font-bold text-text-primary">{productsCount || 0}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-lighter rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Preferiti</p>
                <p className="text-2xl font-bold text-text-primary">{favoritesCount || 0}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Messaggi</p>
                <p className="text-2xl font-bold text-text-primary">0</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">Azioni Rapide</h2>
            </div>
            
            <div className="space-y-3">
              <Link href="/dashboard/nuovo?type=property">
                <Button variant="primary" fullWidth className="justify-start">
                  <Plus className="w-5 h-5" />
                  Nuovo Immobile
                </Button>
              </Link>
              
              <Link href="/dashboard/nuovo?type=product">
                <Button variant="secondary" fullWidth className="justify-start">
                  <Plus className="w-5 h-5" />
                  Nuovo Prodotto
                </Button>
              </Link>
              
              <Link href="/dashboard/annunci">
                <Button variant="ghost" fullWidth className="justify-start">
                  <Settings className="w-5 h-5" />
                  Gestisci Annunci
                </Button>
              </Link>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Il Tuo Profilo</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-text-secondary">Nome</p>
                <p className="font-medium text-text-primary">{profile?.full_name}</p>
              </div>
              
              <div>
                <p className="text-sm text-text-secondary">Email</p>
                <p className="font-medium text-text-primary">{profile?.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-text-secondary">Telefono</p>
                <p className="font-medium text-text-primary">{profile?.phone || 'Non specificato'}</p>
              </div>
              
              <div>
                <p className="text-sm text-text-secondary">Ruolo</p>
                <p className="font-medium text-text-primary capitalize">{profile?.role}</p>
              </div>
            </div>
            
            <Link href="/dashboard/profile">
              <Button variant="ghost" fullWidth className="mt-4">
                Modifica Profilo
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
