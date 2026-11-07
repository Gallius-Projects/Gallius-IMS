'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  AlertCircle,
  X,
  Loader2,
  LucideBuilding,
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useUserContext } from '@/context/UserContext';
import TableTemplate from '@/app/components/ui-templates/table-template';
import { Suppliers } from '@/types/suppliers';
import { ConfirmationDialog } from '@/app/components/ui-templates/confirmation-dialog';

export default function SuppliersPage() {
  // Auth check
  const { user, isAuthenticated } = useUserContext();

  const [search, setSearch] = useState('');

  // Data states
  const [suppliers, setSuppliers] = useState<Suppliers[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    contactNumber: '',
    email: '',
    address: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail / Delete target state
  const [deletingSupplierId, setDeletingSupplierId] = useState<number | null>(
    null
  );

  // Fetch Offices callback
  const fetchSuppliers = useCallback(async () => {
    if (!localStorage.getItem('auth_token')) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/suppliers');
      setSuppliers(response.data);
    } catch (err: { message: string } | unknown) {
      console.error('Fetch suppliers error:', err);
      setError(
        (err as { message: string }).message ||
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
      contactPerson: '',
      contactNumber: '',
      email: '',
      address: '',
    });
    setFormError('');
    setFormMode('create');
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleEditOpen = (supplier: Suppliers) => {
    setFormMode('edit');
    setSelectedSupplierId(supplier.id);
    setFormData({
      name: supplier.name || '',
      contactPerson: supplier.contactPerson || '',
      contactNumber: supplier.contactNumber || '',
      email: supplier.email || '',
      address: supplier.address || '',
    });

    setFormError('');
    setIsFormOpen(true);
  };

  // Open delete confirm
  const handleDeleteOpen = (id: number) => {
    setDeletingSupplierId(id);
    setIsDeleteOpen(true);
  };

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!formData.name) {
      setFormError('Supplier name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      if (formMode === 'create') {
        await axiosInstance.post('/suppliers', {
          ...formData,
          updatedBy: user?.id ?? '',
        });
      } else {
        await axiosInstance.put(`/suppliers/${selectedSupplierId}`, {
          ...formData,
          updatedBy: user?.id ?? '',
        });
      }
      setIsFormOpen(false);
      fetchSuppliers();
    } catch (err: { message: string } | unknown) {
      setFormError(
        (err as { message: string }).message || 'Failed to save supplier'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete location handler
  const handleDeleteConfirm = async () => {
    if (!deletingSupplierId || !user) return;
    try {
      await axiosInstance.delete(`/suppliers/${deletingSupplierId}`, {
        data: {
          updatedBy: user?.id ?? '',
        },
      });
      setIsDeleteOpen(false);
      setDeletingSupplierId(null);
      fetchSuppliers();
    } catch (err: { message: string } | unknown) {
      alert(
        (err as { message: string }).message || 'Failed to delete supplier'
      );
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setFormMode('create');
    setFormData({
      name: '',
      contactPerson: '',
      contactNumber: '',
      email: '',
      address: '',
    });
    setFormError('');
    setSelectedSupplierId(null);
    setDeletingSupplierId(null);
  };

  // Trigger fetch when parameters change
  useEffect(() => {
    if (isAuthenticated) {
      const delayDebounceFn = setTimeout(() => {
        fetchSuppliers();
      }, 300); // Debounce search
      return () => clearTimeout(delayDebounceFn);
    }
  }, [fetchSuppliers, isAuthenticated]);

  const columns = [
    {
      header: 'Supplier',
      accessor: 'name',
      dataType: 'string',
      fontStyle: 'semibold',
      fontSize: 'sm',
      secondary: 'address',
      emphasizeLevel: 'high',
    },
    {
      header: 'Contact Person',
      accessor: 'contactPerson',
      dataType: 'string',
      fontStyle: 'normal',
      fontSize: 'xs',
      emphasizeLevel: 'normal',
    },
    {
      header: 'Contact Number',
      accessor: 'contactNumber',
      dataType: 'string',
      fontStyle: 'normal',
      fontSize: 'xs',
      emphasizeLevel: 'normal',
    },
    {
      header: 'Email',
      accessor: 'email',
      dataType: 'string',
      fontStyle: 'semibold',
      fontSize: 'xs',
      emphasizeLevel: 'medium',
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      dataType: 'date',
      fontStyle: 'normal',
      fontSize: 'xs',
      emphasizeLevel: 'normal',
    },
    {
      header: 'Updated At',
      accessor: 'updatedAt',
      dataType: 'date',
      fontStyle: 'normal',
      fontSize: 'xs',
      emphasizeLevel: 'normal',
    },
    {
      header: 'Updated By',
      accessor: 'updatedBy',
      dataType: 'string',
      fontStyle: 'normal',
      fontSize: 'xs',
      emphasizeLevel: 'medium',
    },
  ];

  return (
    <div className="flex max-h-screen min-h-screen flex-col bg-slate-50/50 px-4 py-8 font-sans text-slate-900 transition-all duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-6 flex w-fit gap-2 border-b-2 border-slate-300 pr-2 pb-2 dark:border-slate-700">
        <LucideBuilding />
        <h5 className="font-league-spartan text-lg font-bold text-slate-900 dark:text-slate-100">
          Suppliers
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
              placeholder="Search supplier name..."
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
              <span>Add Supplier</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <TableTemplate
          rows={suppliers}
          columns={columns}
          tableName="Suppliers"
          isLoading={isLoading}
          handleDetailOpen={() => {}}
          handleEditOpen={handleEditOpen}
          handleDeleteOpen={handleDeleteOpen}
          canEdit
          canDelete
        />
      </main>

      {/* FORM MODAL (Add / Edit) */}
      {isFormOpen && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200/60 px-6 py-4 dark:border-slate-800/60">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {formMode === 'create' ? 'Add New Supplier' : 'Edit Supplier'}
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
                      Supplier Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gallius Shared Services, OPC"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                  {/* Contact Person */}
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Juan Dela Cruz"
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPerson: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                  {/* Contact Number */}
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 09123456789"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactNumber: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="[EMAIL_ADDRESS]"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 123 Main St"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: e.target.value,
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
                    'Save Supplier'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && (
        <ConfirmationDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Supplier"
          description={`Are you sure you want to delete ${suppliers.find((supplier) => supplier.id === deletingSupplierId)?.name}?`}
          isLoading={isLoading}
          type="delete"
          iconColor="text-rose-600 dark:text-rose-400"
        />
      )}
    </div>
  );
}
