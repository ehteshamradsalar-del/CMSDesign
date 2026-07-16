import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { useLang } from '../../lib/i18n';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { t } = useLang();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <div className="text-[11px] uppercase tracking-widest text-ink-400">{t('protected.loading')}</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
