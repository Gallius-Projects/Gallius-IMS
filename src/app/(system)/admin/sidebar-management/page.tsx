'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Home,
  LayoutDashboard,
  MonitorCog,
  Users,
  Building2,
  Building,
  Tags,
  Award,
  MapPin,
  Truck,
  Settings,
  UserCog,
  Shield,
  Database,
  Folder,
  FileText,
  Plus,
  Search,
  Trash2,
  AlertCircle,
  X,
  Loader2,
  ChevronDown,
  Check,
  icons,
  BriefcaseBusiness,
  UsersRound,
  LucidePanelLeft,
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useUserContext } from '@/context/UserContext';
import TableTemplate from '@/app/components/ui-templates/table-template';

interface SidebarLinks {
  id: number;
  name: string;
  path: string;
  icon: string;
  access: string[];
}

export default function SidebarManagement() {
  const iconRef = useRef<HTMLDivElement | null>(null);
  const roleRef = useRef<HTMLDivElement | null>(null);

  // Auth check
  const { user, isAuthenticated } = useUserContext();

  const [search, setSearch] = useState('');

  // Data states
  const [sidebarLinks, setSidebarLinks] = useState<SidebarLinks[]>([]);
  const [filteredSidebarLinks, setFilteredSidebarLinks] = useState<
    SidebarLinks[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedSidebarId, setSelectedSidebarId] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    icon: '',
    access: [],
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail / Delete target state
  const [deletingSidebarId, setDeletingSidebarId] = useState<number | null>(
    null
  );

  const [showIcons, setShowIcons] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Home');

  // Access roles state
  const [roles, setRoles] = useState<Role[]>([]);
  const [showRoles, setShowRoles] = useState(false);

  const commonIcons = [
    { name: 'Home', icon: Home },
    { name: 'LayoutDashboard', icon: LayoutDashboard },
    { name: 'MonitorCog', icon: MonitorCog },
    { name: 'Users', icon: Users },
    { name: 'Building2', icon: Building2 },
    { name: 'Building', icon: Building },
    { name: 'Tags', icon: Tags },
    { name: 'Award', icon: Award },
    { name: 'MapPin', icon: MapPin },
    { name: 'Truck', icon: Truck },
    { name: 'Settings', icon: Settings },
    { name: 'UserCog', icon: UserCog },
    { name: 'Shield', icon: Shield },
    { name: 'Database', icon: Database },
    { name: 'Folder', icon: Folder },
    { name: 'FileText', icon: FileText },
    { name: 'BriefcaseBusiness', icon: BriefcaseBusiness },
    { name: 'UsersRound', icon: UsersRound },
  ];

  const filteredIcons = commonIcons.filter((icon) =>
    icon.name.toLowerCase().includes(iconSearch.toLowerCase())
  );

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await axiosInstance.get('/roles');
      setRoles(response.data);
    };

    fetchRoles();
  }, []);

  // Fetch Offices callback
  const fetchSidebarLinks = useCallback(async () => {
    if (!localStorage.getItem('auth_token')) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/sidebar-management');

      setSidebarLinks(response.data);
    } catch (err: any) {
      console.error('Fetch sidebar links error:', err);
      setError(
        err.message ||
          'Could not connect to the database. Make sure MySQL is running.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const filteredLinks = sidebarLinks.filter(
      (sidebar: SidebarLinks) =>
        sidebar.name.toLowerCase().includes(search.toLowerCase()) ||
        sidebar.path.toLowerCase().includes(search.toLowerCase()) ||
        sidebar.icon.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSidebarLinks(filteredLinks);
  }, [search, sidebarLinks]);

  // Open form for creation
  const handleCreateOpen = () => {
    setFormData({
      name: '',
      path: '',
      icon: '',
      access: [],
    });
    setFormError('');
    setFormMode('create');
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleEditOpen = (sidebar: SidebarLinks) => {
    setFormMode('edit');
    setSelectedSidebarId(sidebar.id);
    setFormData({
      name: sidebar.name || '',
      path: sidebar.path || '',
      icon: sidebar.icon || '',
      access: sidebar?.sidebarLinkRoles?.map((role) => role?.roleId) || [],
    });

    setSelectedIcon(sidebar.icon || '');

    setFormError('');
    setIsFormOpen(true);
  };

  // Open delete confirm
  const handleDeleteOpen = (id: number) => {
    setDeletingSidebarId(id);
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
        await axiosInstance.post('/sidebar-management', {
          ...formData,
          updatedBy: user?.id ?? '',
        });
      } else {
        await axiosInstance.put(`/sidebar-management/${selectedSidebarId}`, {
          ...formData,
          updatedBy: user?.id ?? '',
        });
      }
      setIsFormOpen(false);
      fetchSidebarLinks();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save sidebar link');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete location handler
  const handleDeleteConfirm = async () => {
    if (!deletingSidebarId || !user) return;
    try {
      await axiosInstance.delete(`/sidebar-management/${deletingSidebarId}`, {
        data: {
          updatedBy: user?.id ?? '',
        },
      });
      setIsDeleteOpen(false);
      setDeletingSidebarId(null);
      fetchSidebarLinks();
    } catch (err: any) {
      alert(err.message || 'Failed to delete sidebar link');
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setFormMode('create');
    setFormData({
      name: '',
      path: '',
      icon: '',
      access: [],
    });
    setFormError('');
    setSelectedSidebarId(null);
    setDeletingSidebarId(null);
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const { checked } = e.target;
    if (checked) {
      setFormData((prev: any) => ({
        ...prev,
        access: [...prev.access, id],
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        access: prev.access.filter((accId: number) => accId !== id),
      }));
    }
  };

  // Trigger fetch when parameters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchSidebarLinks();
    }
  }, [fetchSidebarLinks, isAuthenticated]);

  const columns = [
    {
      header: 'Sidebar',
      accessor: 'name',
      dataType: 'string',
      fontStyle: 'bold',
      secondary: 'path',
    },
    {
      header: 'Icon',
      accessor: 'icon',
      dataType: 'string',
      fontStyle: 'normal',
    },
    {
      header: 'Access Level',
      accessor: 'access',
      dataType: 'array',
      fontStyle: 'normal',
    },
    {
      header: 'Updated By',
      accessor: 'updatedBy',
      dataType: 'string',
      fontStyle: 'normal',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconRef.current && !iconRef.current?.contains(event.target as Node)) {
        setShowIcons(false);
      }

      if (roleRef.current && !roleRef.current?.contains(event.target as Node)) {
        setShowRoles(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showIcons, showRoles, iconRef, roleRef]);

  // Get manually typed icon
  const ManualIcon = icons[selectedIcon as keyof typeof icons];

  // console.log(sidebarLinks);

  return (
    <div className="flex max-h-screen min-h-screen flex-col bg-slate-50/50 px-4 py-8 font-sans text-slate-900 transition-all duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-6 flex w-fit gap-2 border-b-2 border-slate-300 pr-2 pb-2 dark:border-slate-700">
        <LucidePanelLeft />
        <h5 className="font-league-spartan text-lg font-bold text-slate-900 dark:text-slate-100">
          Sidebar Management Page
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
              placeholder="Search sidebar name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {/* Filters Dropdown */}
          {/* Add New Button */}
          {/* <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCreateOpen}
              className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 lg:ml-0 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              <Plus className="h-4 w-4" />
              <span>Add Sidebar</span>
            </button>
          </div> */}
        </div>

        {/* Table Container */}
        <TableTemplate
          rows={filteredSidebarLinks}
          columns={columns}
          tableName="Sidebar Links"
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
                {formMode === 'create' ? 'Add New Sidebar' : 'Edit Sidebar'}
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
                      Sidebar Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Home, Locations, Inventory"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  {/* Path */}
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Path
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. /"
                      value={formData.path}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          path: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  {/* Access Selection */}
                  <div className="relative col-span-2" ref={roleRef}>
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Access Selection
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowRoles((prev) => !prev)}
                      className="flex min-h-[42px] w-full items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-left text-sm text-slate-900 transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {formData.access.length === 0 ? (
                          <span className="text-slate-400">
                            Select access...
                          </span>
                        ) : (
                          formData.access.map((accessId) => {
                            const role = roles.find(
                              (role) => role.id === accessId
                            );

                            if (!role) return null;

                            return (
                              <span
                                key={role.id}
                                className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              >
                                {role.name}
                              </span>
                            );
                          })
                        )}
                      </div>

                      <span
                        className={`ml-2 cursor-pointer text-slate-400 transition-all duration-200 ${showRoles && 'rotate-180'}`}
                      >
                        <ChevronDown />
                      </span>
                    </button>

                    {/* Dropdown */}
                    {showRoles && (
                      <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                        {/* Roles */}
                        <div className="max-h-52 overflow-y-auto">
                          {roles.map((role) => (
                            <label
                              key={role.id}
                              className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <input
                                type="checkbox"
                                checked={formData.access.includes(role.id)}
                                onChange={(e) =>
                                  handleCheckboxChange(e, role.id)
                                }
                                className="h-4 w-4 cursor-pointer rounded"
                              />

                              <span className="text-sm uppercase">
                                {role?.role || 'Undetected'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Icon Selection */}
                  <div className="col-span-2" ref={iconRef}>
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Icon Selection
                    </label>

                    <div className="relative w-full">
                      {/* Single Field */}
                      <div
                        className={`flex w-full items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm transition-all dark:bg-slate-900 ${
                          showIcons
                            ? 'border-blue-500 ring-1 ring-blue-500'
                            : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <Search size={17} className="shrink-0 text-slate-400" />

                        <input
                          type="text"
                          value={showIcons ? iconSearch : selectedIcon}
                          onFocus={() => {
                            setShowIcons(true);
                          }}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              icon: e.target.value,
                            }));

                            setIconSearch(e.target.value);
                            setSelectedIcon(e.target.value);
                            setShowIcons(true);
                          }}
                          placeholder="Search or type icon name..."
                          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
                        />

                        {/* Selected Icon */}
                        {!showIcons && ManualIcon && (
                          <ManualIcon
                            size={18}
                            className="shrink-0 text-slate-500"
                          />
                        )}

                        <ChevronDown
                          size={18}
                          className={`shrink-0 cursor-pointer text-slate-400 transition-transform ${
                            showIcons ? 'rotate-180' : ''
                          }`}
                          onClick={() => {
                            setShowIcons((prev) => !prev);
                          }}
                        />
                      </div>

                      {/* Dropdown */}
                      {showIcons && (
                        <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-lg border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                          {/* Common Icons */}
                          <div className="max-h-64 overflow-y-auto">
                            {filteredIcons.length > 0 ? (
                              <div className="grid grid-cols-4 gap-1">
                                {filteredIcons.map((item) => {
                                  const Icon = item.icon;

                                  const isSelected = selectedIcon === item.name;

                                  return (
                                    <button
                                      key={item.name}
                                      type="button"
                                      title={item.name}
                                      onClick={() => {
                                        setFormData((prev: any) => ({
                                          ...prev,
                                          icon: item.name,
                                        }));
                                        setSelectedIcon(item.name);
                                        setShowIcons(false);
                                      }}
                                      className={`relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md p-3 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 ${
                                        isSelected
                                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                          : ''
                                      }`}
                                    >
                                      <Icon size={20} />

                                      <span className="w-full truncate text-[10px]">
                                        {item.name}
                                      </span>

                                      {isSelected && (
                                        <Check
                                          size={12}
                                          className="absolute top-1 right-1"
                                        />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="p-3 text-center text-xs text-slate-400">
                                No common icons found.
                              </div>
                            )}
                          </div>

                          {/* Manually Typed Icon */}
                          {iconSearch &&
                            icons[iconSearch as keyof typeof icons] && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedIcon(iconSearch);
                                  setIconSearch('');
                                }}
                                className="mt-2 flex w-full items-center gap-3 rounded-md border-t border-slate-200 px-3 py-3 text-left text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                              >
                                {(() => {
                                  const Icon =
                                    icons[iconSearch as keyof typeof icons];

                                  return <Icon size={20} />;
                                })()}

                                <div>
                                  <p className="font-medium">
                                    Use "{iconSearch}"
                                  </p>

                                  <p className="text-xs text-slate-400">
                                    Custom Lucide icon
                                  </p>
                                </div>
                              </button>
                            )}
                        </div>
                      )}
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
                    'Save'
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
                  Delete Supplier Confirmation
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Are you sure you want to remove this supplier? This action is
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
