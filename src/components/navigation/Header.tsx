import "./Header.css";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header className="header">
            {/* Left */}
            <Link to="/" className="logo">
                {/* Replace with your logo image if desired */}
                <span className="logo-text">Salar Ehtesham Rad</span>
            </Link>

            {/* Center */}
            <nav className="nav">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/portfolio"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    Portfolio
                </NavLink>

                <NavLink
                    to="/artworks/new"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    New Artwork
                </NavLink>

                <NavLink
                    to="/about"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    About
                </NavLink>

                <NavLink
                    to="/contact"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    Contact
                </NavLink>
            </nav>

            {/* Right */}
            <div className="header-right">
                <button className="login-btn">
                    Login
                </button>

                <button className="menu-btn" aria-label="Open navigation">
                    ☰
                </button>
            </div>
        </header>
    );
}