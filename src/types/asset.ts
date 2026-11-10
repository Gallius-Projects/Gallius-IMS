// ─── Asset Status ────────────────────────────────────────────────────────────
export type AssetStatus = 'Spare' | 'Deployed' | 'Defective' | 'Donated' | 'Disposed';

// ─── Asset Condition ─────────────────────────────────────────────────────────
export type AssetCondition = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Broken';

// ─── Asset Category ──────────────────────────────────────────────────────────
// export type AssetCategory =
//   | 'Laptop'
//   | 'Desktop'
//   | 'Monitor'
//   | 'Printer'
//   | 'Server'
//   | 'Networking'
//   | 'Mobile'
//   | 'Peripheral'
//   | 'Software'
//   | 'Furniture'
//   | 'Other';

// ─── Transaction Action ───────────────────────────────────────────────────────
export type TransactionAction =
  | 'REGISTERED'
  | 'DEPLOYED'
  | 'RETURNED'
  | 'DONATED'
  | 'DISPOSED'
  | 'MAINTENANCE'
  | 'UPDATED'
  | 'DELETED';

// ─── Main Asset Entity ────────────────────────────────────────────────────────
export interface Asset {
  id: string;
  name: string;
  serialNumber: string;
  assetTag: string;
  category: AssetCategory;
  purchasePrice: number;
  purchaseDate: string;
  condition: AssetCondition;
  status: AssetStatus;
  assignedTo?: string;
  department?: string;
  location: string;
  description: string;
  vendor?: string;
  warrantyExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Transaction / Activity Log ───────────────────────────────────────────────
export interface Transaction {
  id: string;
  assetId: string;
  assetName: string;
  assetTag: string;
  action: TransactionAction;
  performedBy: string;
  date: string;
  notes: string;
}

// ─── Dashboard Filter ─────────────────────────────────────────────────────────
export type StatusFilter = 'All' | AssetStatus;

// ─── Status color mapping ─────────────────────────────────────────────────────
export const STATUS_COLORS: Record<AssetStatus, string> = {
  Spare: '#10B981',
  Deployed: '#3B82F6',
  Defective: '#3B82F6',
  Donated: '#F59E0B',
  Disposed: '#EF4444',
};

export const STATUS_BG: Record<AssetStatus, string> = {
  Spare: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Deployed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Defective: 'bg-red-400 text-red-100 dark:bg-red-900/30 dark:text-red-400',
  Donated: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Disposed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const CONDITION_BG: Record<AssetCondition, string> = {
  Excellent: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Good: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  Fair: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Poor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Broken: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
};

// export const CATEGORY_LIST: AssetCategory[] = [
//   'Laptop',
//   'Desktop',
//   'Monitor',
//   'Printer',
//   'Server',
//   'Networking',
//   'Mobile',
//   'Peripheral',
//   'Software',
//   'Furniture',
//   'Other',
// ];
export const STATUS_LIST: AssetStatus[] = ['Spare', 'Deployed', 'Defective', 'Donated', 'Disposed'];
export const CONDITION_LIST: AssetCondition[] = ['Excellent', 'Good', 'Fair', 'Poor', 'Broken'];
