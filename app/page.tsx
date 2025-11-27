import Link from 'next/link';
import { ArrowRight, Home, Palette, Shield, Users, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-lighter to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
              Il tuo marketplace italiano per{' '}
              <span className="text-primary">immobili</span> e{' '}
              <span className="text-secondary">artigianato</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary mb-8">
              Trova la casa dei tuoi sogni o scopri prodotti artigianali unici. 
              Tutto in un unico posto, semplice e gratuito.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/immobili"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-md"
              >
                Esplora Immobili
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/handmade"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-neutral-hover border-2 border-secondary text-secondary rounded-lg font-semibold transition-colors"
              >
                Scopri Handmade
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Come Funziona */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Come Funziona
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Inizia subito in tre semplici passaggi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-lighter rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                1. Registrati Gratis
              </h3>
              <p className="text-text-secondary">
                Crea il tuo account in pochi secondi. Nessun costo, nessun impegno.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-lighter rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                2. Pubblica o Cerca
              </h3>
              <p className="text-text-secondary">
                Inserisci il tuo annuncio o cerca tra centinaia di opportunità.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-lighter rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                3. Connettiti Direttamente
              </h3>
              <p className="text-text-secondary">
                Contatta inserzionisti tramite messaggistica sicura e privata.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sezioni Preview */}
      <section className="py-20 bg-neutral-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Immobili Preview */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">Immobili</h3>
              </div>
              <p className="text-text-secondary mb-6">
                Cerca case in vendita, affitto o affitti brevi. Trova l'immobile perfetto per te in tutta Italia.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Appartamenti, ville, terreni e altro
                </li>
                <li className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Filtri avanzati per regione e provincia
                </li>
                <li className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Contatto diretto con i proprietari
                </li>
              </ul>
              <Link
                href="/immobili"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                Esplora Immobili
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Handmade Preview */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-secondary-lighter rounded-lg flex items-center justify-center">
                  <Palette className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">Handmade</h3>
              </div>
              <p className="text-text-secondary mb-6">
                Scopri prodotti artigianali unici realizzati da artisti italiani. Ogni pezzo racconta una storia.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  Ceramiche, legno, tessuti e gioielli
                </li>
                <li className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  Prodotti personalizzabili su richiesta
                </li>
                <li className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  Supporta artigiani locali
                </li>
              </ul>
              <Link
                href="/handmade"
                className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all"
              >
                Scopri Handmade
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Finale */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Pronto a Iniziare?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Unisciti alla nostra community e inizia a pubblicare i tuoi annunci gratuitamente.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-neutral-main text-primary rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
          >
            Registrati Ora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
