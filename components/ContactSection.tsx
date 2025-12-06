'use client';

import { Mail, Shield, ExternalLink } from 'lucide-react';

interface ContactSectionProps {
  listingType: 'property' | 'product';
  listingTitle: string;
  sellerEmail: string;
  sellerName: string;
}

export default function ContactSection({
  listingType,
  listingTitle,
  sellerEmail,
  sellerName,
}: ContactSectionProps) {
  const typeLabel = listingType === 'property' ? 'immobile' : 'prodotto';
  
  // Crea mailto link con oggetto e corpo pre-compilati
  const subject = encodeURIComponent('Interesse per: ' + listingTitle);
  const body = encodeURIComponent('Ciao ' + sellerName + ',\n\nsono interessato al tuo ' + typeLabel + ': "' + listingTitle + '".\n\nVorrei avere maggiori informazioni.\n\nGrazie,\n');
  const mailtoLink = 'mailto:' + sellerEmail + '?subject=' + subject + '&body=' + body;

  return (
    <div className="space-y-6">
      
      {/* Card Contatto Email */}
      <div className="bg-primary-lighter rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Contatta l'inserzionista
        </h2>
        
        
          href={mailtoLink}
          className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
            <Mail className="w-6 h-6 text-primary group-hover:text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-text-primary">Invia Email</p>
            <p className="text-sm text-text-secondary truncate">{sellerEmail}</p>
          </div>
          <ExternalLink className="w-5 h-5 text-text-secondary group-hover:text-primary" />
        </a>

        <p className="text-xs text-text-secondary mt-3 text-center">
          Il click aprirà il tuo client email (Gmail, Outlook, ecc.)
        </p>
      </div>

      {/* Card Privacy */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-text-primary mb-2">
              💡 Proteggi la tua Privacy
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Non vuoi condividere la tua email reale? Usa un servizio di <strong>Email Forwarding Anonimo</strong>. 
              Questi servizi creano email temporanee che inoltrano i messaggi alla tua vera email senza rivelarla.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-text-primary">🔐 Servizi consigliati (tutti gratuiti):</p>
          
          <div className="grid sm:grid-cols-2 gap-3">
            
              href="https://simplelogin.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-sm transition-all text-sm group"
            >
              <span className="font-medium text-primary group-hover:underline">SimpleLogin</span>
              <ExternalLink className="w-4 h-4 text-text-secondary" />
            </a>

            
              href="https://anonaddy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-sm transition-all text-sm group"
            >
              <span className="font-medium text-primary group-hover:underline">AnonAddy</span>
              <ExternalLink className="w-4 h-4 text-text-secondary" />
            </a>

            
              href="https://relay.firefox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-sm transition-all text-sm group"
            >
              <span className="font-medium text-primary group-hover:underline">Firefox Relay</span>
              <ExternalLink className="w-4 h-4 text-text-secondary" />
            </a>

            
              href="https://duckduckgo.com/email"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-sm transition-all text-sm group"
            >
              <span className="font-medium text-primary group-hover:underline">DuckDuckGo</span>
              <ExternalLink className="w-4 h-4 text-text-secondary" />
            </a>
          </div>

          <p className="text-xs text-text-secondary mt-4">
            💡 <strong>Come funziona:</strong> Crei un alias email (es: mario123@simplelogin.co) e lo usi per registrarti. 
            Le email arrivano alla tua vera email, ma il tuo indirizzo reale resta nascosto.
          </p>
        </div>
      </div>
    </div>
  );
}
