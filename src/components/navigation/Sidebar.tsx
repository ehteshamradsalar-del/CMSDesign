import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Pencil, Trash2, Plus, FolderOpen, Archive } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useGroupCollectionsByCategory } from '../../lib/utils';
import { useLang } from '../../lib/i18n';
import type { Collection } from '../../lib/types';

interface Props {
  collections: Collection[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onNew: () => void;
  onEdit: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
}

export default function Sidebar({
  collections,
  selectedId,
  onSelect,
  onNew,
  onEdit,
  onDelete,
}: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLang();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const groupCollectionsByCategory = useGroupCollectionsByCategory();
  const groups = groupCollectionsByCategory(collections);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside className="flex h-full w-full flex-col border-r border-ink-200 bg-white">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Archive className="h-5 w-5 text-ink-900" />
        <span className="font-serif text-xl tracking-tight text-ink-900">{t('sidebar.brand')}</span>
      </div>

      {/* Artist identity */}
      <div className="border-y border-ink-100 px-5 py-4">
        <div className="text-[11px] uppercase tracking-widest text-ink-400">{t('sidebar.artist')}</div>
        <div className="mt-1 truncate font-serif text-lg text-ink-900">{user?.name ?? '—'}</div>
        <div className="truncate text-xs text-ink-500">{user?.email}</div>
      </div>

      {/* Collections list */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="px-2 pb-2 text-[11px] uppercase tracking-widest text-ink-400">{t('sidebar.collections')}</div>
        {groups.length === 0 ? (
          <div className="px-2 py-6 text-center">
            <FolderOpen className="mx-auto h-6 w-6 text-ink-300" />
            <p className="mt-2 text-sm text-ink-400">{t('sidebar.noCollections')}</p>
          </div>
        ) : (
          <nav className="space-y-5">
            {groups.map((group) => (
              <div key={group.label}>
                <div className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-widest text-ink-400">
                  {group.label}
                </div>
                <ul className="space-y-0.5">
                  {group.collections.map((c) => {
                    const isSelected = c.id === selectedId;
                    const isHovered = hoveredId === c.id;
                    return (
                      <li key={c.id}>
                        <div
                          onMouseEnter={() => setHoveredId(c.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          className={cx(
                            'group flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 transition-colors',
                            isSelected ? 'bg-ink-900 text-ink-50' : 'text-ink-700 hover:bg-ink-100'
                          )}
                          onClick={() => onSelect(c.id)}
                        >
                          <span className="truncate text-sm">{c.name}</span>
                          <span className="ml-2 flex flex-shrink-0 items-center gap-1">
                            <span
                              className={cx(
                                'text-[11px] tabular-nums',
                                isSelected ? 'text-ink-400' : 'text-ink-400'
                              )}
                            >
                              {c.artworks?.length ?? 0}
                            </span>
                            {isHovered && (
                              <span className="flex items-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(c);
                                  }}
                                  className={cx(
                                    'inline-flex h-5 w-5 items-center justify-center rounded-sm transition-colors',
                                    isSelected ? 'text-ink-300 hover:bg-ink-800 hover:text-ink-50' : 'text-ink-400 hover:bg-ink-200 hover:text-ink-900'
                                  )}
                                  aria-label={t('sidebar.editCollection')}
                                  title={t('sidebar.editCollection')}
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(c);
                                  }}
                                  className={cx(
                                    'inline-flex h-5 w-5 items-center justify-center rounded-sm transition-colors',
                                    isSelected ? 'text-ink-300 hover:bg-ink-800 hover:text-red-300' : 'text-ink-400 hover:bg-red-50 hover:text-red-600'
                                  )}
                                  aria-label={t('sidebar.deleteCollection')}
                                  title={t('sidebar.deleteCollection')}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </span>
                            )}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Footer actions */}
      <div className="border-t border-ink-100 px-3 py-3">
        <button
          onClick={onNew}
          className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900"
        >
          <Plus className="h-4 w-4" />
          {t('sidebar.newCollection')}
        </button>
        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
        >
          <LogOut className="h-4 w-4" />
          {t('sidebar.logOut')}
        </button>
      </div>
    </aside>
  );
}

function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
