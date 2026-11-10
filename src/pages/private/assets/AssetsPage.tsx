import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Asset } from '../../../types/asset';
import { CATEGORY_LIST, STATUS_LIST } from '../../../types/asset';
import { StatusBadge, ConditionBadge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { AssetForm } from '../../../components/AssetForm';

interface AssetsPageProps {
  assets: Asset[];
  onAdd: (asset: Asset) => void;
  onUpdate: (updated: Asset, old: Asset) => void;
  onDelete: (id: string) => void;
}

const PAGE_SIZE = 10;

export function AssetsPage({ assets, onAdd, onUpdate, onDelete }: AssetsPageProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.assetTag.toLowerCase().includes(q) ||
        a.serialNumber.toLowerCase().includes(q) ||
        (a.assignedTo ?? '').toLowerCase().includes(q);
      const matchStatus = !statusFilter || a.status === statusFilter;
      const matchCat = !categoryFilter || a.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [assets, search, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = () => {
    setEditingAsset(null);
    setModalOpen(true);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAsset) {
      const updated: Asset = {
        ...editingAsset,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      onUpdate(updated, editingAsset);
    } else {
      const newAsset: Asset = {
        ...data,
        id: `asset-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAdd(newAsset);
    }
    setModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="page-title">Assets</h1>
          <p className="page-subtitle">{assets.length} total assets registered</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex-shrink-0">
          <Plus size={16} />
          Add Asset
        </button>
      </div>

      {/* Filters */}
      {/* <div className="card flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1 border-2">
          <Search
            size={15}
            className="absolute top-1/2 left-3 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="form-input pl-9"
            placeholder="Search by name, tag, serial, assignee..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="form-select w-32"
          >
            <option value="">All Status</option>
            {STATUS_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="form-select w-36"
          >
            <option value="">All Categories</option>
            {CATEGORY_LIST.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div> */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search hostname, serial #, description, remarks, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Filters Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="form-select w-36"
            >
              <option value="">All Categories</option>
              {CATEGORY_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="form-select w-32"
            >
              <option value="">All Status</option>
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Name</th>
                <th>Category</th>
                <th>Condition</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Location</th>
                <th>Value</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-12 text-center"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search size={28} style={{ opacity: 0.3 }} />
                      <p className="text-sm">No assets found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((asset) => (
                  <tr
                    key={asset.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/assets/${asset.id}`)}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <span
                        className="font-mono text-xs font-semibold"
                        style={{ color: 'var(--accent)' }}
                      >
                        {asset.assetTag}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {asset.name}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {asset.serialNumber}
                        </p>
                      </div>
                    </td>
                    <td>{asset.category}</td>
                    <td>
                      <ConditionBadge condition={asset.condition} size="sm" />
                    </td>
                    <td>
                      <StatusBadge status={asset.status} size="sm" />
                    </td>
                    <td>
                      {asset.assignedTo ? (
                        <div>
                          <p
                            className="text-xs font-medium"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {asset.assignedTo}
                          </p>
                          {asset.department && (
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {asset.department}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="text-xs">{asset.location}</span>
                    </td>
                    <td>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        ${asset.purchasePrice.toLocaleString()}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => navigate(`/assets/${asset.id}`)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200"
                          style={{ color: 'var(--text-muted)' }}
                          title="View details"
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                            (e.currentTarget as HTMLElement).style.backgroundColor =
                              'var(--accent-light)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          }}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleEdit(asset)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200"
                          style={{ color: 'var(--text-muted)' }}
                          title="Edit asset"
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                            (e.currentTarget as HTMLElement).style.backgroundColor =
                              'var(--accent-light)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(asset.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200"
                          style={{ color: 'var(--text-muted)' }}
                          title="Delete asset"
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = '#ef4444';
                            (e.currentTarget as HTMLElement).style.backgroundColor =
                              'rgba(239,68,68,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between border-t px-4 py-3"
            style={{ borderColor: 'var(--border)' }}
          >
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
              {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-7 w-7 items-center justify-center rounded transition-all duration-200 disabled:opacity-30"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="flex h-7 w-7 items-center justify-center rounded text-xs font-medium transition-all duration-200"
                  style={
                    p === page
                      ? {
                          backgroundColor: 'var(--accent)',
                          color: 'white',
                          border: '1px solid var(--accent)',
                        }
                      : { border: '1px solid var(--border)', color: 'var(--text-muted)' }
                  }
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded transition-all duration-200 disabled:opacity-30"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAsset ? 'Edit Asset' : 'Register New Asset'}
        size="lg"
      >
        <AssetForm
          initialData={editingAsset}
          existingTags={assets.map((a) => a.assetTag).filter((t) => t !== editingAsset?.assetTag)}
          existingSerials={assets
            .map((a) => a.serialNumber)
            .filter((s) => s !== editingAsset?.serialNumber)}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Are you sure you want to delete{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {assets.find((a) => a.id === deleteConfirmId)?.name}
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteConfirmId(null)} className="btn-ghost">
              Cancel
            </button>
            <button onClick={handleDeleteConfirm} className="btn-danger">
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
