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
    
    console.log('🔍 HeaderWrapper - Profile:', data);
    console.log('🔍 HeaderWrapper - Profile Error:', profileError);
    
    profile = data;
  }
  
  return <HeaderClient user={user} profile={profile} />;
}
