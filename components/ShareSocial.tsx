'use client';

import { useState } from 'react';
import { Facebook, Instagram, Copy, Check, Share2 } from 'lucide-react';

interface ShareSocialProps {
  title: string;
  url: string;
  type: 'property' | 'product';
}

export default function ShareSocial({ title, url, type }: ShareSocialProps) {
  const [copied, setCopied] = useState(false);

  // Testo per condivisione
  const shareText = type === 'property' 
    ? `🏠 Guarda questo immobile: ${title}` 
    : `🎨 Scopri questo prodotto handmade: ${title}`;
  
  // URL encode
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  // Link condivisione Facebook
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  // Instagram Stories (funziona solo su mobile con l'app installata)
  const handleInstagramShare = () => {
    // Su desktop mostriamo un messaggio
    if (window.innerWidth > 768) {
      alert('📱 Per condividere su Instagram:\n\n1. Apri Instagram sul tuo smartphone\n2. Crea una nuova Storia\n3. Aggiungi il link: ' + url);
    } else {
      // Su mobile tentiamo di aprire Instagram
      window.location.href = 'instagram://story-camera';
      
      // Fallback: copiamo il link
      setTimeout(() => {
        handleCopyLink();
        alert('Link copiato! Incollalo nella tua Storia Instagram 📸');
      }, 1000);
    }
  };

  // Copia link negli appunti
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Errore copia link:', err);
      // Fallback per browser vecchi
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-text-primary">
          Condividi il tuo annuncio
        </h3>
      </div>
      
      <p className="text-sm text-text-secondary mb-4">
        Fai conoscere il tuo {type === 'property' ? 'immobile' : 'prodotto'} sui social!
      </p>

      <div className="flex flex-wrap gap-3">
        {/* Facebook */}
        <a
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-[#1877F2] hover:bg-[#0C63D4] text-white rounded-lg transition-colors font-medium"
        >
          <Facebook className="w-5 h-5" fill="currentColor" />
          <span>Facebook</span>
        </a>

        {/* Instagram */}
        <button
          onClick={handleInstagramShare}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#FD1D1D] hover:opacity-90 text-white rounded-lg transition-opacity font-medium"
        >
          <Instagram className="w-5 h-5" />
          <span>Instagram</span>
        </button>

        {/* Copia Link */}
        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all font-medium ${
            copied
              ? 'bg-green-100 text-green-700 border-2 border-green-300'
              : 'bg-white text-text-primary border-2 border-neutral-border hover:border-primary hover:text-primary'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              <span>Copiato!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>Copia Link</span>
            </>
          )}
        </button>
      </div>

      {/* Link preview */}
      <div className="mt-4 p-3 bg-white rounded-lg border border-neutral-border">
        <p className="text-xs text-text-secondary mb-1">Link annuncio:</p>
        <p className="text-sm text-primary font-mono break-all">{url}</p>
      </div>
    </div>
  );
}
