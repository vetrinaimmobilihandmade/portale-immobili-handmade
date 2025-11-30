import { Shield, Eye, Lock, Users, Database, AlertTriangle } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-main">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-blue-100">
            La tua privacy è importante per noi
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
            La presente Privacy Policy descrive come Portale Immobili & Handmade ("noi", "nostro/a") raccoglie, 
            utilizza e protegge le informazioni personali degli utenti ("tu", "tuo/a") che utilizzano il nostro 
            portale web (il "Servizio").
          </p>
          <p className="text-text-secondary">
            Utilizzando il nostro Servizio, accetti la raccolta e l'utilizzo delle informazioni in conformità 
            con questa policy. Se non sei d'accordo con i termini di questa Privacy Policy, ti preghiamo di 
            non utilizzare il nostro Servizio.
          </p>
        </div>

        {/* Section 1 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                1. Informazioni che Raccogliamo
              </h2>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-text-primary mb-3 mt-6">
            1.1 Informazioni Fornite Direttamente
          </h3>
          <p className="text-text-secondary mb-3">
            Quando ti registri sul nostro portale, raccogliamo:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
            <li>Nome e cognome</li>
            <li>Indirizzo email</li>
            <li>Numero di telefono</li>
            <li>Informazioni del profilo (bio, foto profilo)</li>
            <li>Contenuto degli annunci pubblicati</li>
          </ul>

          <h3 className="text-lg font-semibold text-text-primary mb-3 mt-6">
            1.2 Informazioni Raccolte Automaticamente
          </h3>
          <p className="text-text-secondary mb-3">
            Durante l'utilizzo del Servizio, raccogliamo automaticamente:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>Indirizzo IP</li>
            <li>Tipo di browser e sistema operativo</li>
            <li>Pagine visitate e durata della visita</li>
            <li>Data e ora di accesso</li>
            <li>Cookie e tecnologie simili</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                2. Come Utilizziamo le Tue Informazioni
              </h2>
            </div>
          </div>
          
          <p className="text-text-secondary mb-3">
            Utilizziamo le informazioni raccolte per:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>Fornire e gestire il Servizio</li>
            <li>Creare e gestire il tuo account</li>
            <li>Pubblicare i tuoi annunci</li>
            <li>Facilitare la comunicazione tra utenti</li>
            <li>Inviare notifiche relative al Servizio</li>
            <li>Migliorare l'esperienza utente</li>
            <li>Prevenire frodi e attività illegali</li>
            <li>Rispettare obblighi legali</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                3. Condivisione delle Informazioni
              </h2>
            </div>
          </div>
          
          <p className="text-text-secondary mb-3">
            Non vendiamo le tue informazioni personali a terzi. Possiamo condividere le tue informazioni nei seguenti casi:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li><strong>Con altri utenti:</strong> Informazioni del profilo e annunci sono visibili pubblicamente</li>
            <li><strong>Fornitori di servizi:</strong> Per hosting, analytics e servizi email</li>
            <li><strong>Obblighi legali:</strong> Se richiesto dalla legge o per proteggere i nostri diritti</li>
            <li><strong>Trasferimento di proprietà:</strong> In caso di fusione, acquisizione o vendita di asset</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                4. Sicurezza dei Dati
              </h2>
            </div>
          </div>
          
          <p className="text-text-secondary mb-3">
            Prendiamo sul serio la sicurezza delle tue informazioni e implementiamo misure tecniche e 
            organizzative appropriate, tra cui:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>Crittografia SSL/TLS per le comunicazioni</li>
            <li>Password crittografate</li>
            <li>Accesso limitato ai dati personali</li>
            <li>Monitoraggio regolare della sicurezza</li>
            <li>Backup regolari dei dati</li>
          </ul>
          <p className="text-text-secondary mt-4">
            Tuttavia, nessun metodo di trasmissione su Internet è completamente sicuro. Non possiamo 
            garantire la sicurezza assoluta delle informazioni trasmesse attraverso il nostro Servizio.
          </p>
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            5. I Tuoi Diritti
          </h2>
          
          <p className="text-text-secondary mb-3">
            In conformità con il GDPR, hai i seguenti diritti:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li><strong>Diritto di accesso:</strong> Puoi richiedere una copia dei tuoi dati personali</li>
            <li><strong>Diritto di rettifica:</strong> Puoi correggere dati inesatti o incompleti</li>
            <li><strong>Diritto alla cancellazione:</strong> Puoi richiedere la cancellazione dei tuoi dati</li>
            <li><strong>Diritto di limitazione:</strong> Puoi limitare il trattamento dei tuoi dati</li>
            <li><strong>Diritto di portabilità:</strong> Puoi ricevere i tuoi dati in formato strutturato</li>
            <li><strong>Diritto di opposizione:</strong> Puoi opporti al trattamento dei tuoi dati</li>
          </ul>
          <p className="text-text-secondary mt-4">
            Per esercitare questi diritti, contattaci all'indirizzo: <a href="mailto:privacy@portaleimmobili.it" className="text-primary hover:underline">privacy@portaleimmobili.it</a>
          </p>
        </div>

        {/* Section 6 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            6. Cookie
          </h2>
          
          <p className="text-text-secondary mb-3">
            Utilizziamo cookie e tecnologie simili per migliorare la tua esperienza sul nostro sito. 
            I cookie sono piccoli file di testo memorizzati sul tuo dispositivo.
          </p>
          <p className="text-text-secondary mb-3">
            Utilizziamo:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li><strong>Cookie essenziali:</strong> Necessari per il funzionamento del sito</li>
            <li><strong>Cookie di funzionalità:</strong> Per ricordare le tue preferenze</li>
            <li><strong>Cookie analitici:</strong> Per comprendere come usi il sito</li>
          </ul>
          <p className="text-text-secondary mt-4">
            Puoi gestire le preferenze sui cookie attraverso le impostazioni del tuo browser. 
            Per maggiori informazioni, consulta la nostra <a href="/cookie" className="text-primary hover:underline">Cookie Policy</a>.
          </p>
        </div>

        {/* Section 7 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            7. Conservazione dei Dati
          </h2>
          
          <p className="text-text-secondary">
            Conserviamo le tue informazioni personali solo per il tempo necessario a soddisfare le finalità 
            descritte in questa Privacy Policy, a meno che un periodo di conservazione più lungo non sia 
            richiesto o consentito dalla legge. Quando elimini il tuo account, cancelleremo o anonimizzeremo 
            le tue informazioni personali, a meno che non siamo tenuti a conservarle per obblighi legali.
          </p>
        </div>

        {/* Section 8 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            8. Minori
          </h2>
          
          <p className="text-text-secondary">
            Il nostro Servizio non è destinato a persone di età inferiore ai 18 anni. Non raccogliamo 
            consapevolmente informazioni personali da minori. Se sei un genitore o tutore e sei a 
            conoscenza che tuo figlio ci ha fornito informazioni personali, ti preghiamo di contattarci 
            immediatamente.
          </p>
        </div>

        {/* Section 9 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            9. Modifiche alla Privacy Policy
          </h2>
          
          <p className="text-text-secondary">
            Potremmo aggiornare questa Privacy Policy periodicamente. Ti avviseremo di eventuali modifiche 
            pubblicando la nuova Privacy Policy su questa pagina e aggiornando la data di "Ultimo aggiornamento". 
            Ti consigliamo di rivedere periodicamente questa Privacy Policy per eventuali modifiche.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">
            10. Contattaci
          </h2>
          <p className="mb-4">
            Per domande o dubbi riguardanti questa Privacy Policy, puoi contattarci:
          </p>
          <div className="space-y-2">
            <p><strong>Email:</strong> <a href="mailto:privacy@portaleimmobili.it" className="underline">privacy@portaleimmobili.it</a></p>
            <p><strong>Telefono:</strong> +39 347 123 4567</p>
            <p><strong>Indirizzo:</strong> Via Roma 123, 00100 Roma, Italia</p>
          </div>
        </div>

      </div>
    </div>
  );
}
