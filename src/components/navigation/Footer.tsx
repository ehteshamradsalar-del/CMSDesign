import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <span className="footer-logo">Archive</span>
                    <p>
                        A structured home for your work \u2014 owned by you, searchable by
                        everyone you choose.
                    </p>
                </div>

                <nav className="footer-links">
                    <Link to="/login">Log in</Link>
                    <Link to="/signup">Sign up</Link>
                </nav>

                {/* Terms of Service and Privacy Policy links belong here once
                    those pages actually exist \u2014 see Risks & Open Questions. */}
            </div>

            <div className="footer-bottom">
                <span>&copy; {year} Archive. All rights reserved.</span>
            </div>
        </footer>
    );
}