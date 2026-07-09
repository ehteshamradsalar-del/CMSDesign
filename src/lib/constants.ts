import type { MediaCategory } from './types';

export const MEDIA_CATEGORIES: { value: MediaCategory; label: string }[] = [
  { value: 'PAINTING', label: 'Painting' },
  { value: 'DRAWING', label: 'Drawing' },
  { value: 'SCULPTURE', label: 'Sculpture' },
  { value: 'PRINTMAKING', label: 'Printmaking' },
  { value: 'PHOTOGRAPHY', label: 'Photography' },
  { value: 'VIDEO_ART', label: 'Video Art' },
  { value: 'INSTALLATION', label: 'Installation' },
  { value: 'CERAMICS', label: 'Ceramics' },
  { value: 'TEXTILE_ART', label: 'Textile Art' },
  { value: 'MIXED_MEDIA', label: 'Mixed Media' },
  { value: 'COLLAGE', label: 'Collage' },
  { value: 'DIGITAL_ART', label: 'Digital Art' },
  { value: 'PERFORMANCE_ART', label: 'Performance Art' },
  { value: 'SOUND_ART', label: 'Sound Art' },
  { value: 'LAND_ART', label: 'Land Art / Earthworks' },
  { value: 'ASSEMBLAGE', label: 'Assemblage' },
  { value: 'NEW_MEDIA', label: 'New Media' },
  { value: 'GLASS_ART', label: 'Glass Art' },
  { value: 'BOOK_ART', label: 'Book Art' },
  { value: 'STREET_ART', label: 'Street Art / Graffiti' },
];

export const CATEGORY_LABELS: Record<MediaCategory, string> = MEDIA_CATEGORIES.reduce(
  (acc, c) => {
    acc[c.value] = c.label;
    return acc;
  },
  {} as Record<MediaCategory, string>
);

export const AVAILABILITY_OPTIONS: { value: 'AVAILABLE' | 'SOLD' | 'NOT_FOR_SALE'; label: string }[] = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'SOLD', label: 'Sold' },
  { value: 'NOT_FOR_SALE', label: 'Not for sale' },
];

export const VISIBILITY_OPTIONS: { value: 'PUBLIC' | 'PRIVATE'; label: string }[] = [
  { value: 'PUBLIC', label: 'Public' },
  { value: 'PRIVATE', label: 'Private' },
];

export const STORAGE_KEY = 'archive_auth';
