import type { AssetStatus, AssetCondition } from '../../types/asset';
import { STATUS_BG, CONDITION_BG } from '../../types/asset';

interface StatusBadgeProps {
  status: AssetStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${sizeClass} ${STATUS_BG[status]}`}>
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block"
        style={{
          backgroundColor:
            status === 'Deployed'
              ? '#3B82F6'
              : status === 'Spare'
                ? '#10B981'
                : status === 'Donated'
                  ? '#F59E0B'
                  : '#EF4444',
        }}
      />
      {status}
    </span>
  );
}

interface ConditionBadgeProps {
  condition: AssetCondition;
  size?: 'sm' | 'md';
}

export function ConditionBadge({ condition, size = 'md' }: ConditionBadgeProps) {
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${sizeClass} ${CONDITION_BG[condition]}`}>
      {condition}
    </span>
  );
}
