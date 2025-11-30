'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ContattiPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome richiesto';
    if (!formData.email.trim()) {
      newErrors.email = 'Email richiesta';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Oggetto richiesto';
    if (!formData.message.trim()) {
      newErrors.message = 'Messaggio richiesto';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Il messaggio deve essere di almeno 10 caratteri';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    
    // Simulazione invio email (sostituisci con la tua API)
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Nascondi il messaggio di successo dopo 5 secondi
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-main">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Mail className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contattaci
          </h1>
          <p className="text-xl text-blue-100">
            Siamo qui per aiutarti. Inviaci un messaggio e ti risponderemo al più presto
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Info Card 1 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="w-12 h-12 bg-primary-lighter rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Email</h3>
              <a 
                href="mailto:info@portaleimmobili.it" 
                className="text-primary hover:underline"
              >
                info@portaleimmobili.it
              </a>
              <p className="text-sm text-text-secondary mt-2">
                Rispondiamo entro 24 ore
              </p>
            </div>

            {/* Info Card 2 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Telefono</h3>
              <a 
                href="tel:+393471234567" 
                className="text-primary hover:underline"
              >
                +39 347 123 4567
              </a>
              <p className="text-sm text-text-secondary mt-2">
                Lun-Ven 9:00-18:00
              </p>
            </div>

            {/* Info Card 3 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Sede</h3>
              <p className="text-text-secondary">
                Via Roma 123<br />
                00100 Roma, Italia
              </p>
            </div>

            {/* Info Card 4 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Orari</h3>
              <div className="text-sm text-text-secondary space-y-1">
                <p>Lunedì - Venerdì: 9:00 - 18:00</p>
                <p>Sabato: 9:00 - 13:00</p>
                <p>Domenica: Chiuso</p>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Inviaci un Messaggio
              </h2>

              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Messaggio inviato con successo!
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Ti risponderemo al più presto all'indirizzo email fornito.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Nome"
                    placeholder="Mario Rossi"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={errors.name}
                    required
                  />

                  <Input
                    label="Email"
                    type="email"
                    placeholder="mario.rossi@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                    required
                  />
                </div>

                <Input
                  label="Oggetto"
                  placeholder="Di cosa hai bisogno?"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  error={errors.subject}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Messaggio *
                  </label>
                  <textarea
                    placeholder="Scrivi qui il tuo messaggio..."
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                      errors.message ? 'border-red-500' : 'border-neutral-border'
                    }`}
                    required
                  />
                  {errors.message && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.message}
                    </p>
                  )}
                  <p className="text-xs text-text-secondary mt-1">
                    Minimo 10 caratteri
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={loading}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Invia Messaggio
                </Button>

                <p className="text-xs text-text-secondary text-center">
                  Rispondiamo generalmente entro 24 ore nei giorni lavorativi
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* FAQ Link */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-text-primary mb-3">
            Hai una domanda frequente?
          </h3>
          <p className="text-text-secondary mb-6">
            Controlla le nostre FAQ, potresti trovare subito la risposta che cerchi
          </p>
          <a
            href="/faq"
            className="inline-block bg-neutral-main text-text-primary px-6 py-3 rounded-lg hover:bg-neutral-hover transition-colors font-medium"
          >
            Vai alle FAQ
          </a>
        </div>
      </section>

    </div>
  );
}
