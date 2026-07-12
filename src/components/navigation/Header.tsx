import "./Header.css";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

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
                            ArtCMS
                        </span>

                        <span className="logo-subtitle">
                            AI Collection Platform
                        </span>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="nav">

                    <NavLink to="/#features">
                        Features
                    </NavLink>

                    <NavLink to="/#comparison">
                        Why Us
                    </NavLink>

                    <NavLink to="/#archive">
                        Archive
                    </NavLink>

                </nav>

                {/* Right Side */}
                <div className="header-actions">

                    <Link
                        to="/login"
                        className="login-button"
                    >
                        Log in
                    </Link>

                    <Link
                        to="/signup"
                        className="primary-button"
                    >
                        Start Free
                    </Link>

                    <button
                        className="menu-button"
                        aria-label="Open menu"
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
                        Features
                    </NavLink>

                    <NavLink
                        to="/#comparison"
                        onClick={() => setMenuOpen(false)}
                    >
                        Why Us
                    </NavLink>

                    <NavLink
                        to="/#archive"
                        onClick={() => setMenuOpen(false)}
                    >
                        Archive
                    </NavLink>

                    <div className="mobile-menu-divider"></div>

                    <Link
                        to="/login"
                        className="mobile-menu-link"
                        onClick={() => setMenuOpen(false)}
                    >
                        Log in
                    </Link>

                    <Link
                        to="/signup"
                        className="primary-button mobile-menu-cta"
                        onClick={() => setMenuOpen(false)}
                    >
                        Start Free
                    </Link>

                </div>
            )}

        </header>
    );
}
