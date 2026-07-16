import { Check, Minus } from 'lucide-react';
import { useLang } from '../../lib/i18n';

export default function Comparison() {
    const { t } = useLang();

    const ROWS = [
        { label: t('cmp.row.1'), us: true, generic: true, portfolio: true },
        { label: t('cmp.row.2'), us: true, generic: false, portfolio: false },
        { label: t('cmp.row.3'), us: true, generic: false, portfolio: false },
        { label: t('cmp.row.4'), us: true, generic: false, portfolio: false },
        { label: t('cmp.row.5'), us: true, generic: false, portfolio: false },
        { label: t('cmp.row.6'), us: true, generic: true, portfolio: false },
    ];

    function Cell({ value }: { value: boolean }) {
        return value ? (
            <Check className="cell-yes" size={18} strokeWidth={2} />
        ) : (
            <Minus className="cell-no" size={18} strokeWidth={2} />
        );
    }

    return (
        <section className="comparison" id="comparison">
            <div className="comparison-header">
                <span className="section-number">{t('cmp.sectionNumber')}</span>
                <span className="section-tag">{t('cmp.sectionTag')}</span>
                <h2>{t('cmp.heading')}</h2>
                <p>{t('cmp.body')}</p>
            </div>

            <div className="comparison-table">
                <div className="comparison-row comparison-row-head">
                    <span />
                    <span>{t('cmp.col.us')}</span>
                    <span>{t('cmp.col.generic')}</span>
                    <span>{t('cmp.col.portfolio')}</span>
                </div>

                {ROWS.map((row) => (
                    <div className="comparison-row" key={row.label}>
                        <span className="comparison-label">{row.label}</span>
                        <Cell value={row.us} />
                        <Cell value={row.generic} />
                        <Cell value={row.portfolio} />
                    </div>
                ))}
            </div>
        </section>
    );
}
