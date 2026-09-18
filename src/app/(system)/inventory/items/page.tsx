'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit,
  AlertCircle,
  X,
  Loader2,
  Filter,
  Eye,
  Info,
  LucideMonitor,
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useUserContext } from '@/context/UserContext';

interface InventoryItem {
  id: number;
  name: string;
  oldAssetTag: string;
  newAssetTag: string;
  serialNumber: string;
  description: string;
  hostname: string;
  categoryId: number;
  category: { id: number; name: string } | null;
  brandId: number;
  brand: { id: number; name: string } | null;
  locationId: number;
  location: { id: number; name: string } | null;
  officeId: number;
  office: { id: number; name: string } | null;
  status: string;
  assignedTo: number;
  createdAt: string;
  updatedAt: string;
  remarks: string;
}

export default function ItemsPage() {
  const locationRef = useRef<HTMLDivElement>(null);
  const employeeRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const supplierRef = useRef<HTMLDivElement>(null);
  const officeRef = useRef<HTMLDivElement>(null);

  // Auth check
  const { user, isAuthenticated } = useUserContext();

  // Data states
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Search & Filter states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    oldAssetTag: '',
    newAssetTag: '',
    serialNumber: '',
    description: '',
    hostname: '',
    categoryId: null,
    brandId: null,
    locationId: null,
    supplierId: null,
    officeId: null,
    assignedTo: null,
    status: 'SPARE',
    remarks: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail / Delete target state
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [locations, setLocations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [offices, setOffices] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [employeeSearch, setEmployeeSearch] = useState('');
  const [showEmployees, setShowEmployees] = useState(false);

  const [categorySearch, setCategorySearch] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  const [brandSearch, setBrandSearch] = useState('');
  const [showBrands, setShowBrands] = useState(false);

  const [supplierSearch, setSupplierSearch] = useState('');
  const [showSuppliers, setShowSuppliers] = useState(false);

  const [officeSearch, setOfficeSearch] = useState('');
  const [showOffices, setShowOffices] = useState(false);

  const [locationSearch, setLocationSearch] = useState('');
  const [showLocations, setShowLocations] = useState(false);

  const [categoryAbbr, setCategoryAbbr] = useState('--');
  const [locationAbbr, setLocationAbbr] = useState('--');
  const [officeAbbr, setOfficeAbbr] = useState('--');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setShowLocations(false);

        if (!formData.locationId) {
          setLocationSearch('');
        }
      }
      if (
        employeeRef.current &&
        !employeeRef.current.contains(event.target as Node)
      ) {
        setShowEmployees(false);

        if (!formData.assignedTo) {
          setEmployeeSearch('');
        }
      }
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setShowCategories(false);

        if (!formData.categoryId) {
          setCategorySearch('');
        }
      }
      if (
        brandRef.current &&
        !brandRef.current.contains(event.target as Node)
      ) {
        setShowBrands(false);

        if (!formData.brandId) {
          setBrandSearch('');
        }
      }
      if (
        supplierRef.current &&
        !supplierRef.current.contains(event.target as Node)
      ) {
        setShowSuppliers(false);

        if (!formData.supplierId) {
          setSupplierSearch('');
        }
      }
      if (
        officeRef.current &&
        !officeRef.current.contains(event.target as Node)
      ) {
        setShowOffices(false);

        if (!formData.officeId) {
          setOfficeSearch('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    formData,
    showEmployees,
    showCategories,
    showBrands,
    showSuppliers,
    showOffices,
    showLocations,
  ]);

  const filteredEmployees = employees.filter((employee: any) => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();

    return fullName.includes(employeeSearch.toLowerCase());
  });

  const filteredLocations = locations.filter((location: any) => {
    const locationName = `${location.name}`.toLowerCase();

    return locationName.includes(locationSearch.toLowerCase());
  });

  const filteredCategories = categories.filter((category: any) => {
    const categoryName = `${category.name}`.toLowerCase();

    return categoryName.includes(categorySearch.toLowerCase());
  });

  const filteredBrands = brands.filter((brand: any) => {
    const brandName = `${brand.name}`.toLowerCase();

    return brandName.includes(brandSearch.toLowerCase());
  });

  const filteredSuppliers = suppliers.filter((supplier: any) => {
    const supplierName = `${supplier.name}`.toLowerCase();

    return supplierName.includes(supplierSearch.toLowerCase());
  });

  const filteredOffices = offices.filter((office: any) => {
    const officeName = `${office.name}`.toLowerCase();

    return officeName.includes(officeSearch.toLowerCase());
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await axiosInstance.get('/brands');
      setBrands(response.data);
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await axiosInstance.get('/locations');
      setLocations(response.data);
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchOffices = async () => {
      const response = await axiosInstance.get('/offices');
      setOffices(response.data);
    };

    fetchOffices();
  }, []);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await axiosInstance.get('/suppliers');
      setSuppliers(response.data);
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await axiosInstance.get('/employees');
      setEmployees(response.data);
    };

    fetchEmployees();
  }, []);

  // Statuses list
  const statuses = [
    {
      value: 'SPARE',
      label: 'Spare',
      color:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50',
    },
    {
      value: 'DEPLOYED',
      label: 'Deployed',
      color:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/50',
    },
    {
      value: 'DEFECTIVE',
      label: 'Defective',
      color:
        'bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400 border border-slate-200/50 dark:border-slate-900/50',
    },
    {
      value: 'DONATED',
      label: 'Donated',
      color:
        'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50',
    },
    {
      value: 'DISPOSED',
      label: 'Disposed',
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
      description: '',
      hostname: '',
      categoryId: null,
      brandId: null,
      locationId: null,
      officeId: null,
      supplierId: null,
      assignedTo: null,
      status: 'SPARE',
      remarks: '',
    });
    setFormError('');
    setFormMode('create');
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleEditOpen = (item: InventoryItem) => {
    setFormMode('edit');
    setSelectedItemId(item.id);
    setFormData({
      name: item.name,
      oldAssetTag: item.oldAssetTag,
      newAssetTag: item.newAssetTag,
      serialNumber: item.serialNumber,
      description: item.description,
      hostname: item.hostname,
      remarks: item.remarks,
      categoryId: item.categoryId,
      brandId: item.brandId,
      locationId: item.locationId,
      officeId: item.officeId,
      supplierId: item.supplierId,
      assignedTo: item.assignedTo,
      status: item.status,
    });

    // Set the displayed dropdown values
    setCategorySearch(item.category?.name || '');
    setBrandSearch(item.brand?.name || '');
    setLocationSearch(item.location?.name || '');
    setOfficeSearch(item.office?.name || '');
    setSupplierSearch(item.supplier?.name || '');
    setEmployeeSearch(
      `${item.assignedEmp?.firstName} ${item.assignedEmp?.lastName}` || ''
    );

    setFormError('');
    setIsFormOpen(true);
  };

  // Open details modal
  const handleDetailOpen = (item: InventoryItem) => {
    setViewingItem(item);
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
        await axiosInstance.post('/items', {
          ...formData,
          updatedByUUID: user?.id ?? '',
        });
      } else {
        await axiosInstance.put(`/items/${selectedItemId}`, {
          ...formData,
          updatedByUUID: user?.id ?? '',
        });
      }
      setIsFormOpen(false);
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
    setIsFormOpen(false);
    setFormMode('create');
    setFormData({
      name: '',
      oldAssetTag: '',
      newAssetTag: '',
      serialNumber: '',
      hostname: '',
      status: '',
      categoryId: null,
      brandId: null,
      locationId: null,
      officeId: null,
      supplierId: null,
      description: '',
      assignedTo: null,
      remarks: '',
    });
    setFormError('');
    setSelectedItemId(null);
    setShowCategories(false);
    setShowBrands(false);
    setShowLocations(false);
    setShowOffices(false);
    setShowSuppliers(false);
    setShowEmployees(false);
    setCategorySearch('');
    setBrandSearch('');
    setLocationSearch('');
    setOfficeSearch('');
    setSupplierSearch('');
    setEmployeeSearch('');
  };

  useEffect(() => {
    const slicedYear = new Date().getFullYear().toString().slice(-2);
    const officeCode = officeAbbr || '--';
    const locationCode = locationAbbr || '--';
    const categoryCode = categoryAbbr || '--';

    const generated = `${officeCode}-${locationCode}-PEZ${slicedYear}-${categoryCode}(TBD)`;

    setFormData({
      ...formData,
      newAssetTag: generated,
    });
  }, [officeAbbr, locationAbbr, categoryAbbr]);

  // Trigger fetch when parameters change
  useEffect(() => {
    if (isAuthenticated) {
      const delayDebounceFn = setTimeout(() => {
        fetchItems();
      }, 300); // Debounce search
      return () => clearTimeout(delayDebounceFn);
    }
  }, [fetchItems, isAuthenticated]);

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
                    {s.label}
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
        <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50 dark:border-slate-800/60 dark:bg-slate-950">
                <th className="px-5 py-3.5 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Asset Name
                </th>
                <th className="px-5 py-3.5 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Category
                </th>
                <th className="px-5 py-3.5 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Hostname
                </th>
                <th className="px-5 py-3.5 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Serial Number
                </th>
                <th className="px-5 py-3.5 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Status
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
                      <span>Loading assets...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-slate-400 dark:text-slate-500"
                  >
                    No assets found. Try adjusting filters or create a new
                    inventory item.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const statusConfig = statuses.find(
                    (s) => s.value === item.status
                  ) || {
                    label: item.status,
                    color:
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
                  };

                  return (
                    <tr
                      key={item.id}
                      className="group transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                    >
                      <td className="px-5 py-4">
                        <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className="mt-0.5 line-clamp-1 max-w-xs text-[11px] text-slate-400 dark:text-slate-500">
                          {item.description || 'No description provided'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {item?.category?.name}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                          {item.hostname || (
                            <span className="text-slate-300 dark:text-slate-700">
                              —
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                          {item.serialNumber || (
                            <span className="text-slate-300 dark:text-slate-700">
                              —
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-lg px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Details Button */}
                          <button
                            onClick={() => handleDetailOpen(item)}
                            className="dark:hover:bg-slate-850 cursor-pointer rounded-lg border border-slate-200/50 bg-white p-1.5 text-slate-400 transition-all hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:hover:text-indigo-400"
                            title="View Details & Remarks"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditOpen(item)}
                            className="dark:hover:bg-slate-850 cursor-pointer rounded-lg border border-slate-200/50 bg-white p-1.5 text-slate-400 transition-all hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:hover:text-indigo-400"
                            title="Edit Asset"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteOpen(item.id)}
                            className="cursor-pointer rounded-lg border border-slate-200/50 bg-white p-1.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:hover:bg-rose-950/20 dark:hover:text-rose-400"
                            title="Delete Asset"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
                  ? 'Add New Inventory Asset'
                  : 'Edit Inventory Asset'}
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
                      Asset Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dell PowerEdge R740"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  {/* Category */}
                  <div ref={categoryRef}>
                    <div className="relative">
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Category *
                      </label>

                      <div className="relative">
                        <input
                          type="text"
                          value={categorySearch}
                          placeholder="Select Category"
                          onFocus={() => setShowCategories(true)}
                          onChange={(e) => {
                            setCategorySearch(e.target.value);
                            setShowCategories(true);
                          }}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />

                        {/* Clear button */}
                        {categorySearch && (
                          <button
                            type="button"
                            onClick={() => {
                              setCategorySearch('');
                              setFormData({
                                ...formData,
                                categoryId: null,
                              });
                              setShowCategories(false);
                            }}
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            aria-label="Clear category"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {showCategories && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((category: any) => (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    categoryId: category.id,
                                  });

                                  setCategorySearch(category.name);
                                  setShowCategories(false);

                                  setCategoryAbbr(
                                    category?.abbreviation || '--'
                                  );
                                }}
                                className="block w-full px-3.5 py-2.5 text-left text-sm text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
                              >
                                {category.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-3.5 py-2.5 text-sm text-slate-500">
                              No categories found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Brand */}
                  <div ref={brandRef}>
                    <div className="relative">
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Brand *
                      </label>

                      <div className="relative">
                        <input
                          type="text"
                          value={brandSearch}
                          placeholder="Select Brand"
                          onFocus={() => setShowBrands(true)}
                          onChange={(e) => {
                            setBrandSearch(e.target.value);
                            setShowBrands(true);

                            // Optional: clear current selection while searching
                            setFormData({
                              ...formData,
                              brandId: parseInt(e.target.value),
                            });
                          }}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />

                        {brandSearch && (
                          <button
                            type="button"
                            onClick={() => {
                              setBrandSearch('');
                              setFormData({
                                ...formData,
                                brandId: null,
                              });
                              setShowBrands(false);
                            }}
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            aria-label="Clear brand"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {showBrands && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                          {filteredBrands.length > 0 ? (
                            filteredBrands.map((brand: any) => (
                              <button
                                key={brand.id}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    brandId: brand.id,
                                  });

                                  setBrandSearch(brand.name);

                                  setShowBrands(false);
                                }}
                                className="block w-full cursor-pointer px-3.5 py-2.5 text-left text-sm text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
                              >
                                {brand.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-3.5 py-2.5 text-sm text-slate-500">
                              No brands found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Supplier */}
                  <div ref={supplierRef}>
                    <div className="relative">
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Supplier *
                      </label>

                      <div className="relative">
                        <input
                          type="text"
                          value={supplierSearch}
                          placeholder="Select Supplier"
                          onFocus={() => setShowSuppliers(true)}
                          onChange={(e) => {
                            setSupplierSearch(e.target.value);
                            setShowSuppliers(true);

                            // Optional: clear current selection while searching
                            setFormData({
                              ...formData,
                              supplierId: parseInt(e.target.value),
                            });
                          }}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />

                        {supplierSearch && (
                          <button
                            type="button"
                            onClick={() => {
                              setSupplierSearch('');
                              setFormData({
                                ...formData,
                                supplierId: null,
                              });
                              setShowSuppliers(false);
                            }}
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            aria-label="Clear supplier"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {showSuppliers && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                          {filteredSuppliers.length > 0 ? (
                            filteredSuppliers.map((supplier: any) => (
                              <button
                                key={supplier.id}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    supplierId: supplier.id,
                                  });

                                  setSupplierSearch(supplier.name);

                                  setShowSuppliers(false);
                                }}
                                className="block w-full px-3.5 py-2.5 text-left text-sm text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
                              >
                                {supplier.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-3.5 py-2.5 text-sm text-slate-500">
                              No suppliers found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Offices */}
                  <div ref={officeRef}>
                    <div className="relative">
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Offices *
                      </label>

                      <div className="relative">
                        <input
                          type="text"
                          value={officeSearch}
                          placeholder="Select Office"
                          onFocus={() => setShowOffices(true)}
                          onChange={(e) => {
                            setOfficeSearch(e.target.value);
                            setShowOffices(true);

                            // Optional: clear current selection while searching
                            setFormData({
                              ...formData,
                              officeId: parseInt(e.target.value),
                            });
                          }}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />

                        {officeSearch && (
                          <button
                            type="button"
                            onClick={() => {
                              setOfficeSearch('');
                              setFormData({
                                ...formData,
                                officeId: null,
                              });
                              setShowOffices(false);
                            }}
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            aria-label="Clear office"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {showOffices && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                          {filteredOffices.length > 0 ? (
                            filteredOffices.map((office: any) => (
                              <button
                                key={office.id}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    officeId: office.id,
                                  });

                                  setOfficeSearch(office.name);
                                  setOfficeAbbr(office.abbreviation);

                                  setShowOffices(false);
                                }}
                                className="block w-full px-3.5 py-2.5 text-left text-sm text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
                              >
                                {office.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-3.5 py-2.5 text-sm text-slate-500">
                              No offices found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div ref={locationRef}>
                    <div className="relative">
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Location *
                      </label>

                      <div className="relative">
                        <input
                          type="text"
                          value={locationSearch}
                          placeholder="Select Location"
                          onFocus={() => setShowLocations(true)}
                          onChange={(e) => {
                            setLocationSearch(e.target.value);
                            setShowLocations(true);

                            // Optional: clear current selection while searching
                            setFormData({
                              ...formData,
                              locationId: parseInt(e.target.value),
                            });
                          }}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />

                        {locationSearch && (
                          <button
                            type="button"
                            onClick={() => {
                              setLocationSearch('');
                              setFormData({
                                ...formData,
                                locationId: null,
                              });
                              setShowLocations(false);
                            }}
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            aria-label="Clear location"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {showLocations && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                          {filteredLocations.length > 0 ? (
                            filteredLocations.map((location: any) => (
                              <button
                                key={location.id}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    locationId: location.id,
                                  });

                                  setLocationSearch(location.name);
                                  setLocationAbbr(location.abbreviation);

                                  setShowLocations(false);
                                }}
                                className="block w-full px-3.5 py-2.5 text-left text-sm text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
                              >
                                {location.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-3.5 py-2.5 text-sm text-slate-500">
                              No locations found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    >
                      {statuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Asset Tag */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Asset Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. IMSB-0001"
                      value={formData.oldAssetTag || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          oldAssetTag: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  {/* New Asset Tag */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      NEW ASSET TAG
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. IMSB-0001"
                      value={formData.newAssetTag || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newAssetTag: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  {/* Hostname */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Hostname
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. GSIT-001"
                      value={formData.hostname}
                      onChange={(e) =>
                        setFormData({ ...formData, hostname: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  {/* Serial Number */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SN-8492049"
                      value={formData.serialNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serialNumber: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div className="col-span-2" ref={employeeRef}>
                    <div className="relative">
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Assigned to
                      </label>

                      <input
                        type="text"
                        value={employeeSearch}
                        placeholder="Select Employee"
                        onFocus={() => setShowEmployees(true)}
                        onChange={(e) => {
                          setEmployeeSearch(e.target.value);
                          setShowEmployees(true);

                          // Optional: clear current selection while searching
                          setFormData({
                            ...formData,
                            assignedTo: parseInt(e.target.value),
                          });
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />

                      {showEmployees && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                          {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((employee: any) => (
                              <button
                                key={employee.id}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    assignedTo: employee.id,
                                  });

                                  setEmployeeSearch(
                                    `${employee.firstName} ${employee.lastName}`
                                  );

                                  setShowEmployees(false);
                                }}
                                className="block w-full px-3.5 py-2.5 text-left text-sm text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
                              >
                                {employee.firstName} {employee.lastName}
                              </button>
                            ))
                          ) : (
                            <div className="px-3.5 py-2.5 text-sm text-slate-500">
                              No employees found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter detailed technical specs or descriptions..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  {/* Remarks */}
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Remarks
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Deployment locations, user logs, physical conditions, etc."
                      value={formData.remarks}
                      onChange={(e) =>
                        setFormData({ ...formData, remarks: e.target.value })
                      }
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
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
                    'Save Asset'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL VIEW MODAL */}
      {isDetailOpen && viewingItem && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200/60 px-6 py-4 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <Info className="h-4.5 w-4.5 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Asset Specifications
                </h3>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200/40 bg-slate-50 p-4 dark:border-slate-800/40 dark:bg-slate-950/40">
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                    Category
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {viewingItem?.category?.name || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                    Brand
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {viewingItem?.brand?.name || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                    Supplier
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {viewingItem?.supplier?.name || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                    Hostname
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {viewingItem.hostname || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                    Asset Tag
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {viewingItem?.oldAssetTag || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                    New Asset Tag
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {viewingItem?.newAssetTag || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                    Location
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {viewingItem?.location?.name || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                    Serial Number
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {viewingItem.serialNumber || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                    Current Status
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {viewingItem.status}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                    Last Sync
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(viewingItem.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Description
                </span>
                <div className="text-slate-755 max-h-40 overflow-y-auto rounded-xl border border-slate-200/40 bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap dark:border-slate-800/40 dark:bg-slate-950/30 dark:text-slate-300">
                  {viewingItem.description || 'No description provided.'}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <span className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  Remarks
                </span>
                <div className="text-slate-755 max-h-40 overflow-y-auto rounded-xl border border-slate-200/40 bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap dark:border-slate-800/40 dark:bg-slate-950/30 dark:text-slate-300">
                  {viewingItem.remarks || 'No remarks provided.'}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end border-t border-slate-200/60 bg-slate-50 px-6 py-4 dark:border-slate-800/60 dark:bg-slate-900/50">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                Close View
              </button>
            </div>
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
