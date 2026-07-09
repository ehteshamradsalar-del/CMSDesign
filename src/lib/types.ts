export type MediaCategory =
  | 'PAINTING'
  | 'DRAWING'
  | 'SCULPTURE'
  | 'PRINTMAKING'
  | 'PHOTOGRAPHY'
  | 'VIDEO_ART'
  | 'INSTALLATION'
  | 'CERAMICS'
  | 'TEXTILE_ART'
  | 'MIXED_MEDIA'
  | 'COLLAGE'
  | 'DIGITAL_ART'
  | 'PERFORMANCE_ART'
  | 'SOUND_ART'
  | 'LAND_ART'
  | 'ASSEMBLAGE'
  | 'NEW_MEDIA'
  | 'GLASS_ART'
  | 'BOOK_ART'
  | 'STREET_ART';

export type Visibility = 'PUBLIC' | 'PRIVATE';

export type Availability = 'AVAILABLE' | 'SOLD' | 'NOT_FOR_SALE';

export type MediaType =
  | 'primary'
  | 'additional'
  | 'installation'
  | 'detail'
  | 'video'
  | 'sound';

export interface User {
  id: number;
  email: string;
  name: string;
  country?: string | null;
  artistId?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ExhibitionEntry {
  id?: number;
  exhibitionName: string;
  venue: string;
  location: string;
  year: number;
}

export interface PublicationEntry {
  id?: number;
  title: string;
  publisher: string;
  year: number;
  url?: string | null;
}

export interface MediaAsset {
  id: number;
  type: MediaType;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface Artwork {
  id: number;
  artistId: number;
  collectionId: number | null;

  title: string;
  year: number | null;
  medium: string | null;
  dimensions: string | null;
  edition: string | null;
  availability: Availability;
  series: string | null;

  keywords?: string[];
  themes?: string[];
  concepts?: string[];
  techniques?: string[];
  materials?: string[];
    references?: string[];
    personalNotes?: string[];

  exhibitionHistory?: ExhibitionEntry[];
  publicationHistory?: PublicationEntry[];

  media?: MediaAsset[];

  visibility: Visibility;
  copyright: string | null;
  price: number | null;

  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: number;
  name: string;
  statement: string | null;
  startYear: number | null;
  endYear: number | null;
  category: MediaCategory | null;
  visibility: Visibility;
  artistId: number;
  artworks: Artwork[];
  createdAt: string;
}

export interface ApiError {
  error?: string;
  message?: string;
}
