'use client';

import { Mail, ExternalLink } from 'lucide-react';

interface ContactSectionProps {
  listingType: 'property' | 'product';
  listingTitle: string;
  sellerEmail: string;
  sellerName: string;
}

export default function ContactSection(props: ContactSectionProps) {
  const typeLabel = props.listingType === 'property' ? 'immobile' : 'prodotto';
  
  const subject = encodeURIComponent('Interesse per: ' + props.listingTitle);
  const body = encodeURIComponent('Ciao ' + props.sellerName + ',\n\nsono interessato al tuo ' + typeLabel + '.\n\nGrazie');
  const mailtoUrl = 'mailto:' + props.sellerEmail + '?subject=' + subject + '&body=' + body;

  return (
    <div className="bg-primary-lighter rounded-xl p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Mail className="w-5 h-5 text-primary" />
        Contatta l'inserzionista
      </h2>
      
      
        href={mailtoUrl}
        className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-all group"
      >
        <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
          <Mail className="w-6 h-6 text-primary group-hover:text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text-primary">Invia Email</p>
          <p className="text-sm text-text-secondary truncate">{props.sellerEmail}</p>
        </div>
        <ExternalLink className="w-5 h-5 text-text-secondary group-hover:text-primary" />
      </a>

      <p className="text-xs text-text-secondary mt-3 text-center">
        Il click aprirà il tuo client email
      </p>
    </div>
  );
}
