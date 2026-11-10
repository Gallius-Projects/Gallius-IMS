import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  MapPin,
  Tag,
  User,
  Building2,
  Calendar,
  DollarSign,
  Shield,
  Package,
  ClipboardList,
} from 'lucide-react';
import type { Asset, Transaction } from '../../../types/asset';
import { StatusBadge, ConditionBadge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { AssetForm } from '../../../components/AssetForm';

interface AssetDetailPageProps {
  assets: Asset[];
  transactions: Transaction[];
  onUpdate: (updated: Asset, old: Asset) => void;
  onDelete: (id: string) => void;
}

const ACTION_COLORS: Record<string, string> = {
  REGISTERED: '#8B5CF6',
  DEPLOYED: '#3B82F6',
  RETURNED: '#10B981',
  DONATED: '#F59E0B',
  DISPOSED: '#EF4444',
  MAINTENANCE: '#F97316',
  UPDATED: '#6B7280',
  DELETED: '#EF4444',
};

export function AssetDetailPage({
  assets,
  transactions,
  onUpdate,
  onDelete,
}: AssetDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const asset = assets.find((a) => a.id === id);
  const assetTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.assetId === id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions, id],
  );

  if (!asset) {
    return (
      <div
        className="flex h-64 flex-col items-center justify-center gap-3"
        style={{ color: 'var(--text-muted)' }}
      >
        <Package size={40} style={{ opacity: 0.3 }} />
        <p>Asset not found.</p>
        <button onClick={() => navigate('/assets')} className="btn-primary">
          <ArrowLeft size={14} />
          Back to Assets
        </button>
      </div>
    );
  }

  const handleSave = (data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const updated: Asset = {
      ...asset,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updated, asset);
    setEditOpen(false);
  };

  const handleDelete = () => {
    onDelete(asset.id);
    navigate('/assets');
  };

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value?: string;
  }) =>
    value ? (
      <div
        className="flex items-start gap-3 border-b py-2.5"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }}>
          {icon}
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {label}
          </p>
          <p className="mt-0.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
        </div>
      </div>
    ) : null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/assets')}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
            (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-light)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="page-title truncate">{asset.name}</h1>
          <p className="page-subtitle">
            {asset.assetTag} &bull; {asset.serialNumber}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setEditOpen(true)} className="btn-ghost">
            <Pencil size={14} />
            Edit
          </button>
          <button onClick={() => setDeleteOpen(true)} className="btn-danger">
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left: Asset Info */}
        <div className="space-y-4 lg:col-span-2">
          {/* Overview card */}
          <div className="card p-5">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                >
                  <Package size={22} />
                </div>
                <div>
                  <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {asset.name}
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {asset.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ConditionBadge condition={asset.condition} />
                <StatusBadge status={asset.status} />
              </div>
            </div>

            {asset.description && (
              <p
                className="mb-4 border-b pb-4 text-sm"
                style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
              >
                {asset.description}
              </p>
            )}

            <div className="space-y-0.5">
              <InfoRow icon={<Tag size={15} />} label="Asset Tag" value={asset.assetTag} />
              <InfoRow
                icon={<ClipboardList size={15} />}
                label="Serial Number"
                value={asset.serialNumber}
              />
              <InfoRow icon={<MapPin size={15} />} label="Location" value={asset.location} />
              <InfoRow icon={<User size={15} />} label="Assigned To" value={asset.assignedTo} />
              <InfoRow icon={<Building2 size={15} />} label="Department" value={asset.department} />
              <InfoRow icon={<Package size={15} />} label="Vendor" value={asset.vendor} />
              <InfoRow
                icon={<DollarSign size={15} />}
                label="Purchase Price"
                value={`$${asset.purchasePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              />
              <InfoRow
                icon={<Calendar size={15} />}
                label="Purchase Date"
                value={new Date(asset.purchaseDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              />
              {asset.warrantyExpiry && (
                <InfoRow
                  icon={<Shield size={15} />}
                  label="Warranty Expiry"
                  value={new Date(asset.warrantyExpiry).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Activity Timeline
          </h3>
          {assetTransactions.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              No activity recorded.
            </p>
          ) : (
            <div className="relative space-y-0">
              {/* Vertical line */}
              <div
                className="absolute top-0 bottom-0 left-3 w-px"
                style={{ backgroundColor: 'var(--border)' }}
              />
              {assetTransactions.map((txn, i) => (
                <div key={txn.id} className="relative pb-5 pl-9">
                  {/* Dot */}
                  <div
                    className="absolute left-0 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ backgroundColor: ACTION_COLORS[txn.action] || '#6B7280' }}
                  >
                    {txn.action.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {txn.action.charAt(0) + txn.action.slice(1).toLowerCase()}
                    </p>
                    <p className="mt-0.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {new Date(txn.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      &bull; {txn.performedBy}
                    </p>
                    {txn.notes && (
                      <p className="mt-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        {txn.notes}
                      </p>
                    )}
                  </div>
                  {i < assetTransactions.length - 1 && <div className="mt-1" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Asset" size="lg">
        <AssetForm
          initialData={asset}
          existingTags={assets.map((a) => a.assetTag).filter((t) => t !== asset.assetTag)}
          existingSerials={assets
            .map((a) => a.serialNumber)
            .filter((s) => s !== asset.serialNumber)}
          onSave={handleSave}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>

      {/* Delete Confirm */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Are you sure you want to permanently delete{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{asset.name}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button onClick={handleDelete} className="btn-danger">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
