import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: StatCardProps) {
  return (
    <div
      className="card p-5 flex items-start gap-4 group"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
          {title}
        </p>
        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
