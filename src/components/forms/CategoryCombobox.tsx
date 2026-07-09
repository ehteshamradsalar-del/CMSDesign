import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { MEDIA_CATEGORIES } from '../../lib/constants';
import type { MediaCategory } from '../../lib/types';
import { classNames } from '../../lib/utils';

interface Props {
  value: MediaCategory | null;
  onChange: (value: MediaCategory | null) => void;
  id?: string;
  placeholder?: string;
}

export default function CategoryCombobox({ value, onChange, id, placeholder }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = value ? MEDIA_CATEGORIES.find((c) => c.value === value)?.label ?? '' : '';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MEDIA_CATEGORIES;
    return MEDIA_CATEGORIES.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlight(value ? filtered.findIndex((c) => c.value === value) : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function commit(item: { value: MediaCategory; label: string } | null) {
    onChange(item?.value ?? null);
    setOpen(false);
    setQuery('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlight >= 0 && highlight < filtered.length) {
        commit(filtered[highlight]);
      }
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder ?? 'Select a medium…'}
        value={open ? query : selectedLabel}
        onChange={(e) => {
          if (!open) setOpen(true);
          setQuery(e.target.value);
          setHighlight(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="field-input cursor-default pr-9"
        role="combobox"
        aria-expanded={open}
        aria-controls="category-listbox"
        aria-autocomplete="list"
      />
      <ChevronDown
        className={classNames(
          'pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400 transition-transform duration-200',
          open && 'rotate-180'
        )}
      />
      {open && (
        <div className="fade-in absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-sm border border-ink-200 bg-white py-1 shadow-lg">
          {filtered.length === 0 ? (
            <div className="px-3.5 py-2 text-sm text-ink-400">No matching categories</div>
          ) : (
            <ul id="category-listbox" role="listbox">
              {filtered.map((item, i) => (
                <li
                  key={item.value}
                  role="option"
                  aria-selected={item.value === value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    commit(item);
                  }}
                  onMouseEnter={() => setHighlight(i)}
                  className={classNames(
                    'flex cursor-pointer items-center justify-between px-3.5 py-2 text-sm transition-colors',
                    i === highlight ? 'bg-ink-100 text-ink-900' : 'text-ink-700'
                  )}
                >
                  <span>{item.label}</span>
                  {item.value === value && <Check className="h-3.5 w-3.5 text-ink-900" />}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
