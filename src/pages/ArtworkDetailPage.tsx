import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import ErrorBanner from '../components/common/ErrorBanner';
import ArtworkCard from '../components/artwork/ArtworkCard';
import { api, parseApiError } from '../lib/api';
import { mediaUrl, primaryMedia, artworkSubtitle } from '../lib/utils';
import type { Artwork } from '../lib/types';

export default function ArtworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [related, setRelated] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get<Artwork>(`/artworks/${id}`)
      .then((res) => {
        if (cancelled) return;
        setArtwork(res.data);

        // Load related works from the same collection if available
        const collectionId = res.data.collectionId;
        if (collectionId != null) {
          api
            .get<{ data: Artwork[] } | Artwork[]>(`/collections/${collectionId}`)
            .then((colRes) => {
              if (cancelled) return;
              const colData = colRes.data as { artworks?: Artwork[] };
              const works = colData.artworks ?? [];
              setRelated(works.filter((a) => a.id !== res.data.id).slice(0, 3));
            })
            .catch(() => {
              if (!cancelled) setRelated([]);
            });
        }
      })
      .catch((err) => {
        if (!cancelled) setError(parseApiError(err, 'Could not load this artwork.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <div className="text-[11px] uppercase tracking-label text-ink-500">Loading</div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:px-10">
          <button
            onClick={() => navigate('/archive')}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to archive
          </button>
          <div className="mt-8">
            <ErrorBanner message={error} />
          </div>
        </div>
      </div>
    );
  }

  const media = primaryMedia(artwork);
  const imageUrl = mediaUrl(media);
  const subtitle = artworkSubtitle(artwork);

  const tagArrays: { label: string; items: string[] | undefined }[] = [
    { label: 'Concepts', items: artwork.concepts },
    { label: 'Techniques', items: artwork.techniques },
    { label: 'Materials', items: artwork.materials },
    { label: 'Keywords', items: artwork.keywords },
    { label: 'Themes', items: artwork.themes },
    { label: 'References', items: artwork.references },
  ];

  const exhibitions = artwork.exhibitionHistory ?? [];
  const publications = artwork.publicationHistory ?? [];

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-ink-200 bg-ink-50/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-editorial items-center justify-between px-6 py-4 sm:px-10">
          <button
            onClick={() => navigate('/archive')}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to archive
          </button>
          {artwork.visibility === 'PRIVATE' && (
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-label text-ink-500">
              <Lock className="h-3.5 w-3.5" />
              Private
            </span>
          )}
        </div>
      </header>

      <article className="mx-auto max-w-editorial px-6 py-10 sm:px-10">
        {/* Title block */}
        <div className="fade-in mb-10">
          <h1 className="font-serif text-display text-ink-900 text-balance">{artwork.title}</h1>
          {subtitle && <p className="mt-2 text-body text-ink-500">{subtitle}</p>}
        </div>

        {/* Image + metadata grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          {/* Image */}
          <div className="fade-in-up">
            {imageUrl ? (
              <div className="overflow-hidden rounded-sm bg-white shadow-soft ring-1 ring-ink-200/60">
                <img
                  src={imageUrl}
                  alt={artwork.title}
                  className="w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center rounded-sm border border-dashed border-ink-200 bg-white text-ink-500">
                <span className="text-[11px] uppercase tracking-label">No image</span>
              </div>
            )}
          </div>

          {/* Metadata sidebar */}
          <aside className="fade-in-up space-y-8" style={{ animationDelay: '0.05s' }}>
            <div>
              <h2 className="section-tag mb-3">Details</h2>
              <dl className="space-y-2.5 text-sm">
                <DetailRow label="Medium" value={artwork.medium} />
                <DetailRow label="Dimensions" value={artwork.dimensions} />
                <DetailRow label="Edition" value={artwork.edition} />
                <DetailRow label="Series" value={artwork.series} />
                <DetailRow label="Year" value={artwork.year != null ? String(artwork.year) : undefined} />
                <DetailRow label="Availability" value={availabilityLabel(artwork.availability)} />
                {artwork.price != null && (
                  <DetailRow label="Price" value={`$${artwork.price.toLocaleString()}`} />
                )}
                <DetailRow label="Copyright" value={artwork.copyright} />
              </dl>
            </div>

            {/* Curatorial tags */}
            {tagArrays.map(
              ({ label, items }) =>
                items &&
                items.length > 0 && (
                  <div key={label}>
                    <h2 className="section-tag mb-3">{label}</h2>
                    <div className="flex flex-wrap gap-2">
                      {items.map((tag) => (
                        <span key={tag} className="tag-chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )
            )}

            {/* Personal notes */}
            {artwork.personalNotes && (
              <div>
                <h2 className="section-tag mb-3">Notes</h2>
                <p className="text-sm leading-relaxed text-ink-600">{artwork.personalNotes}</p>
              </div>
            )}
          </aside>
        </div>

        {/* Exhibition history */}
        {exhibitions.length > 0 && (
          <section className="mt-16 border-t border-ink-200 pt-8">
            <h2 className="font-serif text-h2 text-ink-900">Exhibition history</h2>
            <div className="mt-5 space-y-4">
              {exhibitions.map((ex, i) => (
                <div
                  key={ex.id ?? i}
                  className="flex flex-col gap-1 border-b border-ink-100 pb-4 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <div>
                    <div className="font-medium text-ink-900">{ex.exhibitionName}</div>
                    <div className="text-sm text-ink-500">
                      {ex.venue}
                      {ex.location ? `, ${ex.location}` : ''}
                    </div>
                  </div>
                  <span className="text-sm tabular-nums text-ink-500">{ex.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Publication history */}
        {publications.length > 0 && (
          <section className="mt-16 border-t border-ink-200 pt-8">
            <h2 className="font-serif text-h2 text-ink-900">Publication history</h2>
            <div className="mt-5 space-y-4">
              {publications.map((pub, i) => (
                <div
                  key={pub.id ?? i}
                  className="flex flex-col gap-1 border-b border-ink-100 pb-4 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <div>
                    <div className="font-medium text-ink-900">{pub.title}</div>
                    <div className="text-sm text-ink-500">{pub.publisher}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-gold-dark hover:underline"
                      >
                        View
                      </a>
                    )}
                    <span className="text-sm tabular-nums text-ink-500">{pub.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related works */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-ink-200 pt-8">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-h2 text-ink-900">From the same collection</h2>
              {artwork.collectionId && (
                <Link
                  to="/archive"
                  className="text-sm font-medium text-brand-gold-dark hover:underline"
                >
                  View all
                </Link>
              )}
            </div>
            <div className="stagger mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArtworkCard
                  key={a.id}
                  artwork={a}
                  onClick={(art) => navigate(`/artworks/${art.id}`)}
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-500">{label}</dt>
      <dd className="text-right text-ink-900">{value}</dd>
    </div>
  );
}

function availabilityLabel(avail: string): string {
  switch (avail) {
    case 'AVAILABLE':
      return 'Available';
    case 'SOLD':
      return 'Sold';
    case 'NOT_FOR_SALE':
      return 'Not for sale';
    default:
      return avail;
  }
}
