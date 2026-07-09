import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import ErrorBanner from '../components/ErrorBanner';
import GoogleButton from '../components/GoogleButton';
import { useAuth, parseApiError } from '../lib/auth';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        country: country.trim() || undefined,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }

  // TODO: backend does not yet support Google OAuth — this should eventually redirect to something like GET /api/auth/google
  function handleGoogleLogin() {
    setError('Google sign-in is not available yet. Please use email and password.');
  }

  return (
    <AuthLayout
      title="Create your archive"
      subtitle="Start organizing your practice by medium and collection."
      altText="Already have an account?"
      altLinkTo="/login"
      altLinkLabel="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorBanner message={error} />
        <div>
          <label htmlFor="name" className="field-label">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field-input"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field-input"
            placeholder="you@studio.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="field-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field-input"
            placeholder="At least 6 characters"
          />
        </div>
        <div>
          <label htmlFor="country" className="field-label">
            Country <span className="text-ink-400 normal-case">optional</span>
          </label>
          <input
            id="country"
            type="text"
            autoComplete="country-name"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="field-input"
            placeholder="e.g. Portugal"
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink-200" />
        <span className="text-[11px] uppercase tracking-widest text-ink-400">or</span>
        <div className="h-px flex-1 bg-ink-200" />
      </div>

      <GoogleButton onClick={handleGoogleLogin} />
    </AuthLayout>
  );
}
