import { Check, Minus } from 'lucide-react';

const ROWS = [
    { label: 'Professional portfolio website', us: true, generic: true, portfolio: true },
    { label: 'Structured curatorial metadata', us: true, generic: false, portfolio: false },
    { label: 'Exhibition & publication history', us: true, generic: false, portfolio: false },
    { label: 'Feeds a shared curatorial archive', us: true, generic: false, portfolio: false },
    { label: 'Full-text & semantic search', us: true, generic: false, portfolio: false },
    { label: 'You own your underlying data', us: true, generic: true, portfolio: false },
];

function Cell({ value }: { value: boolean }) {
    return value ? (
        <Check className="cell-yes" size={18} strokeWidth={2} />
    ) : (
        <Minus className="cell-no" size={18} strokeWidth={2} />
    );
}

export default function Comparison() {
    return (
        <section className="comparison" id="comparison">
            <div className="comparison-header">
                <span className="section-number">02 /</span>
                <span className="section-tag">Why this, not that</span>
                <h2>Not another website builder.</h2>
                <p>
                    General-purpose builders give you a page. Portfolio-only tools give
                    you a gallery. This gives your work a structured, permanent archive
                    underneath a portfolio you still fully own.
                </p>
            </div>

            <div className="comparison-table">
                <div className="comparison-row comparison-row-head">
                    <span />
                    <span>This platform</span>
                    <span>Generic builders</span>
                    <span>Portfolio-only tools</span>
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