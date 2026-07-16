import type { Artwork, Collection, MediaAsset, MediaCategory } from './types';
import { apiOrigin } from './api';
import { CATEGORY_LABEL_KEYS } from './constants';
import { useLang } from './i18n';

export function classNames(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export function primaryMedia(artwork: Artwork): MediaAsset | null {
  if (!artwork.media || artwork.media.length === 0) return null;
  return artwork.media.find((m) => m.type === 'primary') ?? artwork.media[0];
}

export function mediaUrl(asset: MediaAsset | null): string | null {
  if (!asset || !asset.url) return null;
  if (/^https?:\/\//.test(asset.url)) return asset.url;
  return `${apiOrigin}${asset.url}`;
}

export function useCategoryLabel() {
  const { t } = useLang();
  return (category: MediaCategory | null): string => {
    if (!category) return t('cat.uncategorized');
    return t(CATEGORY_LABEL_KEYS[category] ?? 'cat.uncategorized');
  };
}

export function useFormatYearRange() {
  const { t } = useLang();
  return (start: number | null, end: number | null): string => {
    if (start == null && end == null) return '';
    if (start != null && end != null) return `${start} \u2013 ${end}`;
    if (start != null) return `${start} \u2013 ${t('year.present')}`;
    return `\u2013 ${end}`;
  };
}

export function arrayToCommaString(arr: string[] | undefined | null): string {
  if (!arr || arr.length === 0) return '';
  return arr.join(', ');
}

export function commaStringToArray(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function useGroupCollectionsByCategory() {
  const categoryLabel = useCategoryLabel();
  return (collections: Collection[]): {
    category: MediaCategory | null;
    label: string;
    collections: Collection[];
  }[] => {
    const groups = new Map<MediaCategory | null, Collection[]>();
    for (const c of collections) {
      const key = c.category ?? null;
      const list = groups.get(key) ?? [];
      list.push(c);
      groups.set(key, list);
    }
    const entries = Array.from(groups.entries());
    entries.sort((a, b) => {
      if (a[0] === null) return 1;
      if (b[0] === null) return -1;
      return categoryLabel(a[0]).localeCompare(categoryLabel(b[0]));
    });
    return entries.map(([category, cols]) => ({
      category,
      label: categoryLabel(category),
      collections: cols.sort((a, b) => a.name.localeCompare(b.name)),
    }));
  };
}

export function artworkSubtitle(artwork: Artwork): string {
  const parts: string[] = [];
  if (artwork.medium) parts.push(artwork.medium);
  if (artwork.year) parts.push(String(artwork.year));
  return parts.join(' \u00b7 ');
}
