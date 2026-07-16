import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import ErrorBanner from '../components/common/ErrorBanner';
import GoogleButton from '../components/common/GoogleButton';
import { useAuth, parseApiError } from '../lib/auth';
import { useLang } from '../lib/i18n';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { t } = useLang();

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
      setError(t('auth.passwordTooShort'));
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

  function handleGoogleLogin() {
    setError(t('auth.googleError'));
  }

  return (
    <AuthLayout
      title={t('auth.createArchive')}
      subtitle={t('auth.signupSubtitle')}
      altText={t('auth.alreadyHave')}
      altLinkTo="/login"
      altLinkLabel={t('auth.signIn')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorBanner message={error} />
        <div>
          <label htmlFor="name" className="field-label">
            {t('auth.name')}
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field-input"
            placeholder={t('auth.namePlaceholder')}
          />
        </div>
        <div>
          <label htmlFor="email" className="field-label">
            {t('auth.email')}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field-input"
            placeholder={t('auth.emailPlaceholder')}
          />
        </div>
        <div>
          <label htmlFor="password" className="field-label">
            {t('auth.password')}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field-input"
            placeholder={t('auth.passwordNewPlaceholder')}
          />
        </div>
        <div>
          <label htmlFor="country" className="field-label">
            {t('auth.country')} <span className="text-ink-400 normal-case">{t('auth.optional')}</span>
          </label>
          <input
            id="country"
            type="text"
            autoComplete="country-name"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="field-input"
            placeholder={t('auth.countryPlaceholder')}
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? t('auth.creatingAccount') : t('auth.createBtn')}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink-200" />
        <span className="text-[11px] uppercase tracking-widest text-ink-400">{t('auth.or')}</span>
        <div className="h-px flex-1 bg-ink-200" />
      </div>

      <GoogleButton onClick={handleGoogleLogin} />
    </AuthLayout>
  );
}
