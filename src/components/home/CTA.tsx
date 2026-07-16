import { useNavigate } from 'react-router-dom';
import { useLang } from '../../lib/i18n';

export default function CTA() {
    const navigate = useNavigate();
    const { t } = useLang();

    const headingLines = t('cta.heading').split('\n');

    return (
        <section className="cta">
            <h2>
                {headingLines.map((line, i) => (
                    <span key={i}>
                        {line}
                        {i < headingLines.length - 1 && <br />}
                    </span>
                ))}
            </h2>
            <p>{t('cta.body')}</p>
            <button className="primary-btn" onClick={() => navigate('/signup')}>
                {t('cta.button')}
            </button>
        </section>
    );
}
