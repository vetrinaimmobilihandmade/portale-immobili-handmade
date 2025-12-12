import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('🔵 Callback route chiamata');
  
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';
  
  console.log('🔵 Code ricevuto:', code ? 'SI' : 'NO');
  console.log('🔵 URL completo:', requestUrl.toString());

  if (code) {
    try {
      const cookieStore = await cookies();
      
      // Array per memorizzare i cookie da settare
      const cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }> = [];

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              // Memorizza invece di settare direttamente
              cookiesToSet.push({ name, value, options });
            },
            remove(name: string, options: CookieOptions) {
              // Memorizza la rimozione
              cookiesToSet.push({ name, value: '', options });
            },
          },
        }
      );

      console.log('🔵 Tentativo exchangeCodeForSession...');
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log('🔵 Risultato exchange:', { 
        hasData: !!data, 
        error: error?.message 
      });

      if (error) {
        console.error('❌ Errore exchangeCodeForSession:', error);
        return NextResponse.redirect(
          new URL(`/auth/login?error=${error.message}`, requestUrl.origin)
        );
      }

      console.log('✅ Sessione creata, redirect a:', next);
      
      // Crea la response con redirect
      const response = NextResponse.redirect(new URL(next, requestUrl.origin));
      
      // Setta tutti i cookie nella response
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });

      return response;
      
    } catch (err: any) {
      console.error('❌ Errore catch callback:', err);
      return NextResponse.redirect(
        new URL(`/auth/login?error=callback_error`, requestUrl.origin)
      );
    }
  }

  console.log('❌ Nessun code trovato');
  return NextResponse.redirect(
    new URL('/auth/login?error=no_code', requestUrl.origin)
  );
}
