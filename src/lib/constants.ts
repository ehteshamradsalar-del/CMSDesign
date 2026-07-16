import type { MediaCategory } from './types';

export const MEDIA_CATEGORIES: { value: MediaCategory; labelKey: string }[] = [
  { value: 'PAINTING', labelKey: 'cat.PAINTING' },
  { value: 'DRAWING', labelKey: 'cat.DRAWING' },
  { value: 'SCULPTURE', labelKey: 'cat.SCULPTURE' },
  { value: 'PRINTMAKING', labelKey: 'cat.PRINTMAKING' },
  { value: 'PHOTOGRAPHY', labelKey: 'cat.PHOTOGRAPHY' },
  { value: 'VIDEO_ART', labelKey: 'cat.VIDEO_ART' },
  { value: 'INSTALLATION', labelKey: 'cat.INSTALLATION' },
  { value: 'CERAMICS', labelKey: 'cat.CERAMICS' },
  { value: 'TEXTILE_ART', labelKey: 'cat.TEXTILE_ART' },
  { value: 'MIXED_MEDIA', labelKey: 'cat.MIXED_MEDIA' },
  { value: 'COLLAGE', labelKey: 'cat.COLLAGE' },
  { value: 'DIGITAL_ART', labelKey: 'cat.DIGITAL_ART' },
  { value: 'PERFORMANCE_ART', labelKey: 'cat.PERFORMANCE_ART' },
  { value: 'SOUND_ART', labelKey: 'cat.SOUND_ART' },
  { value: 'LAND_ART', labelKey: 'cat.LAND_ART' },
  { value: 'ASSEMBLAGE', labelKey: 'cat.ASSEMBLAGE' },
  { value: 'NEW_MEDIA', labelKey: 'cat.NEW_MEDIA' },
  { value: 'GLASS_ART', labelKey: 'cat.GLASS_ART' },
  { value: 'BOOK_ART', labelKey: 'cat.BOOK_ART' },
  { value: 'STREET_ART', labelKey: 'cat.STREET_ART' },
];

export const CATEGORY_LABEL_KEYS: Record<MediaCategory, string> = MEDIA_CATEGORIES.reduce(
  (acc, c) => {
    acc[c.value] = c.labelKey;
    return acc;
  },
  {} as Record<MediaCategory, string>
);

export const AVAILABILITY_OPTIONS: { value: 'AVAILABLE' | 'SOLD' | 'NOT_FOR_SALE'; labelKey: string }[] = [
  { value: 'AVAILABLE', labelKey: 'avail.AVAILABLE' },
  { value: 'SOLD', labelKey: 'avail.SOLD' },
  { value: 'NOT_FOR_SALE', labelKey: 'avail.NOT_FOR_SALE' },
];

export const VISIBILITY_OPTIONS: { value: 'PUBLIC' | 'PRIVATE'; labelKey: string }[] = [
  { value: 'PUBLIC', labelKey: 'vis.PUBLIC' },
  { value: 'PRIVATE', labelKey: 'vis.PRIVATE' },
];

export const STORAGE_KEY = 'archive_auth';
