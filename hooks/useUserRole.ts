import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export type UserRole = 'viewer' | 'inserzionista' | 'editor' | 'admin';

interface UserRoleData {
  role: UserRole | null;
  userId: string | null;
  loading: boolean;
  error: string | null;
  isViewer: boolean;
  isInserzionista: boolean;
  isEditor: boolean;
  isAdmin: boolean;
  canPublishListings: boolean;
  canModerate: boolean;
}

export function useUserRole(): UserRoleData {
  const [role, setRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadUserRole();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      loadUserRole();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadUserRole = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setRole(null);
        setUserId(null);
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setRole(profile.role as UserRole);
    } catch (err: any) {
      console.error('Error loading user role:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    role,
    userId,
    loading,
    error,
    isViewer: role === 'viewer',
    isInserzionista: role === 'inserzionista',
    isEditor: role === 'editor',
    isAdmin: role === 'admin',
    canPublishListings: ['inserzionista', 'editor', 'admin'].includes(role || ''),
    canModerate: ['editor', 'admin'].includes(role || ''),
  };
}
