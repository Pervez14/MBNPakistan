'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage('');

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Login failed. Please try again.');
      }

      const { data: application, error: applicationError } = await supabase
        .from('bureau_applications')
        .select('*')
        .eq('email', authData.user.email)
        .single();

      if (applicationError || !application) {
        await supabase.auth.signOut();
        throw new Error(
          'No bureau application found for this email. Please apply for membership first.'
        );
      }

      if (application.status !== 'approved') {
        await supabase.auth.signOut();

        if (application.status === 'pending') {
          throw new Error(
            'Your application is still pending approval. Please wait for admin approval.'
          );
        }

        if (application.status === 'rejected') {
          throw new Error(
            'Your application was not approved. Please contact MBN Pakistan support.'
          );
        }

        throw new Error('Your account is not approved yet.');
      }

      localStorage.setItem(
        'mbn-auth',
        JSON.stringify({
          state: {
            user: {
              id: authData.user.id,
              fullName: application.full_name,
              businessName: application.business_name,
              email: application.email,
              role: 'BUREAU_OWNER',
              accountStatus: 'APPROVED',
              subscriptionStatus: 'ACTIVE',
              badges: ['VERIFIED'],
            },
            accessToken: authData.session?.access_token,
            isAuthenticated: true,
            isAdmin: false,
          },
          version: 0,
        })
      );

      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.';

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/mbn-logo.png"
              alt="MBN Pakistan"
              className="h-24 w-auto object-contain"
            />
          </div>

          <h1 className="font-heading text-3xl font-bold text-slate-900">
            Login to Platform
          </h1>

          <p className="text-slate-500 mt-1 text-sm">
            Marriage Bureau Network Pakistan
          </p>
        </div>

        <div className="card p-8">
          {errorMessage && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@bureau.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Not approved yet?{' '}
            <Link
              href="/register"
              className="text-green-700 font-medium hover:underline"
            >
              Apply for membership
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
