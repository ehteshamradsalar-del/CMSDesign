import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Upload, ImageIcon, X } from 'lucide-react';
import ErrorBanner from '../components/common/ErrorBanner';
import { api, parseApiError } from '../lib/api';
import { AVAILABILITY_OPTIONS, VISIBILITY_OPTIONS } from '../lib/constants';
import {
  arrayToCommaString,
  commaStringToArray,
  mediaUrl,
  primaryMedia,
} from '../lib/utils';
import { useLang } from '../lib/i18n';
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
  personalNotes: string;
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
    personalNotes: '',
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
  const { t } = useLang();

  const [form, setForm] = useState<FormState>(emptyForm());
  const [collections, setCollections] = useState<Collection[]>([]);
  const [existingMedia, setExistingMedia] = useState<MediaAsset | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api
      .get<Collection[]>('/collections/mine')
      .then((res) => setCollections(res.data ?? []))
      .catch(() => setCollections([]));
  }, []);

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
        personalNotes: a.personalNotes || '',
        keywords: arrayToCommaString(a.keywords),
        themes: arrayToCommaString(a.themes),
        visibility: a.visibility ?? 'PUBLIC',
        price: a.price != null ? String(a.price) : '',
        copyright: a.copyright ?? '',
        collectionId: a.collectionId != null ? String(a.collectionId) : '',
      });
      setExistingMedia(primaryMedia(a));
    } catch (err) {
      setError(parseApiError(err, t('af.errorLoadArtwork')));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

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
      setError(t('af.errorTitle'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const year = form.year ? parseInt(form.year, 10) : null;
    const price = form.price ? parseFloat(form.price) : null;
    if (form.year && (year === null || isNaN(year))) {
      setError(t('af.errorYear'));
      return;
    }
    if (form.price && (price === null || isNaN(price))) {
      setError(t('af.errorPrice'));
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
      personalNotes: form.personalNotes.trim() || null,
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
        <div className="text-[11px] uppercase tracking-widest text-ink-400">{t('protected.loading')}</div>
      </div>
    );
  }

  const currentPreview = filePreview ?? mediaUrl(existingMedia);

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-20 border-b border-ink-200 bg-ink-50/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 sm:px-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('af.backToDashboard')}
          </button>
          <span className="text-[11px] uppercase tracking-widest text-ink-400">
            {isEdit ? t('af.editArtwork') : t('af.newArtwork')}
          </span>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <h1 className="font-serif text-4xl text-ink-900">
          {isEdit ? t('af.editArtwork') : t('af.addArtwork')}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {isEdit ? t('af.editIntro') : t('af.newIntro')}
        </p>

        <div className="mt-8">
          <ErrorBanner message={error} />
        </div>

        <div className="mt-8 space-y-16">
          <Section number="01" title={t('af.section.basics')}>
            <Field label={t('af.title')} required>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className="field-input"
                placeholder={t('af.title')}
              />
            </Field>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label={t('af.year')}>
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
              <Field label={t('af.dimensions')}>
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
              <Field label={t('af.medium')}>
                <input
                  type="text"
                  value={form.medium}
                  onChange={(e) => update('medium', e.target.value)}
                  className="field-input"
                  placeholder={t('af.medium')}
                />
              </Field>
              <Field label={t('af.edition')}>
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
              <Field label={t('af.series')}>
                <input
                  type="text"
                  value={form.series}
                  onChange={(e) => update('series', e.target.value)}
                  className="field-input"
                  placeholder={t('af.series')}
                />
              </Field>
              <Field label={t('af.availability')}>
                <select
                  value={form.availability}
                  onChange={(e) =>
                    update('availability', e.target.value as FormState['availability'])
                  }
                  className="field-input cursor-pointer"
                >
                  {AVAILABILITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {t(o.labelKey)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label={t('af.collection')}>
              <select
                value={form.collectionId}
                onChange={(e) => update('collectionId', e.target.value)}
                className="field-input cursor-pointer"
              >
                <option value="">{t('af.uncategorized')}</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          <Section number="02" title={t('af.section.curatorial')} note={t('af.commaNote')}>
            <Field label={t('af.concepts')}>
              <input
                type="text"
                value={form.concepts}
                onChange={(e) => update('concepts', e.target.value)}
                className="field-input"
                placeholder={t('af.concepts')}
              />
            </Field>
            <Field label={t('af.technique')}>
              <input
                type="text"
                value={form.techniques}
                onChange={(e) => update('techniques', e.target.value)}
                className="field-input"
                placeholder={t('af.technique')}
              />
            </Field>
            <Field label={t('af.materials')}>
              <input
                type="text"
                value={form.materials}
                onChange={(e) => update('materials', e.target.value)}
                className="field-input"
                placeholder={t('af.materials')}
              />
            </Field>
            <Field label={t('af.references')}>
              <input
                type="text"
                value={form.references}
                onChange={(e) => update('references', e.target.value)}
                className="field-input"
                placeholder={t('af.references')}
              />
            </Field>
            <Field label={t('af.personalNotes')}>
              <input
                type="text"
                value={form.personalNotes}
                onChange={(e) => update('personalNotes', e.target.value)}
                className="field-input"
                placeholder={t('af.personalNotes')}
              />
            </Field>
          </Section>

          <Section number="03" title={t('af.section.keywords')} note={t('af.commaNote')}>
            <Field label={t('af.keywords')}>
              <input
                type="text"
                value={form.keywords}
                onChange={(e) => update('keywords', e.target.value)}
                className="field-input"
                placeholder={t('af.keywords')}
              />
            </Field>
            <Field label={t('af.themes')}>
              <input
                type="text"
                value={form.themes}
                onChange={(e) => update('themes', e.target.value)}
                className="field-input"
                placeholder={t('af.themes')}
              />
            </Field>
          </Section>

          <Section number="04" title={t('af.section.image')}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="relative aspect-[4/5] w-40 flex-shrink-0 overflow-hidden rounded-sm bg-ink-100 ring-1 ring-ink-200/60">
                {currentPreview ? (
                  <img src={currentPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-ink-300">
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-[10px] uppercase tracking-widest">{t('af.noImage')}</span>
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
                    <button type="button" onClick={clearFile} className="icon-btn" aria-label={t('af.removeFile')}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="artwork-image"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-ink-300 bg-white px-4 py-6 text-sm text-ink-500 transition-colors hover:border-ink-900 hover:text-ink-900"
                  >
                    <Upload className="h-4 w-4" />
                    {isEdit && existingMedia ? t('af.replaceImage') : t('af.chooseImage')}
                  </label>
                )}
                <p className="mt-2 text-xs text-ink-400">
                  {isEdit && existingMedia ? t('af.imageHelperEdit') : t('af.imageHelperNew')}
                </p>
              </div>
            </div>
          </Section>

          <Section number="05" title={t('af.section.admin')}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label={t('af.title')}>
                <select
                  value={form.visibility}
                  onChange={(e) => update('visibility', e.target.value as FormState['visibility'])}
                  className="field-input cursor-pointer"
                >
                  {VISIBILITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {t(o.labelKey)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t('af.price')}>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  className="field-input"
                  placeholder={t('af.pricePlaceholder')}
                  min={0}
                  step="0.01"
                />
              </Field>
            </div>
            <Field label={t('af.copyright')}>
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

        <div className="mt-16 flex items-center justify-end gap-3 border-t border-ink-200 pt-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
            disabled={saving}
          >
            {t('af.cancel')}
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? t('af.saving') : isEdit ? t('af.saveChanges') : t('af.addArtwork')}
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
        {required && <span className="ml-1 text-ink-400 normal-case">{('cf.required')}</span>}
      </label>
      {children}
    </div>
  );
}
