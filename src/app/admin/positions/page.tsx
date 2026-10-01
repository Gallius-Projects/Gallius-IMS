'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit,
  AlertCircle,
  X,
  Loader2,
  LucideBuilding2,
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useUserContext } from '@/context/UserContext';
import TableTemplate from '@/app/components/ui-templates/table-template';

interface Position {
  id: number;
  name: string;
}

export default function PositionsPage() {
  // Auth check
  const { user, isAuthenticated } = useUserContext();

  const [search, setSearch] = useState('');

  // Data states
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail / Delete target state
  const [deletingPositionId, setDeletingPositionId] = useState<number | null>(
    null
  );

  // Fetch Departments callback
  const fetchPositions = useCallback(async () => {
    if (!localStorage.getItem('auth_token')) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/positions');
      setPositions(response.data);
    } catch (err: any) {
      console.error('Fetch positions error:', err);
      setError(
        err.message ||
          'Could not connect to the database. Make sure MySQL is running.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Open form for creation
  const handleCreateOpen = () => {
    setFormData({
      name: '',
    });
    setFormError('');
    setFormMode('create');
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleEditOpen = (position: Position) => {
    setFormMode('edit');
    setSelectedPositionId(position.id);
    setFormData({
      name: position.name,
    });

    setFormError('');
    setIsFormOpen(true);
  };

  // Open delete confirm
  const handleDeleteOpen = (id: number) => {
    setDeletingPositionId(id);
    setIsDeleteOpen(true);
  };

  // Form submission handler
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
      if (formMode === 'create') {
        await axiosInstance.post('/positions', {
          ...formData,
          updatedBy: user?.id ?? '',
        });
      } else {
        await axiosInstance.put(`/positions/${selectedPositionId}`, {
          ...formData,
          updatedBy: user?.id ?? '',
        });
      }
      setIsFormOpen(false);
      fetchPositions();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save position');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete position handler
  const handleDeleteConfirm = async () => {
    if (!deletingPositionId || !user) return;
    try {
      await axiosInstance.delete(`/positions/${deletingPositionId}`, {
        data: {
          updatedBy: user?.id ?? '',
        },
      });
      setIsDeleteOpen(false);
      setDeletingPositionId(null);
      fetchPositions();
    } catch (err: any) {
      alert(err.message || 'Failed to delete position');
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setFormMode('create');
    setFormData({
      name: '',
    });
    setFormError('');
    setSelectedPositionId(null);
    setDeletingPositionId(null);
  };

  // Trigger fetch when parameters change
  useEffect(() => {
    if (isAuthenticated) {
      const delayDebounceFn = setTimeout(() => {
        fetchPositions();
      }, 300); // Debounce search
      return () => clearTimeout(delayDebounceFn);
    }
  }, [fetchPositions, isAuthenticated]);

  const columns = [
    {
      header: 'Position Name',
      accessor: 'name',
      dataType: 'string',
      fontStyle: 'semibold',
      fontSize: 'sm',
      emphasizeLevel: 'high',
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      dataType: 'date',
      fontStyle: 'normal',
      fontSize: 'xs',
      emphasizeLevel: 'medium',
    },
    {
      header: 'Updated At',
      accessor: 'updatedAt',
      dataType: 'date',
      fontStyle: 'normal',
      fontSize: 'xs',
      emphasizeLevel: 'medium',
    },
    {
      header: 'Updated By',
      accessor: 'updatedBy',
      dataType: 'string',
      fontStyle: 'normal',
      fontSize: 'xs',
      emphasizeLevel: 'normal',
    },
  ];

  return (
    <div className="flex max-h-screen min-h-screen flex-col bg-slate-50/50 px-4 py-8 font-sans text-slate-900 transition-all duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-6 flex w-fit gap-2 border-b-2 border-slate-300 pr-2 pb-2 dark:border-slate-700">
        <LucideBuilding2 />
        <h5 className="font-league-spartan text-lg font-bold text-slate-900 dark:text-slate-100">
          Positions
        </h5>
      </div>

      {/* Connection/Db Error Notice */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/80 p-4 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold">Database Sync Issue</h4>
            <p className="mt-1 text-xs leading-relaxed opacity-90">{error}</p>
            <p className="mt-2 rounded border border-amber-200/30 bg-white/40 p-2 font-mono text-[11px] dark:border-amber-900/30 dark:bg-slate-900/40">
              Setup reminder: Run{' '}
              <code className="font-bold">docker compose up -d</code> to start
              MySQL and configure the <code className="font-bold">.env</code>{' '}
              DATABASE_URL, then run{' '}
              <code className="font-bold">npx prisma db push</code>.
            </p>
          </div>
        </div>
      )}

      {/* Filters and Search and Actions */}
      <main className="space-y-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search position name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {/* Filters Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Add New Button */}
            <button
              onClick={handleCreateOpen}
              className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 lg:ml-0 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              <Plus className="h-4 w-4" />
              <span>Add Position</span>
            </button>
          </div>
        </div>

        <TableTemplate
          rows={positions.map((position) => ({
            ...position,
            updatedBy: position?.updatedBy
              ? position?.updatedBy?.employee?.firstName +
                ' ' +
                position?.updatedBy?.employee?.lastName
              : '--',
          }))}
          columns={columns}
          isLoading={isLoading}
          tableName="Positions"
          canEdit={user?.role === 'superadmin' || user?.role === 'admin'}
          canDelete={user?.role === 'superadmin' || user?.role === 'admin'}
          handleEditOpen={handleEditOpen}
          handleDeleteOpen={handleDeleteOpen}
        />

        {/* Table Container */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50 dark:border-slate-800/60 dark:bg-slate-950">
                <th className="px-5 py-3.5 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Position Name
                </th>
                <th className="px-5 py-3.5 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Created At
                </th>
                <th className="px-5 py-3.5 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Updated At
                </th>
                <th className="px-5 py-3.5 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Updated By
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-slate-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-indigo-600 dark:text-indigo-400" />
                      <span>Loading departments...</span>
                    </div>
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-slate-400 dark:text-slate-500"
                  >
                    No departments found. Try adjusting filters or create a new
                    department.
                  </td>
                </tr>
              ) : (
                departments.map((department) => (
                  <tr
                    key={department.id}
                    className="group transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                  >
                    <td className="px-5 py-4">
                      <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                        {department.name}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {new Date(department?.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                        {new Date(department?.updatedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {department?.updatedBy
                          ? department?.updatedBy?.employee?.firstName +
                              ' ' +
                              department?.updatedBy?.employee?.lastName || ' — '
                          : '--'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditOpen(department)}
                          className="dark:hover:bg-slate-850 cursor-pointer rounded-lg border border-slate-200/50 bg-white p-1.5 text-slate-400 transition-all hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:hover:text-indigo-400"
                          title="Edit Department"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteOpen(department.id)}
                          className="cursor-pointer rounded-lg border border-slate-200/50 bg-white p-1.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:hover:bg-rose-950/20 dark:hover:text-rose-400"
                          title="Delete Department"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* FORM MODAL (Add / Edit) */}
      {isFormOpen && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200/60 px-6 py-4 dark:border-slate-800/60">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {formMode === 'create'
                  ? 'Add New Department'
                  : 'Edit Department'}
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
                      Department Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IT Department"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
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
                    'Save Department'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-4 p-6 text-center">
              <div className="inline-flex rounded-full border border-rose-100 bg-rose-50 p-3 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Delete Department Confirmation
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Are you sure you want to remove this department? This action
                  is permanent and cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-200/60 bg-slate-50 px-6 py-4 dark:border-slate-800/60 dark:bg-slate-900/50">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="cursor-pointer rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
