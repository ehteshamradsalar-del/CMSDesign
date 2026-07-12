import "./Header.css";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header className="header">
            <div className="header-container">

                {/* Logo */}
                <Link to="/" className="logo">

                    {/* Logo sample */}
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

                    <NavLink to="/features">
                        Features
                    </NavLink>

                    <NavLink to="/solutions">
                        Solutions
                    </NavLink>

                    <NavLink to="/pricing">
                        Pricing
                    </NavLink>

                    <NavLink to="/about">
                        About
                    </NavLink>

                    <NavLink to="/contact">
                        Contact
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
                    >
                        ☰
                    </button>

                </div>

            </div>
        </header>
    );
}