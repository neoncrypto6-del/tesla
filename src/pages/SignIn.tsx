import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '../components/Header';
import { ActionButton } from '../components/ActionButton';
import { FormField, inputClass } from '../components/FormField';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { flushPendingCart } from '../utils/orders';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const signedIn = await signIn(email.trim(), password);
      const added = await flushPendingCart(signedIn.id);
      if (added) {
        toast.success('Vehicle added to your cart');
        navigate('/cart');
      } else {
        toast.success('Welcome back');
        navigate(redirect === '/' ? '/dashboard' : redirect);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      setError('Enter your email above to reset your password.');
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (resetError) setError(resetError.message);else
    toast.success('Reset link sent', { description: `Check ${email} for instructions.` });
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <Header />
      <main className="mx-auto flex max-w-[360px] flex-col px-6 pb-20 pt-32">
        <h1 className="text-[40px] font-medium tracking-tight text-ink">Sign In</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <FormField id="email" label="Email">
            <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </FormField>
          <FormField id="password" label="Password">
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-10`} />
              
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink">
                
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
          </FormField>

          {error && <p role="alert" className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <ActionButton type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : 'Sign In'}
          </ActionButton>
        </form>

        <button onClick={handleForgot} className="mt-4 self-center text-sm text-muted underline underline-offset-4 hover:text-ink">
          Forgot email or password?
        </button>

        <div className="my-8 flex items-center gap-4 text-sm text-muted">
          <span className="h-px flex-1 bg-line" />
          Or
          <span className="h-px flex-1 bg-line" />
        </div>

        <ActionButton to={`/create-account${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} variant="secondary" fullWidth className="bg-panel">
          Create Account
        </ActionButton>

        <p className="mt-10 text-center text-xs text-muted">
          <Link to="/" className="underline underline-offset-4 hover:text-ink">Back to home</Link>
        </p>
      </main>
    </div>);

}