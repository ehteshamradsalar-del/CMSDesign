import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import ArtworkCard from '../artwork/ArtworkCard';
import { useLang } from '../../lib/i18n';
import type { Artwork } from '../../lib/types';

export default function TopArtists() {
    const { t } = useLang();
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
                <span className="section-number">{t('top.sectionNumber')}</span>
                <span className="section-tag">{t('top.sectionTag')}</span>
                <h2>{t('top.heading')}</h2>
            </div>

            {loading ? (
                <div className="from-archive-loading">{t('top.loading')}</div>
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
