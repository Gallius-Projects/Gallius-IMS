'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, AlertCircle, LucidePackage } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useUserContext } from '@/context/UserContext';
import TableTemplate from '@/app/components/ui-templates/table-template';
import { ConfirmationDialog } from '@/app/components/ui-templates/confirmation-dialog';
import AddEditLocationModal from '@/app/components/modals/locations/add-edit-location';

interface Location {
  id: number;
  name: string;
  abbreviation: string;
}

export default function LocationsPage() {
  // Auth check
  const { user, isAuthenticated } = useUserContext();

  const [search, setSearch] = useState('');

  // Data states
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail / Delete target state
  const [deletingLocationId, setDeletingLocationId] = useState<number | null>(
    null
  );

  // Fetch Locations callback
  const fetchLocations = useCallback(async () => {
    if (!localStorage.getItem('auth_token')) return;
    setIsLoading(true);
    setError('');
    try {
      const params: any = {};
      if (search) params.search = search;

      const response = await axiosInstance.get('/locations', { params });
      setLocations(response.data);
    } catch (err: any) {
      console.error('Fetch locations error:', err);
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
    });
    setFormError('');
    setFormMode('create');
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleEditOpen = (location: Location) => {
    setFormMode('edit');
    setSelectedLocationId(location.id);
    setFormData({
      name: location.name || '',
      abbreviation: location.abbreviation || '',
    });

    setFormError('');
    setIsFormOpen(true);
  };

  // Open delete confirm
  const handleDeleteOpen = (id: number) => {
    setDeletingLocationId(id);
    setIsDeleteOpen(true);
  };

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!formData.name) {
      setFormError('Location name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      if (formMode === 'create') {
        await axiosInstance.post('/locations', {
          ...formData,
          updatedBy: user?.id ?? '',
        });
      } else {
        await axiosInstance.put(`/locations/${selectedLocationId}`, {
          ...formData,
          updatedBy: user?.id ?? '',
        });
      }
      setIsFormOpen(false);
      fetchLocations();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save location');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete location handler
  const handleDeleteConfirm = async () => {
    if (!deletingLocationId || !user) return;
    try {
      await axiosInstance.delete(`/locations/${deletingLocationId}`, {
        data: {
          updatedBy: user?.id ?? '',
        },
      });
      setIsDeleteOpen(false);
      setDeletingLocationId(null);
      fetchLocations();
    } catch (err: any) {
      alert(err.message || 'Failed to delete location');
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setFormMode('create');
    setFormData({
      name: '',
      abbreviation: '',
    });
    setFormError('');
    setSelectedLocationId(null);
    setDeletingLocationId(null);
  };

  // Trigger fetch when parameters change
  useEffect(() => {
    if (isAuthenticated) {
      const delayDebounceFn = setTimeout(() => {
        fetchLocations();
      }, 300); // Debounce search
      return () => clearTimeout(delayDebounceFn);
    }
  }, [fetchLocations, isAuthenticated]);

  const columns = [
    {
      header: 'Location',
      accessor: 'name',
      dataType: 'string',
      fontStyle: 'semibold',
      fontSize: 'sm',
      emphasizeLevel: 'high',
    },
    {
      header: 'Abbreviation',
      accessor: 'abbreviation',
      dataType: 'string',
      fontStyle: 'bold',
      fontSize: 'xs',
      emphasizeLevel: 'normal',
    },
  ];

  return (
    <div className="flex max-h-screen min-h-screen flex-col bg-slate-50/50 px-4 py-8 font-sans text-slate-900 transition-all duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-6 flex w-fit gap-2 border-b-2 border-slate-300 pr-2 pb-2 dark:border-slate-700">
        <LucidePackage />
        <h5 className="font-league-spartan text-lg font-bold text-slate-900 dark:text-slate-100">
          Locations
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
      <main className="space-y-4 overflow-y-scroll rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search location name..."
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
              <span>Add Location</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <TableTemplate
          rows={locations}
          columns={columns}
          tableName="Locations"
          isLoading={isLoading}
          handleDetailOpen={() => {}}
          handleEditOpen={handleEditOpen}
          handleDeleteOpen={handleDeleteOpen}
          canEdit={user?.role == 'admin' || user?.role == 'superadmin'}
          canDelete={user?.role == 'superadmin'}
        />
      </main>

      {/* FORM MODAL (Add / Edit) */}
      {isFormOpen && (
        <AddEditLocationModal
          formMode={formMode}
          formData={formData}
          setFormData={setFormData}
          formError={formError}
          isSubmitting={isSubmitting}
          handleFormSubmit={handleFormSubmit}
          handleClose={handleClose}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && (
        <ConfirmationDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Location"
          description={`Are you sure you want to delete ${locations.find((location) => location.id === deletingLocationId)?.name}?`}
          isLoading={isLoading}
          type="delete"
          iconColor="text-rose-600 dark:text-rose-400"
        />
      )}
    </div>
  );
}
