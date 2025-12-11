'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale } from 'lucide-react';

export default function TerminiPage() {
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    
    if (data) setSiteSettings(data);
  };

  // ✅ MODIFICATO: Usare contact_email e contact_phone da site_settings
  const siteName = siteSettings?.site_name || 'Portale Immobili & Handmade';
  const contactEmail = siteSettings?.contact_email || 'info@portaleimmobili.it';
  const contactPhone = siteSettings?.contact_phone || '+39 347 123 4567';

  return (
    <div className="min-h-screen bg-neutral-main">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FileText className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Termini e Condizioni
          </h1>
          <p className="text-xl text-blue-100">
            Condizioni d'uso del servizio {siteName}
          </p>
          <p className="text-sm text-blue-200 mt-4">
            Ultimo aggiornamento: 30 Novembre 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Introduzione
          </h2>
          <p className="text-text-secondary mb-4">
            Benvenuto su {siteName} (il "Servizio", "Portale", "noi", "nostro"). 
            Questi Termini e Condizioni ("Termini") disciplinano l'accesso e l'utilizzo del nostro portale web.
          </p>
          <p className="text-text-secondary mb-4">
            Utilizzando il nostro Servizio, accetti di essere vincolato da questi Termini. Se non accetti 
            questi Termini, ti preghiamo di non utilizzare il Servizio.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Leggi attentamente questi Termini prima di utilizzare il Servizio. 
                Registrandoti o utilizzando il Portale, confermi di aver letto, compreso e accettato questi Termini.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                1. Accettazione dei Termini
              </h2>
            </div>
          </div>
          
          <p className="text-text-secondary mb-3">
            Accedendo e utilizzando il Servizio, tu ("Utente") accetti:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>Di avere almeno 18 anni di età</li>
            <li>Di fornire informazioni accurate e veritiere</li>
            <li>Di rispettare tutti i Termini qui descritti</li>
            <li>Di rispettare le leggi locali, nazionali e internazionali applicabili</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            2. Descrizione del Servizio
          </h2>
          
          <p className="text-text-secondary mb-3">
            {siteName} è una piattaforma gratuita che permette agli utenti di:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
            <li>Pubblicare annunci di immobili (vendita, affitto, affitti brevi)</li>
            <li>Pubblicare annunci di prodotti artigianali handmade</li>
            <li>Cercare e visualizzare annunci di altri utenti</li>
            <li>Comunicare direttamente con altri utenti tramite email</li>
          </ul>
          <p className="text-text-secondary">
            Il Portale agisce esclusivamente come intermediario tecnologico. Non siamo parte delle 
            transazioni tra utenti e non garantiamo l'accuratezza degli annunci pubblicati.
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            3. Registrazione e Account
          </h2>
          
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            3.1 Creazione Account
          </h3>
          <p className="text-text-secondary mb-3">
            Per utilizzare alcune funzionalità del Servizio, devi creare un account. Ti impegni a:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
            <li>Fornire informazioni accurate, complete e aggiornate</li>
            <li>Mantenere la sicurezza della tua password</li>
            <li>Notificarci immediatamente di qualsiasi uso non autorizzato del tuo account</li>
            <li>Non creare account multipli o falsi</li>
          </ul>

          <h3 className="text-lg font-semibold text-text-primary mb-3 mt-6">
            3.2 Responsabilità Account
          </h3>
          <p className="text-text-secondary">
            Sei responsabile di tutte le attività che si verificano sotto il tuo account. 
            Non condividere le tue credenziali con terzi.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            4. Pubblicazione Annunci
          </h2>
          
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            4.1 Regole Generali
          </h3>
          <p className="text-text-secondary mb-3">
            Quando pubblichi un annuncio, dichiari che:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
            <li>Hai il diritto di vendere/affittare il bene o servizio pubblicato</li>
            <li>Le informazioni fornite sono accurate e veritiere</li>
            <li>Le foto sono autentiche e rappresentano fedelmente il prodotto/immobile</li>
            <li>Il prezzo indicato è corretto e finale</li>
          </ul>

          <h3 className="text-lg font-semibold text-text-primary mb-3 mt-6">
            4.2 Contenuti Vietati
          </h3>
          <p className="text-text-secondary mb-3">
            È vietato pubblicare annunci che:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>Violano leggi locali, nazionali o internazionali</li>
            <li>Contengono contenuti offensivi, diffamatori o illegali</li>
            <li>Promuovono discriminazione di qualsiasi tipo</li>
            <li>Includono spam o contenuti promozionali non pertinenti</li>
            <li>Violano diritti di proprietà intellettuale di terzi</li>
            <li>Sono fraudolenti o ingannevoli</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                5. Condotta Vietata
              </h2>
            </div>
          </div>
          
          <p className="text-text-secondary mb-3">
            Gli utenti NON possono:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>Utilizzare il Servizio per attività illegali</li>
            <li>Molestare, minacciare o intimidire altri utenti</li>
            <li>Raccogliere dati di altri utenti senza consenso</li>
            <li>Diffondere virus, malware o codice dannoso</li>
            <li>Tentare di accedere non autorizzato al sistema</li>
            <li>Creare account automatizzati o bot</li>
            <li>Pubblicare annunci falsi o ingannevoli</li>
            <li>Manipolare il sistema di valutazioni o recensioni</li>
          </ul>
        </div>

        {/* Section 6 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            6. Transazioni tra Utenti
          </h2>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                <strong>Attenzione:</strong> Il Portale NON gestisce pagamenti, consegne o transazioni. 
                Agiamo esclusivamente come piattaforma di connessione.
              </p>
            </div>
          </div>

          <p className="text-text-secondary mb-3">
            Gli utenti sono gli unici responsabili per:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
            <li>Negoziazione di prezzi e termini</li>
            <li>Modalità di pagamento</li>
            <li>Consegna o visione di beni</li>
            <li>Verifica della qualità e conformità</li>
            <li>Eventuali contratti scritti (es. contratti di locazione)</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Comunicazione tra utenti:</strong> Il contatto tra inserzionisti e interessati 
              avviene esclusivamente tramite email diretta. Gli utenti registrati possono visualizzare 
              l'indirizzo email dell'inserzionista nell'annuncio per avviare la comunicazione in modo 
              privato e sicuro.
            </p>
          </div>
        </div>

        {/* Section 7 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Scale className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                7. Limitazione di Responsabilità
              </h2>
            </div>
          </div>
          
          <p className="text-text-secondary mb-4">
            <strong>Il Servizio è fornito "così com'è" senza garanzie di alcun tipo.</strong>
          </p>
          
          <p className="text-text-secondary mb-3">
            Non siamo responsabili per:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>Accuratezza, completezza o affidabilità degli annunci</li>
            <li>Condotta di altri utenti</li>
            <li>Transazioni fallite o dispute tra utenti</li>
            <li>Perdite finanziarie derivanti dall'uso del Servizio</li>
            <li>Interruzioni temporanee del Servizio</li>
            <li>Perdita di dati o contenuti</li>
          </ul>
        </div>

        {/* Section 8 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            8. Proprietà Intellettuale
          </h2>
          
          <p className="text-text-secondary mb-3">
            Il Servizio e tutto il suo contenuto (design, logo, codice, testi) sono di proprietà 
            di {siteName} e sono protetti da copyright e altre leggi sulla proprietà intellettuale.
          </p>
          <p className="text-text-secondary mb-3">
            Gli utenti mantengono i diritti sui contenuti che pubblicano (foto, testi degli annunci), 
            ma concedono al Portale una licenza non esclusiva per utilizzare tali contenuti al fine di 
            fornire il Servizio.
          </p>
        </div>

        {/* Section 9 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            9. Sospensione e Cancellazione Account
          </h2>
          
          <p className="text-text-secondary mb-3">
            Ci riserviamo il diritto di sospendere o cancellare il tuo account in qualsiasi momento se:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>Violi questi Termini e Condizioni</li>
            <li>Pubblichi contenuti vietati</li>
            <li>Ricevi multiple segnalazioni da altri utenti</li>
            <li>Commetti frodi o attività illegali</li>
            <li>Utilizzi il Servizio in modo improprio</li>
          </ul>
        </div>

        {/* Section 10 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            10. Modifiche ai Termini
          </h2>
          
          <p className="text-text-secondary">
            Ci riserviamo il diritto di modificare questi Termini in qualsiasi momento. Le modifiche 
            saranno effettive immediatamente dopo la pubblicazione. L'uso continuato del Servizio dopo 
            le modifiche costituisce accettazione dei nuovi Termini. Ti consigliamo di rivedere 
            periodicamente questa pagina.
          </p>
        </div>

        {/* Section 11 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            11. Legge Applicabile
          </h2>
          
          <p className="text-text-secondary">
            Questi Termini sono regolati dalla legge italiana. Qualsiasi controversia sarà sottoposta 
            alla giurisdizione esclusiva dei tribunali competenti.
          </p>
        </div>

        {/* Contact - DATI DINAMICI AGGIORNATI (senza indirizzo) */}
        <div className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">
            12. Contattaci
          </h2>
          <p className="mb-4">
            Per domande o chiarimenti riguardanti questi Termini e Condizioni:
          </p>
          <div className="space-y-2">
            <p><strong>Email:</strong> <a href={`mailto:${contactEmail}`} className="underline">{contactEmail}</a></p>
            {contactPhone && <p><strong>Telefono:</strong> {contactPhone}</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
