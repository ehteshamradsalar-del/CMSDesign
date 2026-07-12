const STATS = [
    { value: '20', label: 'Recognized media categories' },
    { value: '1', label: 'Canonical record per artwork' },
    { value: '100%', label: 'Data ownership, always' },
    { value: '0', label: 'Third-party API calls for search' },
];

export default function Stats() {
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