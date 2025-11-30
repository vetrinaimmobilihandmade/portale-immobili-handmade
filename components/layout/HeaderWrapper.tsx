import { createClient } from '@/lib/supabase/server';
import HeaderClient from './HeaderClient';

export default async function HeaderWrapper() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return <HeaderClient user={user} profile={profile} />;
}
