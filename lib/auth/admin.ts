import { createClient } from '@/lib/supabase/server';

/**
 * Check if a user has admin privileges
 * This should be validated against a proper user roles system in production
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();
  
  try {
    // First, get the user's profile to check role
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    // Check if user has admin role
    if (profile?.role === 'admin') {
      return true;
    }
    
    // Fallback: check against admin users table if profile doesn't exist
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();
    
    if (adminError && adminError.code !== 'PGRST116') {
      console.error('Error checking admin users table:', adminError);
      return false;
    }
    
    return !!adminUser;
  } catch (error) {
    console.error('Unexpected error in admin check:', error);
    return false;
  }
}

/**
 * Check if current authenticated user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return false;
  }
  
  return isUserAdmin(user.id);
}

/**
 * Middleware function to protect admin routes
 */
export async function requireAdmin() {
  const isAdmin = await isCurrentUserAdmin();
  
  if (!isAdmin) {
    throw new Error('Access denied. Admin privileges required.');
  }
  
  return true;
}

