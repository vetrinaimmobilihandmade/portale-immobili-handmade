'use client';

import { useState, useRef } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import emailjs from '@emailjs/browser';

export default function ContattiPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.from_name.trim()) newErrors.from_name = 'Nome richiesto';
    if (!formData.from_email.trim()) {
      newErrors.from_email = 'Email richiesta';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.from_email)) {
      newErrors.from_email = 'Email non valida';
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
    setError('');
    setSuccess(false);
    
    try {
      // Invia tramite EmailJS
      const result = await emailjs.sendForm(
        'service_50mzsnl',      // Service ID
        'template_czvb3oo',     // Template ID
        formRef.current!,       // Form reference
        'h-knalD_Ehvq4cVG7'     // Public Key
      );

      if (result.status === 200) {
        setSuccess(true);
        setFormData({ from_name: '', from_email: '', subject: '', message: '' });
        
        // Nascondi messaggio successo dopo 7 secondi
        setTimeout(() => setSuccess(false), 7000);
      }
      
    } catch (err: any) {
      console.error('EmailJS Error:', err);
      setError('Errore durante l\'invio del messaggio. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
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

      {/* Contact Form - Full Width */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Inviaci un Messaggio
          </h2>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  ✅ Messaggio inviato con successo!
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Ti risponderemo al più presto all'indirizzo email fornito.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Nome *"
                name="from_name"
                placeholder="Mario Rossi"
                value={formData.from_name}
                onChange={(e) => handleChange('from_name', e.target.value)}
                error={errors.from_name}
                required
              />

              <Input
                label="Email *"
                name="from_email"
                type="email"
                placeholder="mario.rossi@email.com"
                value={formData.from_email}
                onChange={(e) => handleChange('from_email', e.target.value)}
                error={errors.from_email}
                required
              />
            </div>

            <Input
              label="Oggetto *"
              name="subject"
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
                name="message"
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
              disabled={loading}
            >
              <Send className="w-5 h-5 mr-2" />
              {loading ? 'Invio in corso...' : 'Invia Messaggio'}
            </Button>

            <p className="text-xs text-text-secondary text-center">
              Rispondiamo generalmente entro 24 ore nei giorni lavorativi
            </p>
          </form>
        </div>

        {/* Info aggiuntive sotto il form */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-primary-lighter rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Email</h3>
            <p className="text-sm text-text-secondary">Via form</p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Risposta</h3>
            <p className="text-sm text-text-secondary">Entro 24 ore</p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Supporto</h3>
            <p className="text-sm text-text-secondary">7 giorni su 7</p>
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
