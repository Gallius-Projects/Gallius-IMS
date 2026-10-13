import SearchableDropdown from '@/app/components/ui-templates/searchable-dropdown';
import { useLibrariesContext } from '@/context/LibrariesContext';
import axiosInstance from '@/lib/axiosInstance';
import { AlertCircle, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function EditAccountModal({
  accountFormData,
  setAccountFormData,
  handleClose,
  accountFormError,
  setAccountFormError,
  fetchEmployees,
  isSubmitting,
  setIsSubmitting,
  dataToUpdate,
}: {
  accountFormData: any;
  handleClose: () => void;
  accountFormError: string;
  setAccountFormError: (error: string) => void;
  fetchEmployees: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  dataToUpdate: any;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  const { roles } = useLibrariesContext();

  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formError, setFormError] = useState(accountFormError);

  useEffect(() => {
    if (dataToUpdate) {
      setFormData({
        id: dataToUpdate.id || '',
        username: dataToUpdate.username || '',
        password: '',
        roleId: dataToUpdate.roleId || '',
        status: dataToUpdate.status || true,
      });
    }
  }, [dataToUpdate]);

  useEffect(() => {
    if (confirmPassword !== accountFormData.password) {
      setAccountFormError('Passwords do not match');
    }
  }, [confirmPassword]);

  // Form submission handler
  const handleAccountFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountFormError('');
    setIsSubmitting(true);

    if (!accountFormData.username) {
      setAccountFormError('Employee username is required');
      setIsSubmitting(false);
      return;
    }

    try {
      await axiosInstance.put(`/accounts/${dataToUpdate.uuid}`, formData);

      handleClose();
      fetchEmployees();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save employee');
    } finally {
      setIsSubmitting(false);
    }
  };
  // console.log(accountFormData);

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 px-6 py-4 dark:border-slate-800/60">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {accountFormMode === 'create' ? 'Create Account' : 'Edit Account'}
          </h3>
          <button
            onClick={() => handleClose()}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleAccountFormSubmit}>
          <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6">
            {formError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. john.doe"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="**********"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {/* Role */}
              <SearchableDropdown
                label="Role"
                placeholder="Select Role"
                data={roles}
                value={formData.roleId}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    roleId: value,
                  })
                }
                required
              />

              {/* Confirm Password */}
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="*********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      {showConfirmPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </span>
                  </button>
                </div>
              </div>

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
                'Save Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
