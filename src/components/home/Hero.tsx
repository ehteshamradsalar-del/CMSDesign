import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const navigate = useNavigate();

    return (
        <section className="hero">

            <div className="hero-content">

                <span className="hero-tag">
                    Digital Collection Management Platform
                </span>

                <h1>
                    The CMS built specifically
                    <br />
                    for artists, curators,
                    <br />
                    museums and galleries.
                </h1>

                <p>
                    Manage artworks, exhibitions, publications,
                    archives and portfolios in one place.
                    Publish to your own website, search your collection
                    with AI, and collaborate with curators effortlessly.
                </p>

                <div className="hero-buttons">

                    <button
                        className="primary-btn"
                        onClick={() => navigate('/signup')}
                    >
                        Start Free
                    </button>

                    <button
                        className="secondary-btn"
                        onClick={() => navigate('/login')}
                    >
                        Book Demo
                    </button>

                </div>

            </div>


            <div className="hero-preview">

                <div className="preview-window">

                    <div className="preview-image"></div>

                    <div className="preview-main">

                        <div className="preview-lines">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}
