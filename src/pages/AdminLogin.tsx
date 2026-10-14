import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2Icon, LockIcon } from 'lucide-react';
import { Logo } from '../components/Logo';
import { ActionButton } from '../components/ActionButton';
import { FormField, inputClass } from '../components/FormField';
import { useAuth } from '../contexts/AuthContext';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signOut, verifyAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      const ok = await verifyAdmin();
      if (!ok) {
        await signOut();
        setError('This account does not have admin access.');
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-panel">
      <header className="flex h-14 items-center px-6">
        <Link to="/" aria-label="TACYE home"><Logo /></Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-20">
        <div className="w-full max-w-[380px] rounded-xl bg-white p-8 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white">
            <LockIcon className="h-4 w-4" />
          </div>
          <h1 className="mt-5 text-2xl font-medium tracking-tight">Admin Login</h1>
          <p className="mt-1 text-sm text-muted">Restricted to TACYE administrators.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            <FormField id="admin-email" label="Email">
              <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </FormField>
            <FormField id="admin-password" label="Password">
              <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
            </FormField>
            {error && <p role="alert" className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <ActionButton type="submit" variant="dark" fullWidth disabled={loading}>
              {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </ActionButton>
          </form>
        </div>
      </main>
    </div>);

}