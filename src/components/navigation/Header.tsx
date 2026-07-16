import "./Header.css";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useLang } from "../../lib/i18n";
import { Globe } from "lucide-react";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { lang, toggleLang, t } = useLang();

    return (
        <header className="header">

            <div className="header-container">

                {/* Logo */}
                <Link to="/" className="logo">

                    <div className="logo-mark">
                        A
                    </div>

                    <div className="logo-content">
                        <span className="logo-title">
                            {t('header.brand')}
                        </span>

                        <span className="logo-subtitle">
                            {t('header.subtitle')}
                        </span>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="nav">

                    <NavLink to="/#features">
                        {t('nav.features')}
                    </NavLink>

                    <NavLink to="/#comparison">
                        {t('nav.whyUs')}
                    </NavLink>

                    <NavLink to="/archive">
                        {t('nav.archive')}
                    </NavLink>

                </nav>

                {/* Right Side */}
                <div className="header-actions">

                    <button
                        className="lang-toggle"
                        onClick={toggleLang}
                        aria-label={lang === 'en' ? t('lang.toggle') : t('lang.toggle.en')}
                        title={lang === 'en' ? t('lang.toggle') : t('lang.toggle.en')}
                    >
                        <Globe size={16} strokeWidth={1.75} />
                        <span>{lang === 'en' ? 'فارسی' : 'English'}</span>
                    </button>

                    <Link
                        to="/login"
                        className="login-button"
                    >
                        {t('nav.login')}
                    </Link>

                    <Link
                        to="/signup"
                        className="primary-button"
                    >
                        {t('nav.startFree')}
                    </Link>

                    <button
                        className="menu-button"
                        aria-label={t('nav.openMenu')}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ☰
                    </button>

                </div>

            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="mobile-menu">

                    <NavLink
                        to="/#features"
                        onClick={() => setMenuOpen(false)}
                    >
                        {t('nav.features')}
                    </NavLink>

                    <NavLink
                        to="/#comparison"
                        onClick={() => setMenuOpen(false)}
                    >
                        {t('nav.whyUs')}
                    </NavLink>

                    <NavLink
                        to="/archive"
                        onClick={() => setMenuOpen(false)}
                    >
                        {t('nav.archive')}
                    </NavLink>

                    <div className="mobile-menu-divider"></div>

                    <button
                        className="mobile-menu-link"
                        onClick={() => {
                            toggleLang();
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'inherit', font: 'inherit', color: 'inherit', padding: '12px 0' }}
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <Globe size={16} strokeWidth={1.75} />
                            {lang === 'en' ? 'فارسی' : 'English'}
                        </span>
                    </button>

                    <div className="mobile-menu-divider"></div>

                    <Link
                        to="/login"
                        className="mobile-menu-link"
                        onClick={() => setMenuOpen(false)}
                    >
                        {t('nav.login')}
                    </Link>

                    <Link
                        to="/signup"
                        className="primary-button mobile-menu-cta"
                        onClick={() => setMenuOpen(false)}
                    >
                        {t('nav.startFree')}
                    </Link>

                </div>
            )}

        </header>
    );
}
