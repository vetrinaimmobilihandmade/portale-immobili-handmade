import { Heart, Target, Users, Lightbulb, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-main">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Chi Siamo
          </h1>
          <p className="text-xl text-blue-100 mb-4">
            Connettere persone, case e artigianato italiano
          </p>
          <p className="text-lg text-blue-200">
            La piattaforma gratuita che unisce il mondo degli immobili e dell'artigianato handmade
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-primary-lighter rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-text-primary text-center mb-6">
              La Nostra Missione
            </h2>
            <p className="text-lg text-text-secondary text-center mb-6">
              Creare un ecosistema digitale dove chiunque possa trovare la casa dei propri sogni o 
              scoprire prodotti artigianali unici, il tutto in modo <strong>semplice, gratuito e trasparente</strong>.
            </p>
            <p className="text-text-secondary text-center">
              Crediamo nel potere della connessione diretta tra persone, eliminando intermediari inutili 
              e valorizzando l'artigianato italiano fatto a mano.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-text-primary text-center mb-8">
            Come È Nato il Portale
          </h2>
          <div className="prose prose-lg max-w-3xl mx-auto text-text-secondary">
            <p>
              Nel 2025, abbiamo notato che molte persone avevano difficoltà a trovare immobili senza 
              intermediari costosi, mentre gli artigiani faticavano a far conoscere le loro creazioni uniche.
            </p>
            <p>
              Da qui è nata l'idea: creare una piattaforma che unisse due mondi apparentemente distanti 
              - gli <strong>immobili</strong> e i <strong>prodotti handmade</strong> - in un unico spazio 
              digitale accessibile a tutti.
            </p>
            <p>
              Volevamo eliminare le barriere: niente costi di pubblicazione, niente commissioni nascoste, 
              solo persone che si connettono direttamente per vendere, comprare o affittare.
            </p>
            <p className="text-primary font-semibold">
              Il risultato? Un marketplace 100% gratuito che mette le persone al centro.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            I Nostri Valori
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Trasparenza
              </h3>
              <p className="text-text-secondary">
                Crediamo nella totale trasparenza. Niente costi nascosti, niente commissioni. 
                Quello che vedi è quello che ottieni.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Community
              </h3>
              <p className="text-text-secondary">
                Non siamo solo una piattaforma, siamo una community. Valorizziamo ogni utente 
                e favoriamo connessioni autentiche.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Artigianato Italiano
              </h3>
              <p className="text-text-secondary">
                Crediamo nel valore dell'artigianato fatto a mano in Italia. Ogni prodotto 
                handmade racconta una storia unica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Il Portale in Numeri
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-text-secondary">Gratuito</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2</div>
              <div className="text-text-secondary">Categorie Principali</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">0€</div>
              <div className="text-text-secondary">Commissioni</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-text-secondary">Sempre Disponibile</div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Cosa Offriamo
          </h2>

          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Pubblicazione Gratuita
                </h3>
                <p className="text-text-secondary">
                  Pubblica annunci illimitati senza pagare nulla. Che tu voglia vendere casa, 
                  affittare un appartamento o promuovere i tuoi prodotti handmade, è tutto gratis.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Contatto Diretto
                </h3>
                <p className="text-text-secondary">
                  Nessun intermediario. Messaggistica integrata per comunicare direttamente con 
                  venditori e acquirenti in modo sicuro e privato.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Sicurezza e Privacy
                </h3>
                <p className="text-text-secondary">
                  I tuoi dati sono protetti. Account verificati, comunicazioni criptate e 
                  moderazione attiva per garantire un ambiente sicuro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section (Optional) */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Il Nostro Team
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Un gruppo di persone appassionate di tecnologia, immobili e artigianato italiano
          </p>
          <p className="text-lg text-blue-200">
            Lavoriamo ogni giorno per migliorare la piattaforma e offrire la migliore esperienza 
            possibile a tutti gli utenti. Il vostro feedback è prezioso per noi!
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Unisciti a Noi
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Fa parte della nostra community. Inizia a pubblicare i tuoi annunci o scopri 
            opportunità uniche nel mondo degli immobili e dell'handmade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/register"
              className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Registrati Gratis
            </Link>
            <Link 
              href="/contatti"
              className="bg-neutral-main text-text-primary px-8 py-4 rounded-lg hover:bg-neutral-hover transition-colors font-semibold text-lg"
            >
              Contattaci
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
