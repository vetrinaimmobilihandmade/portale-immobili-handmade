'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Cookie, Settings, Shield, BarChart, User } from 'lucide-react';
import Link from 'next/link';

export default function CookiePage() {
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

  // Valori di fallback se non ci sono dati
  const siteName = siteSettings?.site_name || 'Portale Immobili & Handmade';
  const privacyEmail = siteSettings?.privacy_email || 'privacy@portaleimmobili.it';
  const supportPhone = siteSettings?.support_phone || '+39 347 123 4567';

  return (
    <div className="min-h-screen bg-neutral-main">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Cookie className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cookie Policy
          </h1>
          <p className="text-xl text-blue-100">
            Come utilizziamo i cookie sul nostro portale
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
            Cosa sono i Cookie?
          </h2>
          <p className="text-text-secondary mb-4">
            I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo (computer, 
            tablet o smartphone) quando visiti un sito web. I cookie permettono al sito di riconoscerti 
            e ricordare le tue preferenze.
          </p>
          <p className="text-text-secondary">
            Utilizziamo i cookie per migliorare la tua esperienza sul nostro portale, analizzare 
            come viene utilizzato il sito e personalizzare i contenuti.
          </p>
        </div>

        {/* Section 1 - Types of Cookies */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Tipi di Cookie che Utilizziamo
          </h2>

          {/* Cookie Type 1 */}
          <div className="mb-6 pb-6 border-b border-neutral-border">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  1. Cookie Essenziali
                </h3>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-3">
                  Sempre Attivi
                </span>
              </div>
            </div>
            <p className="text-text-secondary mb-3">
              Questi cookie sono necessari per il funzionamento base del sito e non possono essere disattivati.
            </p>
            <p className="text-text-secondary mb-3">
              <strong>Finalità:</strong>
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-1">
              <li>Gestione della sessione di accesso</li>
              <li>Sicurezza e prevenzione frodi</li>
              <li>Preferenze di base del sito</li>
              <li>Funzionalità del carrello (se applicabile)</li>
            </ul>
            <p className="text-sm text-text-secondary mt-3">
              <strong>Durata:</strong> Sessione o fino a 1 anno
            </p>
          </div>

          {/* Cookie Type 2 */}
          <div className="mb-6 pb-6 border-b border-neutral-border">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  2. Cookie di Funzionalità
                </h3>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-3">
                  Opzionali
                </span>
              </div>
            </div>
            <p className="text-text-secondary mb-3">
              Questi cookie permettono al sito di ricordare le tue scelte e fornire funzionalità avanzate.
            </p>
            <p className="text-text-secondary mb-3">
              <strong>Finalità:</strong>
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-1">
              <li>Ricordare le preferenze di lingua</li>
              <li>Memorizzare le impostazioni dell'account</li>
              <li>Ricordare filtri di ricerca applicati</li>
              <li>Personalizzazione dell'interfaccia</li>
            </ul>
            <p className="text-sm text-text-secondary mt-3">
              <strong>Durata:</strong> Fino a 1 anno
            </p>
          </div>

          {/* Cookie Type 3 */}
          <div className="mb-6 pb-6 border-b border-neutral-border">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  3. Cookie Analitici
                </h3>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full mb-3">
                  Opzionali
                </span>
              </div>
            </div>
            <p className="text-text-secondary mb-3">
              Questi cookie ci aiutano a capire come i visitatori utilizzano il sito.
            </p>
            <p className="text-text-secondary mb-3">
              <strong>Finalità:</strong>
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-1">
              <li>Conteggio visite e traffico</li>
              <li>Pagine più visualizzate</li>
              <li>Tempo trascorso sul sito</li>
              <li>Analisi del comportamento degli utenti</li>
            </ul>
            <p className="text-sm text-text-secondary mt-3">
              <strong>Servizi utilizzati:</strong> Google Analytics (anonimizzato)
            </p>
            <p className="text-sm text-text-secondary mt-1">
              <strong>Durata:</strong> Fino a 2 anni
            </p>
          </div>

          {/* Cookie Type 4 */}
          <div>
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  4. Cookie di Terze Parti
                </h3>
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full mb-3">
                  Opzionali
                </span>
              </div>
            </div>
            <p className="text-text-secondary mb-3">
              Alcuni servizi esterni possono impostare i loro cookie attraverso il nostro sito.
            </p>
            <p className="text-text-secondary mb-3">
              <strong>Servizi di terze parti:</strong>
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-1">
              <li>Google Maps (per mappe e localizzazione)</li>
              <li>Supabase (per autenticazione)</li>
              <li>Vercel Analytics (per statistiche)</li>
            </ul>
            <p className="text-sm text-text-secondary mt-3">
              <strong>Durata:</strong> Varia in base al servizio
            </p>
          </div>
        </div>

        {/* Cookie Table */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 overflow-x-auto">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Elenco Cookie Utilizzati
          </h2>
          
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-neutral-border">
                <th className="text-left py-3 px-2 font-semibold text-text-primary">Nome</th>
                <th className="text-left py-3 px-2 font-semibold text-text-primary">Tipo</th>
                <th className="text-left py-3 px-2 font-semibold text-text-primary">Durata</th>
                <th className="text-left py-3 px-2 font-semibold text-text-primary">Scopo</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-border">
                <td className="py-3 px-2 text-text-primary font-mono text-xs">sb-access-token</td>
                <td className="py-3 px-2 text-text-secondary">Essenziale</td>
                <td className="py-3 px-2 text-text-secondary">1 ora</td>
                <td className="py-3 px-2 text-text-secondary">Autenticazione utente</td>
              </tr>
              <tr className="border-b border-neutral-border">
                <td className="py-3 px-2 text-text-primary font-mono text-xs">sb-refresh-token</td>
                <td className="py-3 px-2 text-text-secondary">Essenziale</td>
                <td className="py-3 px-2 text-text-secondary">30 giorni</td>
                <td className="py-3 px-2 text-text-secondary">Mantenimento sessione</td>
              </tr>
              <tr className="border-b border-neutral-border">
                <td className="py-3 px-2 text-text-primary font-mono text-xs">_ga</td>
                <td className="py-3 px-2 text-text-secondary">Analitico</td>
                <td className="py-3 px-2 text-text-secondary">2 anni</td>
                <td className="py-3 px-2 text-text-secondary">Google Analytics</td>
              </tr>
              <tr className="border-b border-neutral-border">
                <td className="py-3 px-2 text-text-primary font-mono text-xs">_gid</td>
                <td className="py-3 px-2 text-text-secondary">Analitico</td>
                <td className="py-3 px-2 text-text-secondary">24 ore</td>
                <td className="py-3 px-2 text-text-secondary">Google Analytics</td>
              </tr>
              <tr>
                <td className="py-3 px-2 text-text-primary font-mono text-xs">preferences</td>
                <td className="py-3 px-2 text-text-secondary">Funzionalità</td>
                <td className="py-3 px-2 text-text-secondary">1 anno</td>
                <td className="py-3 px-2 text-text-secondary">Preferenze utente</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Managing Cookies */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Come Gestire i Cookie
          </h2>
          
          <p className="text-text-secondary mb-4">
            Puoi controllare e/o eliminare i cookie come desideri. Puoi cancellare tutti i cookie 
            già presenti sul tuo dispositivo e impostare la maggior parte dei browser per impedire 
            che vengano memorizzati.
          </p>

          <h3 className="text-lg font-semibold text-text-primary mb-3 mt-6">
            Gestione tramite Browser
          </h3>
          <p className="text-text-secondary mb-3">
            Ecco come gestire i cookie nei browser più comuni:
          </p>
          <ul className="space-y-2 text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span><strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie e altri dati dei siti</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span><strong>Firefox:</strong> Impostazioni → Privacy e sicurezza → Cookie e dati dei siti web</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span><strong>Safari:</strong> Preferenze → Privacy → Gestisci dati dei siti web</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span><strong>Edge:</strong> Impostazioni → Cookie e autorizzazioni sito → Gestisci ed elimina cookie</span>
            </li>
          </ul>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
            <p className="text-sm text-yellow-800">
              <strong>Attenzione:</strong> Disabilitare i cookie essenziali potrebbe impedire il corretto 
              funzionamento di alcune parti del sito, come l'accesso all'account o la pubblicazione di annunci.
            </p>
          </div>
        </div>

        {/* Third Party */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Cookie di Terze Parti
          </h2>
          
          <p className="text-text-secondary mb-4">
            Alcuni cookie sono impostati da servizi di terze parti che appaiono sulle nostre pagine:
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-text-primary mb-1">Google Analytics</h4>
              <p className="text-sm text-text-secondary mb-2">
                Utilizziamo Google Analytics per analizzare l'uso del nostro sito web.
              </p>
              <a 
                href="https://policies.google.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Informativa Privacy di Google →
              </a>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-text-primary mb-1">Supabase</h4>
              <p className="text-sm text-text-secondary mb-2">
                Utilizziamo Supabase per l'autenticazione e la gestione del database.
              </p>
              <a 
                href="https://supabase.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Informativa Privacy di Supabase →
              </a>
            </div>
          </div>
        </div>

        {/* Updates */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Aggiornamenti alla Cookie Policy
          </h2>
          
          <p className="text-text-secondary">
            Potremmo aggiornare questa Cookie Policy periodicamente per riflettere cambiamenti 
            nelle tecnologie, nelle leggi o nelle nostre pratiche. Ti invitiamo a rivedere 
            questa pagina regolarmente per rimanere informato su come utilizziamo i cookie.
          </p>
        </div>

        {/* Contact & Links - DATI DINAMICI */}
        <div className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">
            Hai Domande?
          </h2>
          <p className="mb-4">
            Per domande sulla nostra Cookie Policy, contattaci:
          </p>
          <div className="space-y-2 mb-6">
            <p><strong>Email:</strong> <a href={`mailto:${privacyEmail}`} className="underline">{privacyEmail}</a></p>
            {supportPhone && <p><strong>Telefono:</strong> {supportPhone}</p>}
          </div>
          <div className="pt-6 border-t border-blue-400">
            <p className="text-sm mb-3">Potrebbero interessarti anche:</p>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/privacy" 
                className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/termini" 
                className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
              >
                Termini e Condizioni
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
