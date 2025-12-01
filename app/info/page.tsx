import Link from 'next/link';
import { UserPlus, Search, MessageSquare, Shield, Heart, TrendingUp } from 'lucide-react';

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-neutral-main">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Come Funziona il Portale
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Tutto quello che devi sapere per iniziare a vendere o acquistare su Portale Immobili & Handmade
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Inizia in 3 Semplici Passi
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-primary-lighter rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-8 h-8 text-primary" />
              </div>
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Registrati Gratis
              </h3>
              <p className="text-text-secondary">
                Crea il tuo account in pochi secondi. È completamente gratuito e senza impegno.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-primary-lighter rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Pubblica o Cerca
              </h3>
              <p className="text-text-secondary">
                Inserisci il tuo annuncio gratuitamente o cerca tra centinaia di opportunità.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-primary-lighter rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Contatta Direttamente
              </h3>
              <p className="text-text-secondary">
                Contatta gli inserzionisti tramite email, telefono o WhatsApp. I contatti sono visibili solo agli utenti registrati.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Perché Scegliere il Nostro Portale
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  100% Gratuito
                </h3>
                <p className="text-text-secondary">
                  Non ci sono costi nascosti. Pubblica annunci illimitati senza pagare nulla.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Contatto Diretto
                </h3>
                <p className="text-text-secondary">
                  Nessun intermediario. Contatta venditori e acquirenti tramite email, telefono o WhatsApp.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Facile da Usare
                </h3>
                <p className="text-text-secondary">
                  Interfaccia intuitiva e semplice. Pubblica un annuncio in pochi minuti.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Sicuro e Affidabile
                </h3>
                <p className="text-text-secondary">
                  Tutti gli account sono verificati. Messaggistica sicura e protetta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Cosa Puoi Trovare
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Immobili */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-2xl font-semibold text-text-primary mb-4">
                🏘️ Immobili
              </h3>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Appartamenti in vendita e affitto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Ville e case indipendenti</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Terreni e lotti edificabili</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Affitti brevi per vacanze</span>
                </li>
              </ul>
              <Link 
                href="/immobili"
                className="mt-6 inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Esplora Immobili
              </Link>
            </div>

            {/* Handmade */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-2xl font-semibold text-text-primary mb-4">
                🎨 Handmade
              </h3>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Ceramiche e oggetti in terracotta</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Mobili e oggetti in legno</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Gioielli artigianali</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Tessuti e abbigliamento fatto a mano</span>
                </li>
              </ul>
              <Link 
                href="/handmade"
                className="mt-6 inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Scopri Handmade
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto a Iniziare?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Unisciti alla nostra community e inizia a pubblicare i tuoi annunci gratuitamente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/register"
              className="bg-white text-primary px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
            >
              Registrati Ora
            </Link>
            <Link 
              href="/immobili"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg hover:bg-blue-800 transition-colors font-semibold text-lg"
            >
              Esplora Annunci
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
