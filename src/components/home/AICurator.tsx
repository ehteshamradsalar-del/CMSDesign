import { Search } from 'lucide-react';

const EXAMPLE_QUERIES = [
    'quiet, melancholic paintings about migration',
    'installations exploring memory and place',
    'early monochrome photography series',
];

export default function AICurator() {
    return (
        <section className="ai-curator">
            <div className="ai-curator-content">
                <span className="section-tag">Semantic search</span>
                <h2>
                    Search your archive the way you
                    <br />
                    actually think about your work.
                </h2>
                <p>
                    Beyond exact keyword matching, describe what you're looking for in
                    plain language and the archive finds conceptually related work \u2014
                    even pieces that never used those exact words.
                </p>
                <p className="ai-curator-note">
                    Embeddings are generated locally on your own server \u2014 no artwork
                    data or curatorial notes are ever sent to a third-party API.
                </p>
            </div>

            <div className="ai-curator-demo">
                <div className="search-bar-mock">
                    <Search size={16} strokeWidth={1.75} />
                    <span className="search-placeholder">
                        Describe what you're looking for&hellip;
                    </span>
                </div>

                <div className="query-chips">
                    {EXAMPLE_QUERIES.map((query) => (
                        <span className="query-chip" key={query}>
                            {query}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}