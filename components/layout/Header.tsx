'use client';

import Link from 'next/link';
import { Menu, Search, User, X, Settings, LogOut, LayoutDashboard, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="hidden sm:block font-bold text-xl text-primary">
                Portale
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              <Link 
                href="/immobili" 
                className="text-text-primary hover:text-primary font-medium transition-colors"
              >
                Immobili
              </Link>
              <Link 
                href="/handmade" 
                className="text-text-primary hover:text-primary font-medium transition-colors"
              >
                Handmade
              </Link>
              <Link 
                href="/info" 
                className="text-text-secondary hover:text-primary transition-colors"
              >
                Come Funziona
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-neutral-main rounded-lg hover:bg-neutral-hover transition-colors">
              <Search className="w-5 h-5 text-text-secondary" />
              <span className="text-sm text-text-secondary">Cerca...</span>
            </button>

            <button className="md:hidden p-2 hover:bg-neutral-main rounded-lg">
              <Search className="w-5 h-5 text-text-primary" />
            </button>

            {user && profile ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-3 p-2 hover:bg-neutral-main rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-lighter rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {getInitials(profile.full_name || 'U')}
                    </span>
                  </div>
                  <span className="hidden sm:block font-medium text-text-primary">
                    {profile.full_name?.split(' ')[0]}
                  </span>
                </button>

                {profileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-border z-50">
                      <div className="p-4 border-b border-neutral-border">
                        <p className="font-semibold text-text-primary">{profile.full_name}</p>
                        <p className="text-sm text-text-secondary">{profile.email}</p>
                        <p className="text-xs text-text-disabled mt-1 capitalize">{profile.role}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-main transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-5 h-5 text-text-secondary" />
                          <span className="text-text-primary">Dashboard</span>
                        </Link>
                        <Link
                          href="/messages"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-main transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <MessageSquare className="w-5 h-5 text-text-secondary" />
                          <span className="text-text-primary">Messaggi</span>
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-main transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <Settings className="w-5 h-5 text-text-secondary" />
                          <span className="text-text-primary">Impostazioni</span>
                        </Link>
                      </div>
                      <div className="border-t border-neutral-border py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-5 h-5 text-red-600" />
                          <span className="text-red-600">Esci</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary-lighter rounded-lg transition-colors font-medium"
              >
                <User className="w-5 h-5" />
                <span>Accedi</span>
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-neutral-main rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-border">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/immobili"
                className="px-4 py-2 text-text-primary hover:bg-neutral-main rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏘️ Immobili
              </Link>
              <Link 
                href="/handmade"
                className="px-4 py-2 text-text-primary hover:bg-neutral-main rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                🎨 Handmade
              </Link>
              <Link 
                href="/info"
                className="px-4 py-2 text-text-secondary hover:bg-neutral-main rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                ℹ️ Come Funziona
              </Link>
              {!user && (
                <Link 
                  href="/auth/login"
                  className="px-4 py-2 text-primary hover:bg-primary-lighter rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 Accedi
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
