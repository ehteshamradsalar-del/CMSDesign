import { useLang } from '../../lib/i18n';

export default function Features() {
    const { t } = useLang();

    const features = [
        { title: t('features.1.title'), desc: t('features.1.desc') },
        { title: t('features.2.title'), desc: t('features.2.desc') },
        { title: t('features.3.title'), desc: t('features.3.desc') },
        { title: t('features.4.title'), desc: t('features.4.desc') },
        { title: t('features.5.title'), desc: t('features.5.desc') },
        { title: t('features.6.title'), desc: t('features.6.desc') },
    ];

    return (
        <section className="features" id="features">
            <div className="features-header">
                <span className="section-number">{t('features.sectionNumber')}</span>
                <span className="section-tag">{t('features.sectionTag')}</span>
                <h2>{t('features.heading')}</h2>
            </div>

            <div className="features-grid">
                {features.map((feature) => (
                    <div className="feature-card" key={feature.title}>
                        <h3>{feature.title}</h3>
                        <p>{feature.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
