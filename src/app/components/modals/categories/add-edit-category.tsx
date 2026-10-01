import { AlertCircle, Loader2, X } from 'lucide-react';

interface AddEditCategoryProps {
  formMode: 'create' | 'edit';
  formData: {
    name: string;
    abbreviation: string;
    quantity: number;
  };
  setFormData: (formData: {
    name: string;
    abbreviation: string;
    quantity: number;
  }) => void;
  formError: string;
  handleFormSubmit: (e: React.FormEvent) => void;
  handleClose: () => void;
  isSubmitting: boolean;
}

export default function AddEditCategory({
  formMode,
  formData,
  setFormData,
  formError,
  handleFormSubmit,
  handleClose,
  isSubmitting,
}: AddEditCategoryProps) {
  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 px-6 py-4 dark:border-slate-800/60">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {formMode === 'create' ? 'Add New Category' : 'Edit Category'}
          </h3>
          <button
            onClick={() => handleClose()}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleFormSubmit}>
          <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6">
            {formError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monitors"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Abbreviation */}
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Abbreviation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MTN"
                  value={formData.abbreviation}
                  onChange={(e) =>
                    setFormData({ ...formData, abbreviation: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Quantity */}
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Quantity
                </label>
                <input
                  type="number"
                  placeholder="e.g. 10"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200/60 bg-slate-50 px-6 py-4 dark:border-slate-800/60 dark:bg-slate-900/50">
            <button
              type="button"
              onClick={() => handleClose()}
              className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-75 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
