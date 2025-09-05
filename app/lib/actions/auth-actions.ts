'use server';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { LoginFormData, RegisterFormData } from '../types';

/**
 * Authenticates a user with email and password using Supabase Auth
 * Redirects to polls page on successful login
 * @param data - Object containing email and password
 * @returns Error object if authentication fails
 */
export async function login(data: LoginFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/polls');
}

/**
 * Creates a new user account with email, password, and name
 * Sends email verification if configured in Supabase
 * @param data - Object containing email, password, and name
 * @returns Error object if registration fails, null error on success
 */
export async function register(data: RegisterFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Success: no error
  return { error: null };
}

/**
 * Signs out the current user from their session
 * Clears authentication tokens and session data
 * @returns Error object if logout fails, null error on success
 */
export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

/**
 * Retrieves the currently authenticated user's profile data
 * Used to check authentication status and get user info
 * @returns User object if authenticated, null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/**
 * Retrieves the current user's session information
 * Contains authentication tokens and session metadata
 * @returns Session object if authenticated, null if no active session
 */
export async function getSession() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}
