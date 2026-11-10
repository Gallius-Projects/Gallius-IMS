import { useState, useMemo } from 'react';
import { ArrowLeftRight, Search, Filter } from 'lucide-react';
import type { Transaction } from '../types/asset';

interface TransactionsPageProps {
  transactions: Transaction[];
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

const ACTION_BG: Record<string, string> = {
  REGISTERED: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  DEPLOYED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  RETURNED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  DONATED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  DISPOSED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  MAINTENANCE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  UPDATED: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  DELETED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const ALL_ACTIONS = ['REGISTERED', 'DEPLOYED', 'RETURNED', 'DONATED', 'DISPOSED', 'MAINTENANCE', 'UPDATED', 'DELETED'];

export function TransactionsPage({ transactions }: TransactionsPageProps) {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        t.assetName.toLowerCase().includes(q) ||
        t.assetTag.toLowerCase().includes(q) ||
        t.notes.toLowerCase().includes(q) ||
        t.performedBy.toLowerCase().includes(q);
      const matchAction = !actionFilter || t.action === actionFilter;
      return matchSearch && matchAction;
    });
  }, [transactions, search, actionFilter]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filtered.forEach(t => {
      const date = new Date(t.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(t);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="page-title">Activity Log</h1>
        <p className="page-subtitle">{transactions.length} total transactions recorded</p>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input pl-9"
            placeholder="Search by asset, tag, notes, or performer..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="form-select w-40"
          >
            <option value="">All Actions</option>
            {ALL_ACTIONS.map(a => (
              <option key={a} value={a}>
                {a.charAt(0) + a.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['DEPLOYED', 'DONATED', 'DISPOSED', 'REGISTERED'].map(action => (
          <div key={action} className="card p-4">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: ACTION_COLORS[action] }}
              />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {action.charAt(0) + action.slice(1).toLowerCase()}
              </p>
            </div>
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {transactions.filter(t => t.action === action).length}
            </p>
          </div>
        ))}
      </div>

      {/* Timeline grouped by date */}
      {Object.keys(grouped).length === 0 ? (
        <div className="card p-10 flex flex-col items-center gap-3" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeftRight size={36} style={{ opacity: 0.3 }} />
          <p className="text-sm">No transactions match your filters.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, txns]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
              <p className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)' }}>
                {date}
              </p>
              <div className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
            </div>

            <div className="space-y-2">
              {txns.map(txn => (
                <div
                  key={txn.id}
                  className="card p-4 flex items-start gap-4 hover:border-purple-200 dark:hover:border-purple-900 transition-all duration-200"
                >
                  {/* Action badge */}
                  <div className="flex-shrink-0 mt-0.5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${ACTION_BG[txn.action] || ACTION_BG.UPDATED}`}>
                      {txn.action}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {txn.assetName}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(txn.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span
                        className="font-mono text-[10px] font-semibold"
                        style={{ color: 'var(--accent)' }}
                      >
                        {txn.assetTag}
                      </span>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        by {txn.performedBy}
                      </span>
                    </div>
                    {txn.notes && (
                      <p className="text-xs mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                        {txn.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
