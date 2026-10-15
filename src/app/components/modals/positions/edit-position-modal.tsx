import { useLibrariesContext } from '@/context/LibrariesContext';
import axiosInstance from '@/lib/axiosInstance';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import SearchableDropdown from '../../ui-templates/searchable-dropdown';

interface EditPositionProps {
  formData: {
    name: string;
    departmentId: number;
  };
  setFormData: (formData: { name: string; departmentId: number }) => void;
  fetchPositions: () => void;
  handleClose: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  selectedPositionId: number;
  dataToUpdate: any;
}

export default function EditPosition({
  formData,
  setFormData,
  handleClose,
  isSubmitting,
  setIsSubmitting,
  selectedPositionId,
  fetchPositions,
  dataToUpdate,
}: EditPositionProps) {
  const { departments } = useLibrariesContext();
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    setFormData({
      name: dataToUpdate.name,
      departmentId: dataToUpdate.departmentId,
    });
  }, [dataToUpdate]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!formData.name) {
      setFormError('Position name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      await axiosInstance.put(`/positions/${selectedPositionId}`, formData);

      fetchPositions();
      handleClose();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save position');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 px-6 py-4 dark:border-slate-800/60">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Edit Position
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
                  Position Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IT Specialist"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Department */}
              <div className="col-span-2">
                <SearchableDropdown
                  label="Department"
                  placeholder="Select Department"
                  data={departments}
                  value={formData.departmentId}
                  onChange={(value) =>
                    setFormData({ ...formData, departmentId: parseInt(value) })
                  }
                  required
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
                'Save Position'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
