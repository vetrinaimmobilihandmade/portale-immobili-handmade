'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    category: 'Generale',
    question: 'Il servizio è davvero gratuito?',
    answer: 'Sì, completamente gratuito! Non ci sono costi nascosti, commissioni o abbonamenti. Puoi pubblicare annunci illimitati senza pagare nulla.',
  },
  {
    category: 'Generale',
    question: 'Come funziona la registrazione?',
    answer: 'La registrazione è semplicissima: inserisci nome, cognome, email, telefono e crea una password. Riceverai un\'email di conferma e potrai iniziare subito a pubblicare annunci.',
  },
  {
    category: 'Generale',
    question: 'Devo verificare il mio account?',
    answer: 'Sì, dopo la registrazione riceverai un\'email di verifica. Clicca sul link per attivare il tuo account e iniziare a usare tutte le funzionalità del portale.',
  },
  {
    category: 'Annunci',
    question: 'Come pubblico un annuncio?',
    answer: 'Dopo aver effettuato l\'accesso, vai nella tua dashboard e clicca su "Nuovo Annuncio". Scegli la categoria (Immobili o Handmade), compila i campi richiesti, aggiungi foto e pubblica!',
  },
  {
    category: 'Annunci',
    question: 'Quanti annunci posso pubblicare?',
    answer: 'Non c\'è limite! Puoi pubblicare quanti annunci vuoi, sia per immobili che per prodotti handmade, tutto gratuitamente.',
  },
  {
    category: 'Annunci',
    question: 'Posso modificare un annuncio dopo averlo pubblicato?',
    answer: 'Certamente! Vai nella tua dashboard, trova l\'annuncio che vuoi modificare e clicca su "Modifica". Puoi aggiornare testo, foto e prezzo in qualsiasi momento.',
  },
  {
    category: 'Annunci',
    question: 'Quanto tempo resta online un annuncio?',
    answer: 'Gli annunci restano online finché decidi di rimuoverli. Ti consigliamo di aggiornare periodicamente gli annunci per mantenerli in evidenza.',
  },
  {
    category: 'Immobili',
    question: 'Che tipo di immobili posso pubblicare?',
    answer: 'Puoi pubblicare qualsiasi tipo di immobile: appartamenti, ville, case indipendenti, terreni, negozi, uffici, sia in vendita che in affitto (lungo o breve termine).',
  },
  {
    category: 'Immobili',
    question: 'Sono un\'agenzia, posso usare il portale?',
    answer: 'Sì! Il portale è aperto sia a privati che ad agenzie immobiliari. Specifica nel tuo profilo se sei un\'agenzia per maggiore trasparenza.',
  },
  {
    category: 'Handmade',
    question: 'Cosa posso vendere nella sezione Handmade?',
    answer: 'Prodotti artigianali fatti a mano: ceramiche, gioielli, mobili in legno, tessuti, abbigliamento, decorazioni, oggettistica e tutto ciò che è fatto con le tue mani!',
  },
  {
    category: 'Handmade',
    question: 'Posso vendere prodotti personalizzabili?',
    answer: 'Assolutamente sì! Specifica nell\'annuncio che offri personalizzazioni e gli acquirenti potranno contattarti per richieste su misura.',
  },
  {
    category: 'Sicurezza',
    question: 'Come posso essere sicuro che un annuncio sia affidabile?',
    answer: 'Verifica sempre che l\'account sia verificato (icona di verifica sul profilo). Contatta gli inserzionisti via email e diffida di richieste di pagamenti anticipati fuori dal portale.',
  },
  {
    category: 'Sicurezza',
    question: 'Come posso contattare un inserzionista?',
    answer: 'Una volta loggato, puoi vedere l\'email dell\'inserzionista nell\'annuncio e contattarlo direttamente. Solo gli utenti registrati possono vedere queste informazioni per garantire maggiore sicurezza.',
  },
  {
    category: 'Sicurezza',
    question: 'Cosa faccio se ricevo messaggi sospetti?',
    answer: 'Segnala immediatamente qualsiasi comportamento sospetto contattando il nostro supporto. Non condividere mai dati bancari o effettuare pagamenti al di fuori delle modalità concordate di persona.',
  },
  {
    category: 'Pagamenti',
    question: 'Il portale gestisce i pagamenti?',
    answer: 'No, il portale mette in contatto venditori e acquirenti. I pagamenti e le transazioni vengono gestiti direttamente tra le parti. Ti consigliamo di usare metodi di pagamento tracciabili.',
  },
  {
    category: 'Pagamenti',
    question: 'Posso richiedere un deposito cauzionale?',
    answer: 'Per gli affitti, puoi concordare un deposito cauzionale direttamente con l\'inquilino. Assicurati di formalizzare tutto con un contratto scritto.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Tutte');

  const categories = ['Tutte', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  
  const filteredFaqs = activeCategory === 'Tutte' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-neutral-main">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Domande Frequenti
          </h1>
          <p className="text-xl text-blue-100">
            Trova rapidamente le risposte alle tue domande
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 bg-white border-b border-neutral-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-neutral-main text-text-secondary hover:bg-neutral-hover'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-neutral-main transition-colors"
                >
                  <div className="flex items-start gap-4 text-left flex-1">
                    <span className="text-xs font-semibold text-primary bg-primary-lighter px-3 py-1 rounded-full mt-1">
                      {faq.category}
                    </span>
                    <span className="font-semibold text-text-primary flex-1">
                      {faq.question}
                    </span>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-text-secondary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-secondary flex-shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-5 text-text-secondary border-t border-neutral-border pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Non hai trovato la risposta?
          </h2>
          <p className="text-text-secondary mb-6">
            Contattaci direttamente e ti risponderemo il prima possibile
          </p>
          <Link
            href="/contatti"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Contattaci
          </Link>
        </div>
      </section>

    </div>
  );
}
