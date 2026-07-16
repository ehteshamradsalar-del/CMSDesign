import { useLang } from '../../lib/i18n';

export default function Stats() {
    const { t } = useLang();

    const STATS = [
        { value: '20', label: t('stats.1.label') },
        { value: '1', label: t('stats.2.label') },
        { value: '100%', label: t('stats.3.label') },
        { value: '0', label: t('stats.4.label') },
    ];

    return (
        <section className="stats">
            {STATS.map((stat) => (
                <div className="stat-item" key={stat.label}>
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                </div>
            ))}
        </section>
    );
}
