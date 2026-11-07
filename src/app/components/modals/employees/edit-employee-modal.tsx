import { AlertCircle, Loader2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SearchableDropdown from '../../ui-templates/searchable-dropdown';
import { useLibrariesContext } from '@/context/LibrariesContext';
import axiosInstance from '@/lib/axiosInstance';

export default function EditEmployee({
  formData,
  setFormData,
  handleClose,
  fetchEmployees,
  isSubmitting,
  setIsSubmitting,
  dataToUpdate,
}: {
  formData: any;
  setFormData: any;
  handleClose: () => void;
  fetchEmployees: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  dataToUpdate: any;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { offices, departments, positions } = useLibrariesContext();

  const [formError, setFormError] = useState('');

  // Auto-fill values if editing
  useEffect(() => {
    if (dataToUpdate) {
      setFormData({
        employeeId: dataToUpdate.employeeId || '',
        firstName: dataToUpdate.firstName || '',
        lastName: dataToUpdate.lastName || '',
        middleName: dataToUpdate.middleName || '',
        suffix: dataToUpdate.suffix || '',
        officeId: dataToUpdate.officeId || null,
        departmentId: dataToUpdate.departmentId || null,
        positionId: dataToUpdate.positionId || null,
        status: dataToUpdate.status ? dataToUpdate.status : false,
      });
    }
  }, [dataToUpdate, setFormData]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    if (!formData.employeeId) {
      setFormError('Employee number is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.firstName) {
      setFormError('First name is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.lastName) {
      setFormError('Last name is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.departmentId) {
      setFormError('Department is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.officeId) {
      setFormError('Office is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.positionId) {
      setFormError('Position is required');
      setIsSubmitting(false);
      return;
    }

    try {
      await axiosInstance.put(`/employees/${dataToUpdate.id}`, formData);

      alert('Employee updated successfully');

      fetchEmployees();
      handleClose();
    } catch (err: { response: { data: { error: string } } } | unknown) {
      setFormError(
        (err as { response: { data: { error: string } } }).response.data
          .error || 'Failed to save employee'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClose]);

  useEffect(() => {
    if (formError) {
      modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [formError]);

  console.log('dataToUpdate', dataToUpdate.status);
  console.log('formData', formData.status);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      ref={modalRef}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 px-6 py-4 dark:border-slate-800/60">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Edit Employee
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
              {/* Employee Number */}
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Employee Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123456"
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Middle Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John"
                  value={formData.middleName}
                  onChange={(e) =>
                    setFormData({ ...formData, middleName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Suffix
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jr."
                  value={formData.suffix || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, suffix: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Office */}
              <SearchableDropdown
                label="Office"
                placeholder="Select Office"
                data={offices}
                value={formData.officeId}
                onChange={(value) =>
                  setFormData({ ...formData, officeId: value })
                }
                required
              />

              {/* Department */}
              <SearchableDropdown
                label="Department"
                placeholder="Select Department"
                data={departments}
                value={formData.departmentId}
                onChange={(value) =>
                  setFormData({ ...formData, departmentId: value })
                }
                required
              />

              {/* Position */}
              <SearchableDropdown
                label="Position"
                placeholder="Select Position"
                data={positions}
                value={formData.positionId}
                onChange={(value) =>
                  setFormData({ ...formData, positionId: value })
                }
                required
              />

              {/* Status */}
              <div className="col-span-2 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Status
                </label>

                <div className="flex rounded-xl bg-slate-200 p-1 dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, status: true });
                    }}
                    aria-pressed={formData.status}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                      formData.status
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    Active
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, status: false });
                    }}
                    aria-pressed={!formData.status}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                      !formData.status
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    Inactive
                  </button>
                </div>
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
                'Save Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
