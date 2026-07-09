import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Upload, ImageIcon, X } from 'lucide-react';
import ErrorBanner from '../components/ErrorBanner';
import { api, parseApiError } from '../lib/api';
import { AVAILABILITY_OPTIONS, VISIBILITY_OPTIONS } from '../lib/constants';
import {
  arrayToCommaString,
  commaStringToArray,
  mediaUrl,
  primaryMedia,
} from '../lib/utils';
import type { Artwork, Collection, MediaAsset } from '../lib/types';

interface FormState {
  title: string;
  year: string;
  dimensions: string;
  medium: string;
  edition: string;
  series: string;
  availability: 'AVAILABLE' | 'SOLD' | 'NOT_FOR_SALE';
  concepts: string;
  techniques: string;
  materials: string;
  references: string;
  personalnotes: string;
  keywords: string;
  themes: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  price: string;
  copyright: string;
  collectionId: string;
}

function emptyForm(): FormState {
  return {
    title: '',
    year: '',
    dimensions: '',
    medium: '',
    edition: '',
    series: '',
    availability: 'AVAILABLE',
    concepts: '',
    techniques: '',
    materials: '',
    references: '',
    personalnotes: '',
    keywords: '',
    themes: '',
    visibility: 'PUBLIC',
    price: '',
    copyright: '',
    collectionId: '',
  };
}

export default function ArtworkFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState<FormState>(emptyForm());
  const [collections, setCollections] = useState<Collection[]>([]);
  const [existingMedia, setExistingMedia] = useState<MediaAsset | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load collections for the select dropdown
  useEffect(() => {
    api
      .get<Collection[]>('/collections/mine')
      .then((res) => setCollections(res.data ?? []))
      .catch(() => setCollections([]));
  }, []);

  // Load existing artwork when editing
  const loadArtwork = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Artwork>(`/artworks/${id}`);
      const a = res.data;
      setForm({
        title: a.title ?? '',
        year: a.year != null ? String(a.year) : '',
        dimensions: a.dimensions ?? '',
        medium: a.medium ?? '',
        edition: a.edition ?? '',
        series: a.series ?? '',
        availability: a.availability ?? 'AVAILABLE',
        concepts: arrayToCommaString(a.concepts),
        techniques: arrayToCommaString(a.techniques),
        materials: arrayToCommaString(a.materials),
        references: arrayToCommaString(a.references),
        personalnotes: arrayToCommaString(a.personalnotes),
        keywords: arrayToCommaString(a.keywords),
        themes: arrayToCommaString(a.themes),
        visibility: a.visibility ?? 'PUBLIC',
        price: a.price != null ? String(a.price) : '',
        copyright: a.copyright ?? '',
        collectionId: a.collectionId != null ? String(a.collectionId) : '',
      });
      setExistingMedia(primaryMedia(a));
    } catch (err) {
      setError(parseApiError(err, 'Could not load this artwork.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEdit) {
      loadArtwork();
    } else {
      const preCollection = searchParams.get('collectionId');
      if (preCollection) {
        setForm((f) => ({ ...f, collectionId: preCollection }));
      }
    }
  }, [isEdit, loadArtwork, searchParams]);

  // File preview
  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function update<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  }

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError('Please enter a title.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const year = form.year ? parseInt(form.year, 10) : null;
    const price = form.price ? parseFloat(form.price) : null;
    if (form.year && (year === null || isNaN(year))) {
      setError('Year must be a valid number.');
      return;
    }
    if (form.price && (price === null || isNaN(price))) {
      setError('Price must be a valid number.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      year,
      dimensions: form.dimensions.trim() || null,
      medium: form.medium.trim() || null,
      edition: form.edition.trim() || null,
      series: form.series.trim() || null,
      availability: form.availability,
      concepts: commaStringToArray(form.concepts),
      techniques: commaStringToArray(form.techniques),
      materials: commaStringToArray(form.materials),
      references: commaStringToArray(form.references),
      personalnotes: commaStringToArray(form.personalnotes),
      keywords: commaStringToArray(form.keywords),
      themes: commaStringToArray(form.themes),
      visibility: form.visibility,
      price,
      copyright: form.copyright.trim() || null,
      collectionId: form.collectionId ? parseInt(form.collectionId, 10) : null,
    };

    setSaving(true);
    try {
      let savedArtwork: Artwork;
      if (isEdit && id) {
        const res = await api.put<Artwork>(`/artworks/${id}`, payload);
        savedArtwork = res.data;
      } else {
        const res = await api.post<Artwork>('/artworks', payload);
        savedArtwork = res.data;
      }

      // Upload media if a file was chosen
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('type', 'primary');
        await api.post(`/media/artwork/${savedArtwork.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError(parseApiError(err));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <div className="text-[11px] uppercase tracking-widest text-ink-400">Loading</div>
      </div>
    );
  }

  const currentPreview = filePreview ?? mediaUrl(existingMedia);

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-ink-200 bg-ink-50/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 sm:px-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </button>
          <span className="text-[11px] uppercase tracking-widest text-ink-400">
            {isEdit ? 'Edit artwork' : 'New artwork'}
          </span>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <h1 className="font-serif text-4xl text-ink-900">
          {isEdit ? 'Edit artwork' : 'Add artwork'}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {isEdit
            ? 'Update the details of this work. Fields marked optional can be left blank.'
            : 'Record a new work in your archive. Only the title is required.'}
        </p>

        <div className="mt-8">
          <ErrorBanner message={error} />
        </div>

        <div className="mt-8 space-y-16">
          {/* Group 1 — Basics */}
          <Section number="01" title="Basics">
            <Field label="Title" required>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className="field-input"
                placeholder="Untitled (Study in Ochre)"
              />
            </Field>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Year">
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => update('year', e.target.value)}
                  className="field-input"
                  placeholder="2024"
                  min={0}
                  max={new Date().getFullYear() + 50}
                />
              </Field>
              <Field label="Dimensions">
                <input
                  type="text"
                  value={form.dimensions}
                  onChange={(e) => update('dimensions', e.target.value)}
                  className="field-input"
                  placeholder="120 × 90 cm"
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Medium">
                <input
                  type="text"
                  value={form.medium}
                  onChange={(e) => update('medium', e.target.value)}
                  className="field-input"
                  placeholder="Oil on linen"
                />
              </Field>
              <Field label="Edition">
                <input
                  type="text"
                  value={form.edition}
                  onChange={(e) => update('edition', e.target.value)}
                  className="field-input"
                  placeholder="1/5 or unique"
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Series">
                <input
                  type="text"
                  value={form.series}
                  onChange={(e) => update('series', e.target.value)}
                  className="field-input"
                  placeholder="Threshold Studies"
                />
              </Field>
              <Field label="Availability">
                <select
                  value={form.availability}
                  onChange={(e) =>
                    update('availability', e.target.value as FormState['availability'])
                  }
                  className="field-input cursor-pointer"
                >
                  {AVAILABILITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Collection">
              <select
                value={form.collectionId}
                onChange={(e) => update('collectionId', e.target.value)}
                className="field-input cursor-pointer"
              >
                <option value="">— Uncategorized —</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          {/* Group 2 — Curatorial detail */}
          <Section number="02" title="Curatorial detail" note="Separate multiple entries with commas">
            <Field label="Concepts">
              <input
                type="text"
                value={form.concepts}
                onChange={(e) => update('concepts', e.target.value)}
                className="field-input"
                placeholder="memory, erosion, domestic space"
              />
            </Field>
            <Field label="Technique">
              <input
                type="text"
                value={form.techniques}
                onChange={(e) => update('techniques', e.target.value)}
                className="field-input"
                placeholder="glazing, impasto, sgraffito"
              />
            </Field>
            <Field label="Materials">
              <input
                type="text"
                value={form.materials}
                onChange={(e) => update('materials', e.target.value)}
                className="field-input"
                placeholder="linen, rabbit-skin glue, lead white"
              />
            </Field>
            <Field label="References">
              <input
                type="text"
                value={form.references}
                onChange={(e) => update('references', e.target.value)}
                className="field-input"
                placeholder="Morandi, Tuttle, Agnes Martin"
              />
            </Field>
                      <Field label="personal notes">
                          <input
                              type="text"
                              value={form.personalnotes}
                              onChange={(e) => update('personalnotes', e.target.value)}
                              className="field-input"
                              placeholder="thoughts on the process"
                          />
                      </Field>
          </Section>

          {/* Group 3 — Keywords & themes */}
          <Section number="03" title="Keywords & themes" note="Separate multiple entries with commas">
            <Field label="Keywords">
              <input
                type="text"
                value={form.keywords}
                onChange={(e) => update('keywords', e.target.value)}
                className="field-input"
                placeholder="still life, interior, light"
              />
            </Field>
            <Field label="Themes">
              <input
                type="text"
                value={form.themes}
                onChange={(e) => update('themes', e.target.value)}
                className="field-input"
                placeholder="solitude, time, materiality"
              />
            </Field>
          </Section>

          {/* Group 4 — Image */}
          <Section number="04" title="Image">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="relative aspect-[4/5] w-40 flex-shrink-0 overflow-hidden rounded-sm bg-ink-100 ring-1 ring-ink-200/60">
                {currentPreview ? (
                  <img src={currentPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-ink-300">
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-[10px] uppercase tracking-widest">No image</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="artwork-image"
                />
                {file ? (
                  <div className="flex items-center justify-between rounded-sm border border-ink-200 bg-white px-3.5 py-2.5">
                    <span className="truncate text-sm text-ink-700">{file.name}</span>
                    <button type="button" onClick={clearFile} className="icon-btn" aria-label="Remove file">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="artwork-image"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-ink-300 bg-white px-4 py-6 text-sm text-ink-500 transition-colors hover:border-ink-900 hover:text-ink-900"
                  >
                    <Upload className="h-4 w-4" />
                    {isEdit && existingMedia ? 'Replace image' : 'Choose an image'}
                  </label>
                )}
                <p className="mt-2 text-xs text-ink-400">
                  {isEdit && existingMedia
                    ? 'A new image will replace the current one on save.'
                    : 'Uploaded after the artwork record is created.'}
                </p>
              </div>
            </div>
          </Section>

          {/* Group 5 — Administrative */}
          <Section number="05" title="Administrative">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Visibility">
                <select
                  value={form.visibility}
                  onChange={(e) => update('visibility', e.target.value as FormState['visibility'])}
                  className="field-input cursor-pointer"
                >
                  {VISIBILITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Price">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  className="field-input"
                  placeholder="Optional"
                  min={0}
                  step="0.01"
                />
              </Field>
            </div>
            <Field label="Copyright">
              <input
                type="text"
                value={form.copyright}
                onChange={(e) => update('copyright', e.target.value)}
                className="field-input"
                placeholder="© Artist Name, 2024"
              />
            </Field>
          </Section>
        </div>

        {/* Actions */}
        <div className="mt-16 flex items-center justify-end gap-3 border-t border-ink-200 pt-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add artwork'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({
  number,
  title,
  note,
  children,
}: {
  number: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="fade-in">
      <div className="flex items-baseline justify-between border-b border-ink-200 pb-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs text-ink-400">{number}</span>
          <h2 className="font-serif text-2xl text-ink-900">{title}</h2>
        </div>
        {note && <span className="text-xs text-ink-400">{note}</span>}
      </div>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="field-label">
        {label}
        {required && <span className="ml-1 text-ink-400 normal-case">required</span>}
      </label>
      {children}
    </div>
  );
}
