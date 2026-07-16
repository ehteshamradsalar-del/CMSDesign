import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ArtworkCard from '../components/artwork/ArtworkCard';
import ErrorBanner from '../components/common/ErrorBanner';
import { api, parseApiError } from '../lib/api';
import { MEDIA_CATEGORIES } from '../lib/constants';
import { useLang } from '../lib/i18n';
import type { Artwork, MediaCategory } from '../lib/types';

export default function ArchivePage() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<MediaCategory>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get<{ data: Artwork[] } | Artwork[]>('/artworks', { params: { limit: 100, sort: '-createdAt' } })
      .then((res) => {
        if (cancelled) return;
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setArtworks(data);
      })
      .catch((err) => {
        if (!cancelled) setError(parseApiError(err, t('archive.error')));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  const filtered = useMemo(() => {
    let list = artworks;
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((a) => {
        const haystack = [a.title, a.medium, a.series, ...(a.keywords ?? []), ...(a.themes ?? [])]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      });
    }
    return list;
  }, [artworks, query]);

  function toggleCategory(cat: MediaCategory) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function clearFilters() {
    setActiveCategories(new Set());
    setQuery('');
  }

  const hasFilters = activeCategories.size > 0 || query.trim().length > 0;

  return (
    <main className="min-h-screen bg-ink-50">
      {/* Page header */}
      <div className="border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-editorial px-6 py-10 sm:px-10">
          <span className="section-number">{t('archive.sectionNumber')}</span>
          <span className="section-tag ml-2">{t('archive.sectionTag')}</span>
          <h1 className="mt-2 font-serif text-display text-ink-900 text-balance">
            {t('archive.heading')}
          </h1>
          <p className="mt-3 max-w-xl text-body text-ink-500">
            {t('archive.body')}
          </p>
        </div>
      </div>

      {/* Search + filter toggle */}
      <div className="sticky top-0 z-10 border-b border-ink-200 bg-ink-50/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-editorial items-center gap-3 px-6 py-4 sm:px-10">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('archive.searchPlaceholder')}
              className="field-input pl-9"
              aria-label={t('archive.searchAria')}
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="btn-secondary"
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t('archive.filters')}
            {activeCategories.size > 0 && (
              <span className="ml-1 rounded-pill bg-brand-gold/20 px-1.5 py-0.5 text-[10px] font-medium text-brand-gold-dark">
                {activeCategories.size}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div id="filter-panel" className="fade-in border-t border-ink-200 bg-white">
            <div className="mx-auto max-w-editorial px-6 py-5 sm:px-10">
              <div className="mb-3 flex items-center justify-between">
                <span className="field-label mb-0">{t('archive.filterByMedium')}</span>
                {hasFilters && (
                  <button onClick={clearFilters} className="btn-ghost text-xs">
                    <X className="h-3 w-3" />
                    {t('archive.clearAll')}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {MEDIA_CATEGORIES.map((c) => {
                  const active = activeCategories.has(c.value);
                  return (
                    <button
                      key={c.value}
                      onClick={() => toggleCategory(c.value)}
                      className={active ? 'tag-chip-active' : 'tag-chip'}
                    >
                      {t(c.labelKey)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mx-auto max-w-editorial px-6 py-10 sm:px-10">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-[11px] uppercase tracking-label text-ink-500">{t('archive.loading')}</div>
          </div>
        ) : error ? (
          <div className="max-w-xl">
            <ErrorBanner message={error} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <p className="font-serif text-h2 text-ink-900">{t('archive.noResults')}</p>
            <p className="mt-2 text-sm text-ink-500">
              {hasFilters ? t('archive.adjustFilters') : t('archive.empty')}
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-secondary mt-5">
                {t('archive.clearFilters')}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-ink-500">
              {filtered.length} {filtered.length === 1 ? t('archive.work') : t('archive.works')}
            </div>
            <div className="stagger grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a) => (
                <ArtworkCard
                  key={a.id}
                  artwork={a}
                  onClick={(artwork) => navigate(`/artworks/${artwork.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
