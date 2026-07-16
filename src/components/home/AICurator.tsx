import { Search } from 'lucide-react';
import { useLang } from '../../lib/i18n';

export default function AICurator() {
    const { t } = useLang();

    const headingLines = t('ai.heading').split('\n');
    const queries = [t('ai.query1'), t('ai.query2'), t('ai.query3')];

    return (
        <section className="ai-curator">
            <div className="ai-curator-content">
                <span className="section-number" style={{ color: '#78716c' }}>{t('ai.sectionNumber')}</span>
                <span className="section-tag">{t('ai.sectionTag')}</span>
                <h2>
                    {headingLines.map((line, i) => (
                        <span key={i}>
                            {line}
                            {i < headingLines.length - 1 && <br />}
                        </span>
                    ))}
                </h2>
                <p>{t('ai.body')}</p>
                <p className="ai-curator-note">{t('ai.note')}</p>
            </div>

            <div className="ai-curator-demo">
                <div className="search-bar-mock">
                    <Search size={16} strokeWidth={1.75} />
                    <span className="search-placeholder">{t('ai.placeholder')}</span>
                </div>

                <div className="query-chips">
                    {queries.map((query) => (
                        <span className="query-chip" key={query}>
                            {query}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
