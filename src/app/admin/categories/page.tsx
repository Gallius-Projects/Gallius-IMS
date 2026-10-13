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
  LucidePackage,
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useUserContext } from '@/context/UserContext';
import TableTemplate from '@/app/components/ui-templates/table-template';
import { ConfirmationDialog } from '@/app/components/ui-templates/confirmation-dialog';
import AddEditCategory from '@/app/components/modals/categories/add-edit-category';

interface Category {
  id: number;
  name: string;
  abbreviation: string;
  quantity: number;
}

export default function CategoriesPage() {
  // Auth check
  const { user, isAuthenticated } = useUserContext();

  const [search, setSearch] = useState('');

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
    quantity: 0,
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail / Delete target state
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(
    null
  );

  // Fetch Categories callback
  const fetchCategories = useCallback(async () => {
    if (!localStorage.getItem('auth_token')) return;
    setIsLoading(true);
    setError('');
    try {
      const params: any = {};
      if (search) params.search = search;

      const response = await axiosInstance.get('/categories', { params });
      setCategories(response.data);
    } catch (err: any) {
      console.error('Fetch categories error:', err);
      setError(
        err.message ||
          'Could not connect to the database. Make sure MySQL is running.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  // Open form for creation
  const handleCreateOpen = () => {
    setFormData({
      name: '',
      abbreviation: '',
      quantity: 0,
    });
    setFormError('');
    setFormMode('create');
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleEditOpen = (category: Category) => {
    setFormMode('edit');
    setSelectedCategoryId(category.id);
    setFormData({
      name: category.name,
      abbreviation: category.abbreviation,
      quantity: category.quantity,
    });

    setFormError('');
    setIsFormOpen(true);
  };

  // Open delete confirm
  const handleDeleteOpen = (id: number) => {
    setDeletingCategoryId(id);
    setIsDeleteOpen(true);
  };

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!formData.name) {
      setFormError('Category name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      if (formMode === 'create') {
        await axiosInstance.post('/categories', {
          ...formData,
          updatedBy: user?.id ?? '',
        });
      } else {
        await axiosInstance.put(`/categories/${selectedCategoryId}`, {
          ...formData,
          updatedBy: user?.id ?? '',
        });
      }
      setIsFormOpen(false);
      fetchCategories();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete category handler
  const handleDeleteConfirm = async () => {
    if (!deletingCategoryId || !user) return;
    try {
      await axiosInstance.delete(`/categories/${deletingCategoryId}`, {
        data: {
          updatedBy: user?.id ?? '',
        },
      });
      setIsDeleteOpen(false);
      setDeletingCategoryId(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setFormMode('create');
    setFormData({
      name: '',
      abbreviation: '',
      quantity: 0,
    });
    setFormError('');
    setSelectedCategoryId(null);
    setDeletingCategoryId(null);
  };

  // Trigger fetch when parameters change
  useEffect(() => {
    if (isAuthenticated) {
      const delayDebounceFn = setTimeout(() => {
        fetchCategories();
      }, 300); // Debounce search
      return () => clearTimeout(delayDebounceFn);
    }
  }, [fetchCategories, isAuthenticated]);

  const columns = [
    {
      accessor: 'name',
      header: 'Category Name',
      dataType: 'string',
      fontStyle: 'semibold',
      fontSize: 'sm',
      emphasizeLevel: 'high',
    },
    {
      accessor: 'abbreviation',
      header: 'Abbreviation',
      dataType: 'string',
      fontStyle: 'semibold',
      fontSize: 'xs',
      emphasizeLevel: 'medium',
    },
    {
      accessor: 'quantity',
      header: 'Quantity',
      dataType: 'number',
      fontStyle: 'semibold',
      fontSize: 'xs',
      emphasizeLevel: 'medium',
    },
    {
      accessor: 'createdAt',
      header: 'Created At',
      dataType: 'date',
      fontStyle: 'normal',
      fontSize: 'xs',
      emphasizeLevel: 'none',
    },
    {
      accessor: 'updatedAt',
      header: 'Updated At',
      dataType: 'date',
      fontStyle: 'normal',
      fontSize: 'xs',
      emphasizeLevel: 'none',
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

  // console.log(categories);

  return (
    <div className="flex max-h-screen min-h-screen flex-col bg-slate-50/50 px-4 py-8 font-sans text-slate-900 transition-all duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-6 flex w-fit gap-2 border-b-2 border-slate-300 pr-2 pb-2 dark:border-slate-700">
        <LucidePackage />
        <h5 className="font-league-spartan text-lg font-bold text-slate-900 dark:text-slate-100">
          Categories
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
              placeholder="Search category name..."
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
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <TableTemplate
          rows={categories}
          columns={columns}
          isLoading={isLoading}
          tableName="Categories"
          handleDeleteOpen={handleDeleteOpen}
          handleEditOpen={handleEditOpen}
          canDelete={user?.role === 'superadmin'}
          canEdit={user?.role === 'superadmin' || user?.role === 'admin'}
        />
      </main>

      {/* FORM MODAL (Add / Edit) */}
      {isFormOpen && (
        <AddEditCategory
          formMode={formMode}
          formData={formData}
          setFormData={setFormData}
          formError={formError}
          handleFormSubmit={handleFormSubmit}
          handleClose={handleClose}
          isSubmitting={isSubmitting}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && (
        <ConfirmationDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={() => handleDeleteConfirm()}
          title="Delete Category Confirmation"
          description="Are you sure you want to remove this category? This action is permanent and cannot be undone."
          type="delete"
          iconColor="text-rose-600 dark:text-rose-400"
        />
      )}
    </div>
  );
}
