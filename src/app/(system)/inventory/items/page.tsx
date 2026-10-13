'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  AlertCircle,
  Filter,
  LucideMonitor,
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useUserContext } from '@/context/UserContext';
import { useLibrariesContext } from '@/context/LibrariesContext';
import TableTemplate from '@/app/components/ui-templates/table-template';
import ViewItemsModal from '@/app/components/modals/items/view-items-modal';
import AddEditItemsModal from '@/app/components/modals/items/add-items-modal';
import EditItemsModal from '@/app/components/modals/items/edit-items-modal';

interface InventoryItem {
  id: number;
  name: string;
  oldAssetTag: string;
  newAssetTag: string;
  serialNumber: string;
  hostname: string;
  status: string;
  categoryId: number;
  category: { id: number; name: string } | null;
  brandId: number;
  brand: { id: number; name: string } | null;
  locationId: number;
  location: { id: number; name: string } | null;
  officeId: number;
  office: { id: number; name: string } | null;
  invoiceNo?: string;
  dateDeployed?: string;
  datePurchased?: string;
  assetCondition?: string;
  isNew?: boolean;
  assignedTo: number;
  description: string;
  remarks: string;
}

export default function ItemsPage() {
  // Auth check
  const { user, isAuthenticated } = useUserContext();
  const { categories } = useLibrariesContext();

  // Data states
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Search & Filter states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modal states
  const [isFormCreateOpen, setIsFormCreateOpen] = useState(false);
  const [isFormEditOpen, setIsFormEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [editNewAsset, setEditNewAsset] = useState(false);

  // Form states
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    oldAssetTag: '',
    newAssetTag: '',
    serialNumber: '',
    hostname: '',
    status: 'SPARE',
    categoryId: null,
    brandId: null,
    locationId: null,
    supplierId: null,
    officeId: null,
    isNew: true,
    datePurchased: null,
    dateDeployed: null,
    invoiceNo: '',
    assetCondition: '',
    assignedTo: null,
    description: '',
    remarks: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail / Delete target state
  const [viewingDetails, setViewingDetails] = useState<InventoryItem | null>(
    null
  );
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const [itemToUpdate, setItemToUpdate] = useState<any>(null);

  // Statuses list
  const statuses = [
    {
      value: 'SPARE',
      name: 'Spare',
      color:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50',
    },
    {
      value: 'DEPLOYED',
      name: 'Deployed',
      color:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/50',
    },
    {
      value: 'DEFECTIVE',
      name: 'Defective',
      color:
        'bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400 border border-slate-200/50 dark:border-slate-900/50',
    },
    {
      value: 'DONATED',
      name: 'Donated',
      color:
        'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50',
    },
    {
      value: 'DISPOSED',
      name: 'Disposed',
      color:
        'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50',
    },
  ];

  // Fetch Items callback
  const fetchItems = useCallback(async () => {
    if (!localStorage.getItem('auth_token')) return;
    setIsLoading(true);
    setError('');
    try {
      const params: any = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;

      const response = await axiosInstance.get('/items', { params });
      // console.log(response.data);
      setItems(response.data);
    } catch (err: any) {
      console.error('Fetch items error:', err);
      setError(
        err.message ||
          'Could not connect to the database. Make sure MySQL is running.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, selectedStatus]);

  // Open form for creation
  const handleCreateOpen = () => {
    setFormData({
      name: '',
      oldAssetTag: '',
      newAssetTag: '',
      serialNumber: '',
      hostname: '',
      status: 'SPARE',
      categoryId: null,
      brandId: null,
      locationId: null,
      supplierId: null,
      officeId: null,
      isNew: true,
      datePurchased: null,
      dateDeployed: null,
      invoiceNo: '',
      assetCondition: '',
      assignedTo: null,
      description: '',
      remarks: '',
    });
    setFormError('');
    setFormMode('create');
    // setEditNewAsset(true);
    setIsFormCreateOpen(true);
  };

  // Open form for editing
  const handleEditOpen = async (item: InventoryItem) => {
    try {
      const response = await axiosInstance.get(`/items/${item.id}`);
      const oldItemData = response.data;

      setFormMode('edit');
      setSelectedItemId(item.id);
      setItemToUpdate(oldItemData);

      // setCategorySearch(oldItemData?.category?.name || '');
      // setBrandSearch(oldItemData?.brand?.name || '');
      // setLocationSearch(oldItemData?.location?.name || '');
      // setOfficeSearch(oldItemData?.office?.name || '');
      // setSupplierSearch(oldItemData?.supplier?.name || '');

      // setEmployeeSearch(
      //   oldItemData?.assignedEmp
      //     ? `${oldItemData.assignedEmp.firstName} ${oldItemData.assignedEmp.lastName}`
      //     : ''
      // );

      setFormError('');
      setIsFormEditOpen(true);
    } catch (error) {
      console.error('Failed to get item:', error);
    }
  };

  // Open details modal
  const handleDetailOpen = (item: InventoryItem) => {
    setViewingDetails(item);
    setIsDetailOpen(true);
  };

  // Open delete confirm
  const handleDeleteOpen = (id: number) => {
    setDeletingItemId(id);
    setIsDeleteOpen(true);
  };

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!formData.name) {
      setFormError('Item name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      if (formMode === 'create') {
        await axiosInstance.post('/items', formData);
        setIsFormCreateOpen(false);
      } else {
        await axiosInstance.put(`/items/${selectedItemId}`, formData);
        setIsFormEditOpen(false);
      }
      fetchItems();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save inventory item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete item handler
  const handleDeleteConfirm = async () => {
    if (!deletingItemId) return;
    try {
      await axiosInstance.delete(`/items/${deletingItemId}`);
      setIsDeleteOpen(false);
      setDeletingItemId(null);
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
    }
  };

  const handleClose = () => {
    setIsFormCreateOpen(false);
    setIsFormEditOpen(false);
    setFormError('');
    setSelectedItemId(null);
    setItemToUpdate(null);
  };

  const handleGenerateAssetTag = async () => {
    if (user?.role.includes('superadmin') || user?.role.includes('admin')) {
      console.log('Generating new asset tag');
      if (!formData.categoryId || !formData.officeId || !formData.locationId) {
        setFormError('Please select an tenant, category, and location');
        setFormData((prev) => {
          return {
            ...prev,
            newAssetTag: '',
          };
        });
        setTimeout(() => {
          setFormError('');
        }, 8000);
        return;
      }
      if (formData.categoryId && formData.officeId && formData.locationId) {
        const params = {
          officeId: formData.officeId,
          categoryId: formData.categoryId,
          locationId: formData.locationId,
        };

        const response = await axiosInstance.get(`/items/generate-asset-tag`, {
          params,
        });

        const generatedAssetTag = response.data;

        setFormData({
          ...formData,
          newAssetTag: generatedAssetTag,
        });
      }
    }
  };

  // Trigger fetch when parameters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchItems();
    }
  }, [fetchItems, isAuthenticated]);

  const columns = [
    {
      header: 'Asset Name',
      accessor: 'name',
      dataType: 'string',
      fontStyle: 'semibold',
      fontSize: 'sm',
      secondary: 'description',
      emphasizeLevel: 'high',
    },
    {
      header: 'Asset Tag',
      accessor: 'assetTag',
      dataType: 'string',
      fontStyle: 'bold',
      fontSize: 'xs',
      secondary: 'isNew',
      emphasizeLevel: 'medium',
    },
    {
      header: 'Category',
      accessor: 'category',
      dataType: 'string',
      fontStyle: 'bold',
      fontSize: 'xs',
      emphasizeLevel: 'normal',
    },
    {
      header: 'Hostname',
      accessor: 'hostname',
      dataType: 'string',
      fontStyle: 'semibold',
      fontSize: 'xs',
      emphasizeLevel: 'medium',
    },
    {
      header: 'Serial Number',
      accessor: 'serialNumber',
      dataType: 'string',
      fontStyle: 'normal',
      fontSize: 'xs',
      emphasizeLevel: 'normal',
    },
    {
      header: 'Status',
      accessor: 'status',
      dataType: 'string',
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
      header: 'Last Updated',
      accessor: 'updatedAt',
      dataType: 'date',
      fontStyle: 'normal',
      fontSize: 'xs',
      emphasizeLevel: 'normal',
    },
  ];

  console.log(formData);

  return (
    <div className="flex max-h-screen min-h-screen flex-col bg-slate-50/50 px-4 py-8 font-sans text-slate-900 transition-all duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-6 flex w-fit gap-2 border-b-2 border-slate-300 pr-2 pb-2 dark:border-slate-700">
        <LucideMonitor />
        <h5 className="font-league-spartan text-lg font-bold text-slate-900 dark:text-slate-100">
          Inventory Items
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
              placeholder="Search hostname, serial #, description, remarks, name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {/* Filters Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category */}
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                <option value="">All Categories</option>
                {categories.map((c: { id: number; name: string }) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                <option value="">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Add New Button */}
            <button
              onClick={handleCreateOpen}
              className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 lg:ml-0 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <TableTemplate
          rows={items.map((item) => ({
            ...item,
            category: item?.category?.name,
            assetTag: item?.newAssetTag || item?.oldAssetTag || '',
            isNew: item?.isNew ? 'New' : 'Old',
            status: (() => {
              const statusConfig = statuses.find(
                (s) => s.value === item.status
              ) || {
                name: item.status,
                color:
                  'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
              };

              return (
                <span
                  className={`rounded-lg px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${statusConfig.color}`}
                >
                  {statusConfig.name}
                </span>
              );
            })(),
          }))}
          columns={columns}
          tableName="Items"
          isLoading={isLoading}
          handleDetailOpen={handleDetailOpen}
          handleEditOpen={handleEditOpen}
          handleDeleteOpen={handleDeleteOpen}
          canView
          canDelete={user?.role === 'superadmin'}
          canEdit
        />
      </main>

      {/* FORM MODAL (Add / Edit) */}
      {isFormCreateOpen && (
        <AddEditItemsModal
          formMode={formMode}
          formData={formData}
          setFormData={setFormData}
          formError={formError}
          setFormError={setFormError}
          isSubmitting={isSubmitting}
          statuses={statuses}
          editNewAsset={editNewAsset}
          setEditNewAsset={setEditNewAsset}
          handleGenerateAssetTag={handleGenerateAssetTag}
          categories={categories}
          handleClose={handleClose}
          handleFormSubmit={handleFormSubmit}
        />
      )}

      {isFormEditOpen && (
        <EditItemsModal
          isOpen={isFormEditOpen}
          formData={formData}
          setFormData={setFormData}
          formError={formError}
          setFormError={setFormError}
          isSubmitting={isSubmitting}
          statuses={statuses}
          editNewAsset={editNewAsset}
          setEditNewAsset={setEditNewAsset}
          handleGenerateAssetTag={handleGenerateAssetTag}
          categories={categories}
          handleClose={handleClose}
          handleFormSubmit={handleFormSubmit}
          itemToUpdate={itemToUpdate}
        />
      )}

      {/* DETAIL VIEW MODAL */}
      {isDetailOpen && viewingDetails && (
        <ViewItemsModal
          isDetailOpen={isDetailOpen}
          setIsDetailOpen={setIsDetailOpen}
          viewingDetails={viewingDetails}
        />
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
                  Delete Asset Confirmation
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Are you sure you want to remove this asset? This action is
                  permanent and cannot be undone.
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
