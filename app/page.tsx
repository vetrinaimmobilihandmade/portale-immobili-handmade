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

      {/* 🆕 Banner Aiuto/Contatti - SUBITO DOPO HERO */}
      <section className="py-8 px-4 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-y-2 border-orange-200">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-300 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 p-6 md:p-8">
              
              {/* Icona Attenzione Animata */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {/* Cerchio esterno pulsante */}
                  <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-20"></div>
                  {/* Icona principale */}
                  <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-xl">
                    <svg className="w-11 h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  {/* Badge esclamativo */}
                  <div className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                </div>
              </div>

              {/* Testo */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                  Hai bisogno di aiuto? 🤝
                </h3>
                <p className="text-base md:text-lg text-text-secondary mb-1">
                  Vuoi <strong className="text-orange-600">aggiungere nuove categorie</strong>, segnalare <strong className="text-orange-600">problemi</strong> o ricevere <strong className="text-orange-600">assistenza</strong>?
                </p>
                <p className="text-sm text-text-secondary">
                  Il nostro team è a tua disposizione per qualsiasi necessità!
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex-shrink-0">
                <Link
                  href="/contatti"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contattaci Ora
                </Link>
              </div>
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
                3. Contatto Diretto via Email
              </h3>
              <p className="text-text-secondary">
                Una volta registrato, contatta gli inserzionisti direttamente via email. Nessun intermediario, comunicazione privata e sicura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sezioni Preview */}
      <section className="py-20 bg-neutral-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Immobili Preview - 🎨 MODIFICATA CON STILE BLU */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-blue-600">Immobili</h3>
              </div>
              <p className="text-text-secondary mb-6">
                Cerca case in vendita, affitto o affitti brevi. Trova l'immobile perfetto per te in tutta Italia.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Appartamenti, ville, terreni e altro
                </li>
                <li className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Filtri avanzati per regione e provincia
                </li>
                <li className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Contatto diretto con i proprietari
                </li>
              </ul>
              <Link
                href="/immobili"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
              >
                Esplora Immobili
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Handmade Preview - INVARIATA */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Palette className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-orange-600">Handmade</h3>
              </div>
              <p className="text-text-secondary mb-6">
                Scopri prodotti artigianali unici realizzati da artisti italiani. Ogni pezzo racconta una storia.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  Ceramiche, legno, tessuti e gioielli
                </li>
                <li className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  Prodotti personalizzabili su richiesta
                </li>
                <li className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  Supporta artigiani locali
                </li>
              </ul>
              <Link
                href="/handmade"
                className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:gap-3 transition-all"
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
