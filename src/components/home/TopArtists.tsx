import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import ArtworkCard from '../artwork/ArtworkCard';
import type { Artwork } from '../../lib/types';

// Named "TopArtists" per the request that created this file, but deliberately
// does NOT fabricate artist names, rankings, or bios — there's no real public
// artist directory yet, and no basis for claiming any artist is "top."
// Instead this pulls genuinely real public artworks from the live API, most
// recent first. Once a real public artist directory / featured-artist
// endpoint exists, this is the component to point at it.
export default function TopArtists() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        api
            .get('/artworks', { params: { limit: 6, sort: '-createdAt' } })
            .then((res) => {
                if (!cancelled) setArtworks(res.data?.data ?? []);
            })
            .catch(() => {
                if (!cancelled) setArtworks([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    if (!loading && artworks.length === 0) {
        return null;
    }

    return (
        <section className="from-archive" id="archive">
            <div className="from-archive-header">
                <span className="section-tag">From the archive</span>
                <h2>Recently added public work</h2>
            </div>

            {loading ? (
                <div className="from-archive-loading">Loading&hellip;</div>
            ) : (
                <div className="from-archive-grid">
                    {artworks.map((artwork) => (
                        <ArtworkCard key={artwork.id} artwork={artwork} />
                    ))}
                </div>
            )}
        </section>
    );
}