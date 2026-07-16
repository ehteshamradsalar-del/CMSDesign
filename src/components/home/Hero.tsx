import { useNavigate } from 'react-router-dom';
import { useLang } from '../../lib/i18n';

export default function Hero() {
    const navigate = useNavigate();
    const { t } = useLang();

    const headingLines = t('hero.heading').split('\n');

    return (
        <section className="hero">

            <div className="hero-content">

                <span className="hero-tag">
                    {t('hero.tag')}
                </span>

                <h1>
                    {headingLines.map((line, i) => (
                        <span key={i}>
                            {line}
                            {i < headingLines.length - 1 && <br />}
                        </span>
                    ))}
                </h1>

                <p>
                    {t('hero.body')}
                </p>

                <div className="hero-buttons">

                    <button
                        className="primary-btn"
                        onClick={() => navigate('/signup')}
                    >
                        {t('hero.startFree')}
                    </button>

                    <button
                        className="secondary-btn"
                        onClick={() => navigate('/login')}
                    >
                        {t('hero.bookDemo')}
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
