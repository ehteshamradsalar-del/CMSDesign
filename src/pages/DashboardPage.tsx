import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, ImageIcon, Lock, Globe } from 'lucide-react';
import Sidebar from '../components/navigation/Sidebar';
import ArtworkCard from '../components/artwork/ArtworkCard';
import CollectionFormModal from '../components/collections/CollectionFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ErrorBanner from '../components/common/ErrorBanner';
import { api, parseApiError } from '../lib/api';
import type { Artwork, Collection } from '../lib/types';
import { categoryLabel, formatYearRange } from '../lib/utils';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [confirmCollection, setConfirmCollection] = useState<Collection | null>(null);
  const [confirmArtwork, setConfirmArtwork] = useState<Artwork | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Collection[]>('/collections/mine');
      const list = res.data ?? [];
      setCollections(list);
      setSelectedId((prev) => {
        if (prev != null && list.some((c) => c.id === prev)) return prev;
        return list[0]?.id ?? null;
      });
    } catch (err) {
      setError(parseApiError(err, 'Could not load your collections.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const selected = collections.find((c) => c.id === selectedId) ?? null;

  function handleNewCollection() {
    setEditingCollection(null);
    setModalOpen(true);
  }

  function handleEditCollection(c: Collection) {
    setEditingCollection(c);
    setModalOpen(true);
  }

  function handleSavedCollection(saved: Collection) {
    setCollections((prev) => {
      const exists = prev.some((c) => c.id === saved.id);
      const next = exists
        ? prev.map((c) => (c.id === saved.id ? { ...c, ...saved, artworks: c.artworks } : c))
        : [...prev, saved];
      return next;
    });
    setSelectedId(saved.id);
  }

  async function handleDeleteCollection(c: Collection) {
    setDeleting(true);
    try {
      await api.delete(`/collections/${c.id}`);
      setCollections((prev) => prev.filter((x) => x.id !== c.id));
      if (selectedId === c.id) {
        const remaining = collections.filter((x) => x.id !== c.id);
        setSelectedId(remaining[0]?.id ?? null);
      }
      setConfirmCollection(null);
    } catch (err) {
      setConfirmCollection(null);
      setError(parseApiError(err, 'Could not delete this collection.'));
    } finally {
      setDeleting(false);
    }
  }

  async function handleDeleteArtwork(a: Artwork) {
    setDeleting(true);
    try {
      await api.delete(`/artworks/${a.id}`);
      setCollections((prev) =>
        prev.map((c) => ({
          ...c,
          artworks: (c.artworks ?? []).filter((x) => x.id !== a.id),
        }))
      );
      setConfirmArtwork(null);
    } catch (err) {
      setConfirmArtwork(null);
      setError(parseApiError(err, 'Could not delete this artwork.'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-ink-50">
      {/* Sidebar — fixed on desktop, drawer on mobile */}
      <div className="hidden w-72 flex-shrink-0 md:flex">
        <Sidebar
          collections={collections}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onNew={handleNewCollection}
          onEdit={handleEditCollection}
          onDelete={setConfirmCollection}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-14">
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-[11px] uppercase tracking-widest text-ink-400">Loading</div>
            </div>
          ) : error ? (
            <div className="max-w-xl">
              <ErrorBanner message={error} />
              <button onClick={loadCollections} className="btn-secondary mt-4">
                Try again
              </button>
            </div>
          ) : !selected ? (
            <EmptyState onNew={handleNewCollection} />
          ) : (
            <CollectionDetail
              collection={selected}
              onEdit={() => handleEditCollection(selected)}
              onAddArtwork={() => navigate(`/artworks/new?collectionId=${selected.id}`)}
              onArtworkClick={(a) => navigate(`/artworks/${a.id}/edit`)}
              onArtworkDelete={setConfirmArtwork}
            />
          )}
        </div>
      </main>

      <CollectionFormModal
        open={modalOpen}
        collection={editingCollection}
        onClose={() => setModalOpen(false)}
        onSaved={handleSavedCollection}
      />

      <ConfirmDialog
        open={confirmCollection !== null}
        title="Delete collection"
        message={
          confirmCollection
            ? `“${confirmCollection.name}” and all ${confirmCollection.artworks?.length ?? 0} artwork(s) within it will be permanently removed. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete collection"
        destructive
        onConfirm={() => confirmCollection && handleDeleteCollection(confirmCollection)}
        onCancel={() => setConfirmCollection(null)}
      />

      <ConfirmDialog
        open={confirmArtwork !== null}
        title="Delete artwork"
        message={
          confirmArtwork
            ? `“${confirmArtwork.title}” will be permanently removed from this collection. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete artwork"
        destructive
        onConfirm={() => confirmArtwork && handleDeleteArtwork(confirmArtwork)}
        onCancel={() => setConfirmArtwork(null)}
      />

      {deleting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/30 backdrop-blur-sm">
          <div className="text-[11px] uppercase tracking-widest text-ink-50">Deleting…</div>
        </div>
      )}
    </div>
  );
}

function CollectionDetail({
  collection,
  onEdit,
  onAddArtwork,
  onArtworkClick,
  onArtworkDelete,
}: {
  collection: Collection;
  onEdit: () => void;
  onAddArtwork: () => void;
  onArtworkClick: (a: Artwork) => void;
  onArtworkDelete: (a: Artwork) => void;
}) {
  const yearRange = formatYearRange(collection.startYear, collection.endYear);
  const artworks = collection.artworks ?? [];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-widest text-ink-400">
            {categoryLabel(collection.category)}
          </div>
          <h1 className="mt-1.5 font-serif text-4xl leading-tight text-ink-900 text-balance">
            {collection.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
            {yearRange && <span className="tabular-nums">{yearRange}</span>}
            <span className="inline-flex items-center gap-1.5">
              {collection.visibility === 'PRIVATE' ? (
                <>
                  <Lock className="h-3.5 w-3.5" /> Private
                </>
              ) : (
                <>
                  <Globe className="h-3.5 w-3.5" /> Public
                </>
              )}
            </span>
          </div>
        </div>
        <button onClick={onEdit} className="btn-secondary">
          <Pencil className="h-4 w-4" />
          Edit collection
        </button>
      </div>

      {collection.statement && (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-600">{collection.statement}</p>
      )}

      {/* Artworks */}
      <div className="mt-12">
        <div className="flex items-center justify-between border-b border-ink-200 pb-3">
          <h2 className="text-[11px] uppercase tracking-widest text-ink-500">
            Artworks <span className="text-ink-400">({artworks.length})</span>
          </h2>
          <button onClick={onAddArtwork} className="btn-ghost -mr-2">
            <Plus className="h-4 w-4" />
            Add artwork
          </button>
        </div>

        {artworks.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-sm border border-dashed border-ink-200 py-20 text-center">
            <ImageIcon className="h-8 w-8 text-ink-300" />
            <p className="mt-3 text-sm text-ink-500">No artworks in this collection yet.</p>
            <button onClick={onAddArtwork} className="btn-secondary mt-5">
              <Plus className="h-4 w-4" />
              Add your first artwork
            </button>
          </div>
        ) : (
          <div className="stagger mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((a) => (
              <ArtworkCard
                key={a.id}
                artwork={a}
                onClick={onArtworkClick}
                onDelete={onArtworkDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="fade-in flex h-[70vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-100">
        <ImageIcon className="h-7 w-7 text-ink-400" />
      </div>
      <h2 className="mt-6 font-serif text-3xl text-ink-900">Your archive is empty</h2>
      <p className="mt-2 max-w-sm text-sm text-ink-500">
        Create your first collection to begin organizing your work by medium and series.
      </p>
      <button onClick={onNew} className="btn-primary mt-6">
        <Plus className="h-4 w-4" />
        New collection
      </button>
    </div>
  );
}
