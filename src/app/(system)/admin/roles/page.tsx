'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, AlertCircle, X, Loader2, LucideCog } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useUserContext } from '@/context/UserContext';
import TableTemplate from '@/app/components/ui-templates/table-template';
import { Roles, RoleFormData } from '@/types/roles';
import { ConfirmationDialog } from '@/app/components/ui-templates/confirmation-dialog';

export default function RolesPage() {
  // Auth check
  const { user, isAuthenticated } = useUserContext();

  const [search, setSearch] = useState('');

  // Data states
  const [roles, setRoles] = useState<Roles[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    role: '',
    allowGradingSystem: false,
    allowInventorySystemAccess: false,
    allowInventorySystemAdd: false,
    allowInventorySystemEdit: false,
    allowInventorySystemDelete: false,
    allowInventorySystemVoid: false,
    allowInventorySystemViewAuditTrail: false,
    allowRequestForPurchaseAccess: false,
    allowRequestForPurchaseAdd: false,
    allowRequestForPurchaseEdit: false,
    allowRequestForPurchaseCancel: false,
    allowRequestForPurchasePost: false,
    allowRequestForPurchaseSendEmail: false,
    allowFixedAssetAccess: false,
    allowFixedAssetAdd: false,
    allowFixedAssetEdit: false,
    allowFixedAssetCancel: false,
    allowFixedAssetPost: false,
    allowFixedAssetSendEmail: false,
    allowUMAccess: false,
    allowUMAdd: false,
    allowUMEdit: false,
    allowLibrariesAccess: false,
    allowLibrariesAdd: false,
    allowLibrariesEdit: false,
    allowLibrariesDelete: false,
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail / Delete target state
  const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null);

  // Fetch Roles callback
  const fetchRoles = useCallback(async () => {
    if (!localStorage.getItem('auth_token')) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/roles');
      setRoles(response.data);
    } catch (err: { message: string } | unknown) {
      console.error('Fetch roles error:', err);
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
      role: '',
      allowGradingSystem: false,
      allowInventorySystemAccess: false,
      allowInventorySystemAdd: false,
      allowInventorySystemEdit: false,
      allowInventorySystemDelete: false,
      allowInventorySystemVoid: false,
      allowInventorySystemViewAuditTrail: false,
      allowRequestForPurchaseAccess: false,
      allowRequestForPurchaseAdd: false,
      allowRequestForPurchaseEdit: false,
      allowRequestForPurchaseCancel: false,
      allowRequestForPurchasePost: false,
      allowRequestForPurchaseSendEmail: false,
      allowFixedAssetAccess: false,
      allowFixedAssetAdd: false,
      allowFixedAssetEdit: false,
      allowFixedAssetCancel: false,
      allowFixedAssetPost: false,
      allowFixedAssetSendEmail: false,
      allowUMAccess: false,
      allowUMAdd: false,
      allowUMEdit: false,
      allowLibrariesAccess: false,
      allowLibrariesAdd: false,
      allowLibrariesEdit: false,
      allowLibrariesDelete: false,
    });
    setFormError('');
    setFormMode('create');
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleEditOpen = (role: Roles) => {
    setFormMode('edit');
    setSelectedRoleId(role.id);

    setFormData({
      role: role.role,
      allowGradingSystem: role.allowGradingSystem,
      allowInventorySystemAccess: role.allowInventorySystemAccess,
      allowInventorySystemAdd: role.allowInventorySystemAdd,
      allowInventorySystemEdit: role.allowInventorySystemEdit,
      allowInventorySystemDelete: role.allowInventorySystemDelete,
      allowInventorySystemVoid: role.allowInventorySystemVoid,
      allowInventorySystemViewAuditTrail:
        role.allowInventorySystemViewAuditTrail,
      allowRequestForPurchaseAccess: role.allowRequestForPurchaseAccess,
      allowRequestForPurchaseAdd: role.allowRequestForPurchaseAdd,
      allowRequestForPurchaseEdit: role.allowRequestForPurchaseEdit,
      allowRequestForPurchaseCancel: role.allowRequestForPurchaseCancel,
      allowRequestForPurchasePost: role.allowRequestForPurchasePost,
      allowRequestForPurchaseSendEmail: role.allowRequestForPurchaseSendEmail,
      allowFixedAssetAccess: role.allowFixedAssetAccess,
      allowFixedAssetAdd: role.allowFixedAssetAdd,
      allowFixedAssetEdit: role.allowFixedAssetEdit,
      allowFixedAssetCancel: role.allowFixedAssetCancel,
      allowFixedAssetPost: role.allowFixedAssetPost,
      allowFixedAssetSendEmail: role.allowFixedAssetSendEmail,
      allowUMAccess: role.allowUMAccess,
      allowUMAdd: role.allowUMAdd,
      allowUMEdit: role.allowUMEdit,
      allowLibrariesAccess: role.allowLibrariesAccess,
      allowLibrariesAdd: role.allowLibrariesAdd,
      allowLibrariesEdit: role.allowLibrariesEdit,
      allowLibrariesDelete: role.allowLibrariesDelete,
    });

    setFormError('');
    setIsFormOpen(true);
  };

  // Open delete confirm
  const handleDeleteOpen = (id: number) => {
    setDeletingRoleId(id);
    setIsDeleteOpen(true);
  };

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!formData.role) {
      setFormError('Role name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      if (formMode === 'create') {
        await axiosInstance.post('/roles', {
          ...formData,
          updatedBy: user?.id ?? '',
        });
      } else {
        await axiosInstance.put(`/roles/${selectedRoleId}`, {
          ...formData,
          updatedBy: user?.id ?? '',
        });
      }
      setIsFormOpen(false);
      fetchRoles();
    } catch (err: { message: string } | unknown) {
      setFormError(
        (err as { message: string }).message || 'Failed to save role'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete role handler
  const handleDeleteConfirm = async () => {
    if (!deletingRoleId || !user) return;
    try {
      await axiosInstance.delete(`/admin/roles/${deletingRoleId}`, {
        data: {
          updatedBy: user?.id ?? '',
        },
      });
      setIsDeleteOpen(false);
      setDeletingRoleId(null);
      fetchRoles();
    } catch (err: { message: string } | unknown) {
      alert((err as { message: string }).message || 'Failed to delete role');
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setFormMode('create');
    setFormData({
      role: '',
      allowGradingSystem: false,
      allowInventorySystemAccess: false,
      allowInventorySystemAdd: false,
      allowInventorySystemEdit: false,
      allowInventorySystemDelete: false,
      allowInventorySystemVoid: false,
      allowInventorySystemViewAuditTrail: false,
      allowRequestForPurchaseAccess: false,
      allowRequestForPurchaseAdd: false,
      allowRequestForPurchaseEdit: false,
      allowRequestForPurchaseCancel: false,
      allowRequestForPurchasePost: false,
      allowRequestForPurchaseSendEmail: false,
      allowFixedAssetAccess: false,
      allowFixedAssetAdd: false,
      allowFixedAssetEdit: false,
      allowFixedAssetCancel: false,
      allowFixedAssetPost: false,
      allowFixedAssetSendEmail: false,
      allowUMAccess: false,
      allowUMAdd: false,
      allowUMEdit: false,
      allowLibrariesAccess: false,
      allowLibrariesAdd: false,
      allowLibrariesEdit: false,
      allowLibrariesDelete: false,
    });
    setFormError('');
    setSelectedRoleId(null);
    setDeletingRoleId(null);
  };

  // Trigger fetch when parameters change
  useEffect(() => {
    if (isAuthenticated) {
      const delayDebounceFn = setTimeout(() => {
        fetchRoles();
      }, 300); // Debounce search
      return () => clearTimeout(delayDebounceFn);
    }
  }, [fetchRoles, isAuthenticated]);

  const columns = [
    {
      header: 'Role Name',
      accessor: 'role',
      dataType: 'string',
      fontStyle: 'semibold',
      fontSize: 'sm',
      emphasizeLevel: 'medium',
    },
  ];

  return (
    <div className="flex max-h-screen min-h-screen flex-col bg-slate-50/50 px-4 py-8 font-sans text-slate-900 transition-all duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-6 flex w-fit gap-2 border-b-2 border-slate-300 pr-2 pb-2 dark:border-slate-700">
        <LucideCog />
        <h5 className="font-league-spartan text-lg font-bold text-slate-900 dark:text-slate-100">
          Roles
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
              placeholder="Search role name..."
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
              <span>Add Role</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <TableTemplate
          rows={roles}
          columns={columns}
          isLoading={isLoading}
          tableName="Roles"
          handleEditOpen={handleEditOpen}
          handleDeleteOpen={handleDeleteOpen}
          canEdit={user?.role === 'superadmin' || user?.role === 'admin'}
          canDelete={user?.role === 'superadmin' || user?.role === 'admin'}
        />
      </main>

      {/* FORM MODAL (Add / Edit) */}
      {isFormOpen && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200/60 px-6 py-4 dark:border-slate-800/60">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {formMode === 'create' ? 'Add New Role' : 'Edit Role'}
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
                      Role Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Super Admin"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  {/* Permissions */}
                  <div className="col-span-2">
                    <h6 className="mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                      Permissions
                    </h6>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                      {/* Grading System Permissions */}
                      <div className="mb-4">
                        <h6 className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Grading System
                        </h6>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowGradingSystem}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowGradingSystem: e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Access
                          </label>
                        </div>
                      </div>

                      {/* Inventory System Permissions */}
                      <div className="mb-4">
                        <h6 className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Inventory System
                        </h6>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowInventorySystemAccess}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowInventorySystemAccess:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Access
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowInventorySystemAdd}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowInventorySystemAdd:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Add
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowInventorySystemEdit}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowInventorySystemEdit:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Edit
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowInventorySystemDelete}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowInventorySystemDelete:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Delete
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowInventorySystemVoid}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowInventorySystemVoid:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Void
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={
                                formData.allowInventorySystemViewAuditTrail
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowInventorySystemViewAuditTrail:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            View Audit Trail
                          </label>
                        </div>
                      </div>

                      {/* Request for Purchase Permissions */}
                      <div className="mb-4">
                        <h6 className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Request for Purchase
                        </h6>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowRequestForPurchaseAccess}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowRequestForPurchaseAccess:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Access
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowRequestForPurchaseAdd}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowRequestForPurchaseAdd:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Add
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowRequestForPurchaseEdit}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowRequestForPurchaseEdit:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Edit
                          </label>
                          {/* <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowRequestForPurchaseDelete}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowRequestForPurchaseDelete:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Delete
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowRequestForPurchaseVoid}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowRequestForPurchaseVoid:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Void
                          </label> */}
                        </div>
                      </div>

                      {/* Fixed Asset Permissions */}
                      <div className="mb-4">
                        <h6 className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Fixed Asset
                        </h6>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowFixedAssetAccess}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowFixedAssetAccess:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Access
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowFixedAssetAdd}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowFixedAssetAdd: e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Add
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowFixedAssetEdit}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowFixedAssetEdit:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Edit
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowFixedAssetCancel}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowFixedAssetCancel:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Cancel
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowFixedAssetPost}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowFixedAssetPost:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Post
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowFixedAssetSendEmail}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowFixedAssetSendEmail:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Send Email
                          </label>
                        </div>
                      </div>

                      {/* User Management Permissions */}
                      <div className="mb-4">
                        <h6 className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          User Management
                        </h6>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowUMAccess}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowUMAccess: e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Access
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowUMAdd}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowUMAdd: e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Add
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowUMEdit}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowUMEdit: e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Edit
                          </label>
                        </div>
                      </div>

                      {/* Libraries Permissions */}
                      <div className="mb-4">
                        <h6 className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Libraries
                        </h6>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowLibrariesAccess}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowLibrariesAccess:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Access
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowLibrariesAdd}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowLibrariesAdd: e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Add
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowLibrariesEdit}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowLibrariesEdit: e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Edit
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={formData.allowLibrariesDelete}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allowLibrariesDelete:
                                    e.target.checked || false,
                                })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            Delete
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex w-full items-center justify-end gap-2">
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
                      'Save'
                    )}
                  </button>
                </div>
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
          title="Delete Role"
          description={`Are you sure you want to delete ${roles.find((role) => role.id === deletingRoleId)?.role}?`}
          isLoading={isLoading}
          type="delete"
          iconColor="text-rose-600 dark:text-rose-400"
        />
      )}
    </div>
  );
}
