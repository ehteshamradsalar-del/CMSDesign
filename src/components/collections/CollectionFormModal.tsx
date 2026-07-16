import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import CategoryCombobox from '../forms/CategoryCombobox';
import ErrorBanner from '../common/ErrorBanner';
import { VISIBILITY_OPTIONS } from '../../lib/constants';
import { parseApiError } from '../../lib/auth';
import { api } from '../../lib/api';
import { useLang } from '../../lib/i18n';
import type { Collection, MediaCategory, Visibility } from '../../lib/types';

interface Props {
  open: boolean;
  collection: Collection | null;
  onClose: () => void;
  onSaved: (collection: Collection) => void;
}

interface FormState {
  name: string;
  category: MediaCategory | null;
  statement: string;
  startYear: string;
  endYear: string;
  visibility: Visibility;
}

export default function CollectionFormModal({ open, collection, onClose, onSaved }: Props) {
  const { t } = useLang();
  const [form, setForm] = useState<FormState>(emptyForm());
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEdit = collection !== null;

  useEffect(() => {
    if (open) {
      setError(null);
      setForm(
        collection
          ? {
              name: collection.name,
              category: collection.category,
              statement: collection.statement ?? '',
              startYear: collection.startYear != null ? String(collection.startYear) : '',
              endYear: collection.endYear != null ? String(collection.endYear) : '',
              visibility: collection.visibility,
            }
          : emptyForm()
      );
    }
  }, [open, collection]);

  if (!open) return null;

  function update<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError(t('cf.errorName'));
      return;
    }

    const startYear = form.startYear ? parseInt(form.startYear, 10) : null;
    const endYear = form.endYear ? parseInt(form.endYear, 10) : null;
    if (form.startYear && (startYear === null || isNaN(startYear))) {
      setError(t('cf.errorStartYear'));
      return;
    }
    if (form.endYear && (endYear === null || isNaN(endYear))) {
      setError(t('cf.errorEndYear'));
      return;
    }

    const payload = {
      name: form.name.trim(),
      statement: form.statement.trim() || null,
      startYear,
      endYear,
      visibility: form.visibility,
      category: form.category,
    };

    setSaving(true);
    try {
      if (isEdit && collection) {
        const res = await api.put<Collection>(`/collections/${collection.id}`, payload);
        onSaved(res.data);
      } else {
        const res = await api.post<Collection>('/collections', payload);
        onSaved(res.data);
      }
      onClose();
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 px-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="fade-in-up w-full max-w-lg overflow-hidden rounded-sm border border-ink-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="font-serif text-2xl text-ink-900">{isEdit ? t('cf.editTitle') : t('cf.newTitle')}</h2>
          <button onClick={onClose} className="icon-btn" aria-label={t('dialog.close')}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <ErrorBanner message={error} />
          <div className={error ? 'mt-4' : ''}>
            <div className="mb-5">
              <label htmlFor="col-name" className="field-label">
                {t('cf.name')} <span className="text-ink-400 normal-case">{t('cf.required')}</span>
              </label>
              <input
                id="col-name"
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="field-input"
                placeholder={t('cf.namePlaceholder')}
                autoFocus
              />
            </div>

            <div className="mb-5">
              <label className="field-label">{t('cf.category')}</label>
              <CategoryCombobox
                value={form.category}
                onChange={(v) => update('category', v)}
                placeholder={t('combo.placeholder')}
              />
              <p className="mt-1.5 text-xs text-ink-400">{t('cf.categoryHelper')}</p>
            </div>

            <div className="mb-5">
              <label htmlFor="col-statement" className="field-label">
                {t('cf.statement')}
              </label>
              <textarea
                id="col-statement"
                value={form.statement}
                onChange={(e) => update('statement', e.target.value)}
                rows={4}
                className="field-input resize-none leading-relaxed"
                placeholder={t('cf.statementPlaceholder')}
              />
            </div>

            <div className="mb-5 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="col-start" className="field-label">
                  {t('cf.startYear')}
                </label>
                <input
                  id="col-start"
                  type="number"
                  value={form.startYear}
                  onChange={(e) => update('startYear', e.target.value)}
                  className="field-input"
                  placeholder={t('cf.startYearPlaceholder')}
                  min={0}
                  max={new Date().getFullYear() + 50}
                />
              </div>
              <div>
                <label htmlFor="col-end" className="field-label">
                  {t('cf.endYear')}
                </label>
                <input
                  id="col-end"
                  type="number"
                  value={form.endYear}
                  onChange={(e) => update('endYear', e.target.value)}
                  className="field-input"
                  placeholder={t('cf.endYearPlaceholder')}
                  min={0}
                  max={new Date().getFullYear() + 50}
                />
              </div>
            </div>

            <div>
              <label htmlFor="col-visibility" className="field-label">
                {t('cf.visibility')}
              </label>
              <select
                id="col-visibility"
                value={form.visibility}
                onChange={(e) => update('visibility', e.target.value as Visibility)}
                className="field-input cursor-pointer"
              >
                {VISIBILITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {t(o.labelKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
        <div className="flex justify-end gap-3 border-t border-ink-100 px-6 py-4">
          <button onClick={onClose} className="btn-secondary" disabled={saving}>
            {t('cf.cancel')}
          </button>
          <button onClick={handleSubmit} className="btn-primary" disabled={saving}>
            {saving ? t('cf.saving') : isEdit ? t('cf.saveChanges') : t('cf.createCollection')}
          </button>
        </div>
      </div>
    </div>
  );
}

function emptyForm(): FormState {
  return {
    name: '',
    category: null,
    statement: '',
    startYear: '',
    endYear: '',
    visibility: 'PUBLIC',
  };
}
