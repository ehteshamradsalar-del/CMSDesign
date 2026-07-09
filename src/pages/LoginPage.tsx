import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import ErrorBanner from '../components/common/ErrorBanner';
import GoogleButton from '../components/common/GoogleButton';
import { useAuth, parseApiError } from '../lib/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
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
      title="Welcome back"
      subtitle="Sign in to manage your archive."
      altText="New to Archive?"
      altLinkTo="/signup"
      altLinkLabel="Create an account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorBanner message={error} />
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field-input"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
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
