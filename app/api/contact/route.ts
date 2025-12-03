import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      listingType,
      listingTitle,
      listingUrl,
      sellerEmail,
      sellerName,
      buyerName,
      buyerEmail,
      buyerPhone,
      message,
    } = body;

    // Validazione
    if (!sellerEmail || !buyerEmail || !buyerName || !message) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti' },
        { status: 400 }
      );
    }

    const listingTypeLabel = listingType === 'property' ? 'Immobile' : 'Prodotto Handmade';

    // Email HTML all'inserzionista
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .listing-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .buyer-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            h1 { margin: 0; font-size: 24px; }
            h2 { color: #667eea; margin-top: 0; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #4b5563; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 Nuovo Contatto!</h1>
              <p style="margin: 10px 0 0 0;">Hai ricevuto un messaggio per il tuo annuncio</p>
            </div>
            
            <div class="content">
              <div class="listing-info">
                <h2>📋 Annuncio</h2>
                <div class="info-row">
                  <span class="label">Tipo:</span> ${listingTypeLabel}
                </div>
                <div class="info-row">
                  <span class="label">Titolo:</span> ${listingTitle}
                </div>
                <div class="info-row">
                  <a href="${listingUrl}" class="button" style="color: white;">Visualizza Annuncio</a>
                </div>
              </div>

              <div class="buyer-info">
                <h2>👤 Chi ti ha contattato</h2>
                <div class="info-row">
                  <span class="label">Nome:</span> ${buyerName}
                </div>
                <div class="info-row">
                  <span class="label">Email:</span> <a href="mailto:${buyerEmail}">${buyerEmail}</a>
                </div>
                ${buyerPhone ? `
                  <div class="info-row">
                    <span class="label">Telefono:</span> <a href="tel:${buyerPhone}">${buyerPhone}</a>
                  </div>
                ` : ''}
              </div>

              <div class="message-box">
                <h2>💬 Messaggio</h2>
                <p style="white-space: pre-line;">${message}</p>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${buyerEmail}?subject=Re: ${encodeURIComponent(listingTitle)}" class="button" style="color: white;">
                  Rispondi via Email
                </a>
              </div>
            </div>

            <div class="footer">
              <p>Questo messaggio è stato inviato tramite Portale Immobili & Handmade</p>
              <p>Non rispondere a questa email, usa il pulsante "Rispondi via Email" sopra</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Invia email con Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [sellerEmail],
      reply_to: buyerEmail,
      subject: `Nuovo contatto per: ${listingTitle}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Errore nell\'invio dell\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Errore del server' },
      { status: 500 }
    );
  }
}
