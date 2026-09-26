import { Info, X } from 'lucide-react';

interface ViewItemsModalProps {
  isDetailOpen: boolean;
  setIsDetailOpen: (isDetailOpen: boolean) => void;
  viewingDetails: any;
}

export default function ViewItemsModal({
  isDetailOpen,
  setIsDetailOpen,
  viewingDetails,
}: ViewItemsModalProps) {
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
              Asset Specification
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
                Category
              </span>
              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.category || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Brand
              </span>
              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.brand?.name || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Supplier
              </span>
              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.supplier?.name || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Hostname
              </span>
              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails.hostname || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Asset Tag
              </span>
              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.oldAssetTag || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                New Asset Tag
              </span>
              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.newAssetTag || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Location
              </span>
              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails?.location?.name || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Serial Number
              </span>
              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails.serialNumber || '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Current Status
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {viewingDetails.status}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Last Sync
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(viewingDetails.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
              Description
            </span>
            <div className="text-slate-755 max-h-40 overflow-y-auto rounded-xl border border-slate-200/40 bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap dark:border-slate-800/40 dark:bg-slate-950/30 dark:text-slate-300">
              {viewingDetails.description || 'No description provided.'}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <span className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
              Remarks
            </span>
            <div className="text-slate-755 max-h-40 overflow-y-auto rounded-xl border border-slate-200/40 bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap dark:border-slate-800/40 dark:bg-slate-950/30 dark:text-slate-300">
              {viewingDetails.remarks || 'No remarks provided.'}
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
