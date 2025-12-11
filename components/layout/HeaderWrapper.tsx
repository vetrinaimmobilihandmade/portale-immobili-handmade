import { createClient } from '@/lib/supabase/server';
import HeaderClient from './HeaderClient';

export default async function HeaderWrapper() {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  console.log('🔍 HeaderWrapper - User:', user?.email);
  console.log('🔍 HeaderWrapper - User Error:', userError);
  
  let profile = null;
  if (user) {
    const { data, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    // ✅ FIX: Gestisce correttamente l'errore "profilo non trovato"
    if (profileError) {
      // PGRST116 = nessun risultato trovato (profilo non ancora creato)
      if (profileError.code !== 'PGRST116') {
        // Altri errori vanno loggati
        console.error('🔍 HeaderWrapper - Profile Error:', profileError);
      } else {
        console.log('🔍 HeaderWrapper - Profile not found yet (user just registered)');
      }
    }
    
    console.log('🔍 HeaderWrapper - Profile:', data);
    profile = data;
  }
  
  return <HeaderClient user={user} profile={profile} />;
}
