'use client';

import Link from 'next/link';
import { Menu, Search, User, X, Settings, LogOut, LayoutDashboard, Shield, Home, Palette, Users } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface HeaderClientProps {
  user: any;
  profile: any;
}

export default function HeaderClient({ user: initialUser, profile: initialProfile }: HeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState<'immobili' | 'handmade'>('immobili');
  const [searchQuery, setSearchQuery] = useState('');
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSiteSettings();
    
    // Chiudi search dropdown se clicchi fuori
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadSiteSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    
    if (data) setSiteSettings(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const url = searchCategory === 'immobili' 
      ? `/immobili?search=${encodeURIComponent(searchQuery)}`
      : `/handmade?search=${encodeURIComponent(searchQuery)}`;
    
    router.push(url);
    setSearchOpen(false);
    setSearchQuery('');
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
              {siteSettings?.site_logo_url ? (
                <img 
                  src={siteSettings.site_logo_url} 
                  alt={siteSettings.site_name || 'Logo'}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {siteSettings?.site_logo_letter || 'P'}
                  </span>
                </div>
              )}
              <span className="hidden sm:block font-bold text-xl text-primary">
                {siteSettings?.site_name || 'Portale'}
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
            
            {/* SEARCH DROPDOWN - DESKTOP */}
            <div className="hidden md:block relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-main rounded-lg hover:bg-neutral-hover transition-colors"
              >
                <Search className="w-5 h-5 text-text-secondary" />
                <span className="text-sm text-text-secondary">Cerca...</span>
              </button>

              {searchOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-neutral-border z-50">
                  <form onSubmit={handleSearch} className="p-4">
                    
                    {/* Scelta Categoria */}
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setSearchCategory('immobili')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          searchCategory === 'immobili'
                            ? 'bg-primary text-white'
                            : 'bg-neutral-main text-text-primary hover:bg-neutral-hover'
                        }`}
                      >
                        <Home className="w-4 h-4" />
                        <span>Immobili</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSearchCategory('handmade')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          searchCategory === 'handmade'
                            ? 'bg-secondary text-white'
                            : 'bg-neutral-main text-text-primary hover:bg-neutral-hover'
                        }`}
                      >
                        <Palette className="w-4 h-4" />
                        <span>Handmade</span>
                      </button>
                    </div>

                    {/* Input Ricerca */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Cerca ${searchCategory}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Link Veloci */}
                    <div className="mt-4 pt-4 border-t border-neutral-border">
                      <p className="text-xs text-text-secondary mb-2">Accesso rapido:</p>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href="/immobili"
                          className="text-xs px-3 py-1 bg-neutral-main hover:bg-neutral-hover rounded-full transition-colors"
                          onClick={() => setSearchOpen(false)}
                        >
                          Tutti gli immobili
                        </Link>
                        <Link
                          href="/handmade"
                          className="text-xs px-3 py-1 bg-neutral-main hover:bg-neutral-hover rounded-full transition-colors"
                          onClick={() => setSearchOpen(false)}
                        >
                          Tutti i prodotti
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* SEARCH ICON - MOBILE */}
            <button 
              className="md:hidden p-2 hover:bg-neutral-main rounded-lg"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5 text-text-primary" />
            </button>

            {initialUser && initialProfile ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-3 p-2 hover:bg-neutral-main rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-lighter rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {getInitials(initialProfile.full_name || 'U')}
                    </span>
                  </div>
                  <span className="hidden sm:block font-medium text-text-primary">
                    {initialProfile.full_name?.split(' ')[0]}
                  </span>
                </button>

                {profileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-neutral-border z-50">
                      <div className="p-4 border-b border-neutral-border">
                        <p className="font-semibold text-text-primary">{initialProfile.full_name}</p>
                        <p className="text-sm text-text-secondary">{initialProfile.email}</p>
                        <p className="text-xs text-text-disabled mt-1 capitalize">{initialProfile.role}</p>
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
                        
                        {/* MENU ADMIN - VISIBILE SOLO AD ADMIN/EDITOR */}
                        {(initialProfile?.role === 'admin' || initialProfile?.role === 'editor') && (
                          <>
                            <div className="my-2 border-t border-neutral-border"></div>
                            <div className="px-4 py-2">
                              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                Amministrazione
                              </p>
                            </div>
                            
                            <Link
                              href="/admin/moderation"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-main transition-colors"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <Shield className="w-5 h-5 text-orange-600" />
                              <span className="text-text-primary">Moderazione</span>
                            </Link>

                            {/* LINK GESTIONE UTENTI - SOLO ADMIN */}
                            {initialProfile?.role === 'admin' && (
                              <Link
                                href="/admin/users"
                                className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-main transition-colors"
                                onClick={() => setProfileMenuOpen(false)}
                              >
                                <Users className="w-5 h-5 text-blue-600" />
                                <span className="text-text-primary">Gestione Utenti</span>
                              </Link>
                            )}

                            <Link
                              href="/admin/impostazioni"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-main transition-colors"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <Settings className="w-5 h-5 text-purple-600" />
                              <span className="text-text-primary">Impostazioni Sito</span>
                            </Link>
                          </>
                        )}
                        
                        <div className="my-2 border-t border-neutral-border"></div>
                        
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
                          <span className="text-red-600 font-medium">Esci</span>
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

        {/* MOBILE SEARCH DROPDOWN */}
        {searchOpen && (
          <div className="md:hidden py-4 border-t border-neutral-border">
            <form onSubmit={handleSearch} className="space-y-3">
              
              {/* Scelta Categoria Mobile */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSearchCategory('immobili')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    searchCategory === 'immobili'
                      ? 'bg-primary text-white'
                      : 'bg-neutral-main text-text-primary'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Immobili</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchCategory('handmade')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    searchCategory === 'handmade'
                      ? 'bg-secondary text-white'
                      : 'bg-neutral-main text-text-primary'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span>Handmade</span>
                </button>
              </div>

              {/* Input Ricerca Mobile */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Cerca ${searchCategory}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MOBILE MENU */}
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
              {!initialUser && (
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
