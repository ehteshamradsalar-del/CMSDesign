import { Link } from 'react-router-dom';
import { useLang } from '../../lib/i18n';
import './Footer.css';

export default function Footer() {
    const { t } = useLang();
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <span className="footer-logo">{t('footer.brand')}</span>
                    <p>
                        {t('footer.tagline')}
                    </p>
                </div>

                <nav className="footer-links">
                    <Link to="/login">{t('footer.login')}</Link>
                    <Link to="/signup">{t('footer.signup')}</Link>
                    <Link to="/archive">{t('footer.archive')}</Link>
                </nav>
            </div>

            <div className="footer-bottom">
                <span>&copy; {year} {t('footer.brand')}. {t('footer.rights')}</span>
            </div>
        </footer>
    );
}
