const FEATURES = [
    {
        title: 'Collections & Series',
        description:
            'Organize your work into named bodies of work with a statement, a year range, and a fixed media category — the same way you already think about your practice.',
    },
    {
        title: 'Rich Curatorial Metadata',
        description:
            'Concepts, themes, techniques, materials and references live alongside every artwork — not bolted on, built in from the start.',
    },
    {
        title: 'Exhibition & Publication History',
        description:
            'Structured, queryable records of every show and every publication — not a paragraph buried in a CV file.',
    },
    {
        title: 'Full Visibility Control',
        description:
            'Every artwork is public or private, your choice. Curatorial detail stays hidden from public visitors even on public work.',
    },
    {
        title: 'Full-Text & Semantic Search',
        description:
            'Find work by exact keyword, or describe what you\u2019re looking for in plain language and let the archive find it for you.',
    },
    {
        title: 'One Archive, Every Purpose',
        description:
            'The same canonical data powers your own portfolio and the shared curatorial archive \u2014 upload once, use everywhere.',
    },
];

export default function Features() {
    return (
        <section className="features">
            <div className="features-header">
                <span className="section-tag">What you get</span>
                <h2>Built around how artists actually work</h2>
            </div>

            <div className="features-grid">
                {FEATURES.map((feature) => (
                    <div className="feature-card" key={feature.title}>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}