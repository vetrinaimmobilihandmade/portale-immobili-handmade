import Link from 'next/link';
import { Coffee, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-main border-t border-neutral-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Logo e Slogan */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-bold text-lg text-primary">Portale</span>
          </div>
          <p className="text-sm text-text-secondary max-w-md">
            Il tuo marketplace italiano per immobili e artigianato
          </p>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          
          {/* Colonna 1 */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Il Portale</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/immobili" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  Immobili
                </Link>
              </li>
              <li>
                <Link href="/handmade" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  Handmade
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  Chi Siamo
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonna 2 */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Supporto</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/info" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  Come Funziona
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  Contatti
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonna 3 */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Legale</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/termini" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  Termini e Condizioni
                </Link>
              </li>
              <li>
                <Link href="/cookie" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonna 4 - Seguici (Opzionale) */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Seguici</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Sezione Donazioni Ko-fi */}
        <div className="mb-8">
          <div className="bg-secondary-lighter border border-secondary-light rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-secondary" />
              <div>
                <h3 className="font-semibold text-text-primary">Sostieni il progetto</h3>
                <p className="text-sm text-text-secondary">Aiutaci a mantenere il portale gratuito</p>
              </div>
            </div>
            <a
              href="https://ko-fi.com/alnet"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-hover text-white rounded-lg transition-colors font-semibold whitespace-nowrap"
            >
              <Coffee className="w-5 h-5" />
              Offrici un caffè
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
            <p>© 2025 Portale. Tutti i diritti riservati.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-secondary fill-secondary" /> in Italy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
