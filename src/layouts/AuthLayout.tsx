import { Link } from 'react-router-dom';
import { Archive } from 'lucide-react';
import { useLang } from '../lib/i18n';

interface Props {
  title: string;
  subtitle: string;
  altText: string;
  altLinkTo: string;
  altLinkLabel: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  altText,
  altLinkTo,
  altLinkLabel,
  children,
}: Props) {
  const { t } = useLang();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left — editorial panel */}
      <div className="relative hidden flex-1 overflow-hidden bg-brand-forest lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 20%, #BF8E40 0, transparent 45%), radial-gradient(circle at 80% 75%, #BF8E40 0, transparent 40%)',
          }}
        />
        <div className="relative z-10 flex items-center gap-2.5 px-12 py-10 text-white">
          <Archive className="h-5 w-5 text-brand-gold" />
          <span className="font-serif text-xl tracking-tight">{t('sidebar.brand')}</span>
        </div>
        <div className="relative z-10 px-12 pb-16">
          <p className="max-w-md font-serif text-3xl leading-snug text-white text-balance">
            {t('footer.tagline')}
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
            {t('features.1.desc')}
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Archive className="h-5 w-5 text-brand-forest" />
            <span className="font-serif text-xl tracking-tight text-ink-900">{t('sidebar.brand')}</span>
          </div>
          <h1 className="font-serif text-3xl text-ink-900">{title}</h1>
          <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-ink-500">
            {altText}{' '}
            <Link to={altLinkTo} className="font-medium text-brand-gold-dark underline-offset-4 hover:underline">
              {altLinkLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
