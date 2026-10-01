'use client';

import { CheckCircle, FileWarning, Info, Trash2, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
  type: 'delete' | 'info' | 'warning' | 'success';
  iconColor: string;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading,
  type,
  iconColor,
}: ConfirmationDialogProps) {
  const icon = {
    delete: <Trash2 className="h-4.5 w-4.5" />,
    info: <Info className="h-4.5 w-4.5" />,
    warning: <FileWarning className="h-4.5 w-4.5" />,
    success: <CheckCircle className="h-4.5 w-4.5" />,
  }[type];

  const buttonClass = {
    delete: 'btn-danger',
    info: 'btn-secondary',
    warning: 'btn-warning',
    success: 'btn-success',
  }[type];

  if (!isOpen) return null;

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 px-6 py-4 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className={iconColor}>{icon}</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200/60 bg-slate-50 px-6 py-4 dark:border-slate-800/60 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`${buttonClass} flex items-center gap-1.5`}
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
