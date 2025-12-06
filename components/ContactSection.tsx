'use client';

import { Mail } from 'lucide-react';

interface ContactSectionProps {
  listingType: 'property' | 'product';
  listingTitle: string;
  sellerEmail: string;
  sellerName: string;
}

export default function ContactSection(props: ContactSectionProps) {
  const mailtoUrl = 'mailto:' + props.sellerEmail;

  return (
    <div className="space-y-6">
      <div className="bg-primary-lighter rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Contatta l'inserzionista
        </h2>
        <a href={mailtoUrl} className="flex items-center gap-3 p-4 bg-white rounded-lg">
          <Mail className="w-6 h-6 text-primary" />
          <div>
            <p className="font-medium text-text-primary">Invia Email</p>
            <p className="text-sm text-text-secondary">{props.sellerEmail}</p>
          </div>
        </a>
      </div>
    </div>
  );
}
