import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2Icon, EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '../components/Header';
import { ActionButton } from '../components/ActionButton';
import { FormField, inputClass } from '../components/FormField';
import { useAuth } from '../contexts/AuthContext';
import { usStates } from '../data/usStates';
import { flushPendingCart } from '../utils/orders';

type FormState = {
  full_name: string;
  email: string;
  phone: string;
  delivery_address: string;
  state: string;
  zipcode: string;
  password: string;
};

const emptyForm: FormState = { full_name: '', email: '', phone: '', delivery_address: '', state: '', zipcode: '', password: '' };

export function CreateAccount() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
  setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setSubmitError('');
    if (Object.keys(found).length) return;
    setLoading(true);
    try {
      const { needsConfirmation, user: newUser } = await signUp({
        ...form,
        full_name: form.full_name.trim(),
        email: form.email.trim()
      });
      if (needsConfirmation) {
        setConfirmEmail(form.email.trim());
      } else {
        toast.success('Account created', { description: `Welcome to TACYE, ${form.full_name.split(' ')[0]}.` });
        const added = newUser ? await flushPendingCart(newUser.id) : false;
        navigate(added ? '/cart' : redirect === '/' ? '/dashboard' : redirect);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  if (confirmEmail) {
    return (
      <div className="min-h-screen w-full bg-white">
        <Header />
        <main className="mx-auto flex max-w-[420px] flex-col items-center px-6 pt-36 text-center">
          <CheckCircle2Icon className="h-10 w-10 text-brand" strokeWidth={1.5} />
          <h1 className="mt-4 text-3xl font-medium tracking-tight">Account created</h1>
          <p className="mt-3 text-sm text-muted">
            We sent a confirmation link to <span className="font-medium text-ink">{confirmEmail}</span>. Confirm your email, then sign in to continue.
          </p>
          <ActionButton to={`/signin${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} variant="primary" fullWidth className="mt-8">
            Go to Sign In
          </ActionButton>
        </main>
      </div>);

  }

  return (
    <div className="min-h-screen w-full bg-white">
      <Header />
      <main className="mx-auto max-w-[460px] px-6 pb-20 pt-28">
        <h1 className="text-[40px] font-medium tracking-tight text-ink">Create Account</h1>
        <p className="mt-2 text-sm text-muted">Your details are used for orders and vehicle delivery.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <FormField id="full_name" label="Name" error={errors.full_name}>
            <input id="full_name" autoComplete="name" value={form.full_name} onChange={update('full_name')} className={inputClass} />
          </FormField>
          <FormField id="email" label="Email" error={errors.email}>
            <input id="email" type="email" autoComplete="email" value={form.email} onChange={update('email')} className={inputClass} />
          </FormField>
          <FormField id="phone" label="Tel" error={errors.phone}>
            <input id="phone" type="tel" autoComplete="tel" placeholder="(555) 123-4567" value={form.phone} onChange={update('phone')} className={inputClass} />
          </FormField>
          <FormField id="delivery_address" label="Delivery Address" error={errors.delivery_address}>
            <input id="delivery_address" autoComplete="street-address" value={form.delivery_address} onChange={update('delivery_address')} className={inputClass} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField id="state" label="State" error={errors.state}>
              <select id="state" value={form.state} onChange={update('state')} className={inputClass}>
                <option value="">Select</option>
                {usStates.map((s) =>
                <option key={s} value={s}>{s}</option>
                )}
              </select>
            </FormField>
            <FormField id="zipcode" label="Zipcode" error={errors.zipcode}>
              <input id="zipcode" inputMode="numeric" autoComplete="postal-code" value={form.zipcode} onChange={update('zipcode')} className={inputClass} />
            </FormField>
          </div>
          <FormField id="password" label="Password" error={errors.password}>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.password}
                onChange={update('password')}
                className={`${inputClass} pr-10`} />
              
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink">
                
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
            {!errors.password && <p className="mt-1 text-xs text-muted">At least 8 characters.</p>}
          </FormField>

          {submitError && <p role="alert" className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>}

          <ActionButton type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : 'Create Account'}
          </ActionButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-ink underline underline-offset-4">Sign In</Link>
        </p>
      </main>
    </div>);

}

function validate(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (form.full_name.trim().length < 2) errors.full_name = 'Enter your full name.';
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Enter a valid email.';
  if (form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a valid phone number.';
  if (form.delivery_address.trim().length < 5) errors.delivery_address = 'Enter your delivery address.';
  if (!form.state) errors.state = 'Select a state.';
  if (!/^\d{5}(-\d{4})?$/.test(form.zipcode.trim())) errors.zipcode = 'Enter a 5-digit zip.';
  if (form.password.length < 8) errors.password = 'Use at least 8 characters.';
  return errors;
}