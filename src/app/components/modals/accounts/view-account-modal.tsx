import { Accounts } from '@/types/accounts';
import { Info, X } from 'lucide-react';

interface ViewAccountModalProps {
  isDetailOpen: boolean;
  setIsDetailOpen: (isDetailOpen: boolean) => void;
  viewingDetails: Accounts;
}

export default function ViewAccountModal({
  isDetailOpen,
  setIsDetailOpen,
  viewingDetails,
}: ViewAccountModalProps) {
  if (!isDetailOpen) {
    return null;
  }

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 px-6 py-4 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <Info className="h-4.5 w-4.5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Account Details
            </h3>
          </div>
          <button
            onClick={() => setIsDetailOpen(false)}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200/40 bg-slate-50 p-4 dark:border-slate-800/40 dark:bg-slate-950/40">
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Username
              </span>
              <span className="font-montserrat text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.username || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Role
              </span>
              <span className="font-montserrat text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails.role.role || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Status
              </span>
              <span className="font-montserrat text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.status || '—'}
              </span>
            </div>
          </div>

          {/* Employee Details */}
          <div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Employee ID
              </span>
              <span className="font-montserrat text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.employee?.employeeId || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                First Name
              </span>
              <span className="font-montserrat text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.employee?.firstName || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Last Name
              </span>
              <span className="font-montserrat text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.employee?.lastName || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Middle Name
              </span>
              <span className="font-montserrat text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.employee?.middleName || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Office
              </span>
              <span className="font-montserrat text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.employee?.office?.name || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Department
              </span>
              <span className="font-montserrat text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.employee?.department?.name || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Position
              </span>
              <span className="font-montserrat text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.employee?.position || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Created Date
              </span>
              <span className="font-montserrat text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.createdAt || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Date Last Modified
              </span>
              <span className="font-montserrat text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.updatedAt || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-slate-200/60 bg-slate-50 px-6 py-4 dark:border-slate-800/60 dark:bg-slate-900/50">
          <button
            onClick={() => setIsDetailOpen(false)}
            className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}
