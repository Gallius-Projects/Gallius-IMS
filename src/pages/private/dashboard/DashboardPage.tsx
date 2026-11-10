import { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { Package, Rocket, Archive, Gift, Trash2, TrendingUp } from 'lucide-react';
import type { Asset, StatusFilter } from '../../../types/asset';
import { STATUS_COLORS, STATUS_LIST } from '../../../types/asset';
import { StatCard } from '../../../components/ui/StatCard';
import { StatusBadge } from '../../../components/ui/Badge';

interface DashboardPageProps {
  assets: Asset[];
}

const ALL_STATUS_FILTERS: StatusFilter[] = ['All', ...STATUS_LIST];

// Custom tooltip for recharts
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        {label && <p className="mb-1 text-xs font-semibold">{label}</p>}
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs">
            <span
              className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span style={{ color: 'var(--text-muted)' }}>{entry.name}:</span>
            <span className="font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function PieCustomLabel(props: PieLabelRenderProps) {
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const midAngle = Number(props.midAngle ?? 0);
  const innerRadius = Number(props.innerRadius ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const percent = Number(props.percent ?? 0);
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function DashboardPage({ assets }: DashboardPageProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const filteredAssets = useMemo(
    () => (statusFilter === 'All' ? assets : assets.filter((a) => a.status === statusFilter)),
    [assets, statusFilter],
  );

  // Status counts
  const counts = useMemo(() => {
    const c = { Deployed: 0, Spare: 0, Donated: 0, Disposed: 0 };
    assets.forEach((a) => c[a.status]++);
    return c;
  }, [assets]);

  // Pie chart data
  const pieData = useMemo(() => {
    if (statusFilter === 'All') {
      return STATUS_LIST.filter((s) => counts[s] > 0).map((s) => ({
        name: s,
        value: counts[s],
      }));
    }
    return [{ name: statusFilter, value: counts[statusFilter as keyof typeof counts] || 0 }];
  }, [statusFilter, counts]);

  // Bar chart — assets by category (filtered)
  const barData = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    filteredAssets.forEach((a) => {
      categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;
    });
    return Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredAssets]);

  // Line chart — assets registered over last 12 months
  const lineData = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      months[key] = 0;
    }
    filteredAssets.forEach((a) => {
      const d = new Date(a.createdAt);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (key in months) months[key]++;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [filteredAssets]);

  // Recent assets
  const recentAssets = useMemo(
    () =>
      [...filteredAssets]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [filteredAssets],
  );

  const totalValue = useMemo(
    () => filteredAssets.reduce((sum, a) => sum + a.purchasePrice, 0),
    [filteredAssets],
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Overview of {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''}
            {statusFilter !== 'All' ? ` with status: ${statusFilter}` : ' across all statuses'}
          </p>
        </div>
        {/* Status filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          {ALL_STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`filter-pill ${statusFilter === s ? 'active' : ''}`}
              style={
                statusFilter === s
                  ? {}
                  : s !== 'All'
                    ? {
                        borderColor: STATUS_COLORS[s as keyof typeof STATUS_COLORS] + '44',
                        color: STATUS_COLORS[s as keyof typeof STATUS_COLORS],
                      }
                    : {}
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard
          title="Total Assets"
          value={filteredAssets.length}
          icon={<Package size={20} />}
          color="#7C3AED"
          subtitle={`$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} total value`}
        />
        <StatCard
          title="Deployed"
          value={statusFilter === 'All' ? counts.Deployed : filteredAssets.length}
          icon={<Rocket size={20} />}
          color={STATUS_COLORS.Deployed}
          subtitle="In active use"
        />
        <StatCard
          title="Spare"
          value={statusFilter === 'All' ? counts.Spare : filteredAssets.length}
          icon={<Archive size={20} />}
          color={STATUS_COLORS.Spare}
          subtitle="Available stock"
        />
        <StatCard
          title="Donated"
          value={statusFilter === 'All' ? counts.Donated : filteredAssets.length}
          icon={<Gift size={20} />}
          color={STATUS_COLORS.Donated}
          subtitle="Given to partners"
        />
        <StatCard
          title="Disposed"
          value={statusFilter === 'All' ? counts.Disposed : filteredAssets.length}
          icon={<Trash2 size={20} />}
          color={STATUS_COLORS.Disposed}
          subtitle="Decommissioned"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Pie Chart */}
        <div className="card p-5 lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Status Distribution
          </h3>
          {pieData.length === 0 || pieData.every((d) => d.value === 0) ? (
            <div
              className="flex h-48 items-center justify-center"
              style={{ color: 'var(--text-muted)' }}
            >
              <p className="text-sm">No data for this filter</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={PieCustomLabel}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS],
                        }}
                      />
                      <span style={{ color: 'var(--text-muted)' }}>{entry.name}</span>
                    </div>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bar Chart */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Assets by Category
          </h3>
          {barData.length === 0 ? (
            <div
              className="flex h-48 items-center justify-center"
              style={{ color: 'var(--text-muted)' }}
            >
              <p className="text-sm">No data for this filter</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'var(--accent-light)', radius: 4 }}
                />
                <Bar
                  dataKey="count"
                  name="Assets"
                  radius={[6, 6, 0, 0]}
                  fill="var(--accent)"
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Line chart full width */}
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Asset Registrations — Last 12 Months
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={lineData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(v) => (
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{v}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="count"
              name="Registered"
              stroke="var(--accent)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: 'var(--accent)', strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent assets */}
      <div className="card p-5">
        <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Recently Updated Assets
        </h3>
        {recentAssets.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No assets found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset Tag</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      <span
                        className="font-mono text-xs font-semibold"
                        style={{ color: 'var(--accent)' }}
                      >
                        {asset.assetTag}
                      </span>
                    </td>
                    <td>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {asset.name}
                      </span>
                    </td>
                    <td>{asset.category}</td>
                    <td>
                      <StatusBadge status={asset.status} size="sm" />
                    </td>
                    <td>{asset.location}</td>
                    <td>
                      {new Date(asset.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
