'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/app/lib/actions/auth-actions';

/**
 * LoginPage Component
 * 
 * The main login page component that renders a login form for ALX Polly.
 * This component handles user authentication by providing a form interface
 * where users can enter their email and password credentials.
 * 
 * Features:
 * - Form validation with required fields
 * - Loading state management during authentication
 * - Error handling and display for failed login attempts
 * - Responsive design with card-based UI
 * - Accessibility features with proper labels and autocomplete
 * 
 * @returns {JSX.Element} A login form wrapped in a card component
 */
export default function LoginPage() {
  // State to store and display authentication error messages to the user
  const [error, setError] = useState<string | null>(null);
  
  // State to track loading status during login process to prevent multiple submissions
  const [loading, setLoading] = useState(false);

  /**
   * Handles the login form submission event
   * 
   * This asynchronous function processes the login form data when a user submits
   * their credentials. It manages the authentication flow by:
   * 1. Preventing the default form submission behavior
   * 2. Setting loading state to provide user feedback
   * 3. Clearing any previous error messages
   * 4. Extracting email and password from form data
   * 5. Calling the login action with user credentials
   * 6. Handling authentication results and error states
   * 
   * The function ensures proper UX by maintaining loading states and
   * displaying appropriate error messages if authentication fails.
   * On successful login, the auth-actions login function handles redirection.
   * 
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event
   * @returns {Promise<void>} Resolves when authentication process completes
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent the default form submission behavior to handle authentication manually
    event.preventDefault();
    
    // Set loading state to show visual feedback and prevent multiple submissions
    setLoading(true);
    
    // Clear any existing error messages from previous login attempts
    setError(null);

    // Extract email and password from the form data using FormData API
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Call the server-side login action with user credentials
    const result = await login({ email, password });

    // Handle authentication failure by displaying error message and resetting loading state
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // Note: On successful login, the login action handles redirection automatically
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login to ALX Polly</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="your@email.com" 
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                required
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}