'use client';

import Link from 'next/link';
import { Menu, Search, User, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          
          {/* Logo - Sinistra */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              {/* Placeholder Logo - Sostituisci con la tua immagine */}
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="hidden sm:block font-bold text-xl text-primary">
                Portale
              </span>
            </Link>

            {/* Menu Desktop - Centro */}
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

          {/* Azioni - Destra */}
          <div className="flex items-center gap-4">
            
            {/* Search Desktop */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-neutral-main rounded-lg hover:bg-neutral-hover transition-colors">
              <Search className="w-5 h-5 text-text-secondary" />
              <span className="text-sm text-text-secondary">Cerca...</span>
            </button>

            {/* Search Mobile */}
            <button className="md:hidden p-2 hover:bg-neutral-main rounded-lg">
              <Search className="w-5 h-5 text-text-primary" />
            </button>

            {/* Login/Profile */}
            <Link 
              href="/auth/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary-lighter rounded-lg transition-colors font-medium"
            >
              <User className="w-5 h-5" />
              <span>Accedi</span>
            </Link>

            {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
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
              <Link 
                href="/auth/login"
                className="px-4 py-2 text-primary hover:bg-primary-lighter rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                👤 Accedi
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
