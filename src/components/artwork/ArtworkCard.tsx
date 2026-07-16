import { Minus, Image as ImageIcon } from 'lucide-react';
import type { Artwork } from '../../lib/types';
import { artworkSubtitle, classNames, mediaUrl, primaryMedia } from '../../lib/utils';
import { useLang } from '../../lib/i18n';

interface Props {
  artwork: Artwork;
  onDelete?: (artwork: Artwork) => void;
  onClick?: (artwork: Artwork) => void;
}

export default function ArtworkCard({ artwork, onDelete, onClick }: Props) {
  const { t } = useLang();
  const media = primaryMedia(artwork);
  const url = mediaUrl(media);
  const subtitle = artworkSubtitle(artwork);

  return (
    <article
      onClick={() => onClick?.(artwork)}
      className={classNames(
        'group relative cursor-pointer',
        onClick && 'transition-transform duration-300 hover:-translate-y-0.5'
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ink-100 ring-1 ring-ink-200/60">
        {url ? (
          <img
            src={url}
            alt={artwork.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-300">
            <ImageIcon className="h-8 w-8" />
            <span className="text-[11px] uppercase tracking-widest">{t('card.noImage')}</span>
          </div>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(artwork);
            }}
            className="icon-btn-danger absolute right-2 top-2 bg-white/85 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100"
            aria-label={t('card.deleteArtwork')}
            title={t('card.deleteArtwork')}
          >
            <Minus className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-serif text-lg leading-snug text-ink-900 text-balance">{artwork.title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
      </div>
    </article>
  );
}
