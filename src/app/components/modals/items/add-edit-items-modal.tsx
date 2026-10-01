import { useUserContext } from '@/context/UserContext';
import { AlertCircle, Loader2, X } from 'lucide-react';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import dayjs from 'dayjs';
import { useState } from 'react';

interface AddEditItemsModalProps {
  formMode?: 'create' | 'edit';
  formData?: {
    name: string;
    oldAssetTag: string;
    serialNumber: string;
    description: string;
    hostname: string;
    categoryId: number | null;
    category: { id: number; name: string } | null;
    brandId: number | null;
    brand: { id: number; name: string } | null;
    locationId: number | null;
    location: { id: number; name: string } | null;
    officeId: number | null;
    office: { id: number; name: string } | null;
    status: string;
    assignedTo: number | null;
    createdAt: string;
    updatedAt: string;
    remarks: string;
  };
  setFormData?: (formData: any) => void;
  formError?: string;
  setFormError?: (formError: string) => void;
  isSubmitting?: boolean;
  statuses?: { label: string; value: string }[];
  editNewAsset?: boolean;
  setEditNewAsset?: (editNewAsset: boolean) => void;
  handleGenerateAssetTag?: () => void;
  modalRef?: React.RefObject<HTMLDivElement>;
  categoryRef?: React.RefObject<HTMLDivElement>;
  brandRef?: React.RefObject<HTMLDivElement>;
  supplierRef?: React.RefObject<HTMLDivElement>;
  locationRef?: React.RefObject<HTMLDivElement>;
  officeRef?: React.RefObject<HTMLDivElement>;
  employeeRef?: React.RefObject<HTMLDivElement>;
  categorySearch?: string;
  setCategorySearch?: (categorySearch: string) => void;
  showCategories?: boolean;
  setShowCategories?: (showCategories: boolean) => void;
  filteredCategories?: any[];
  brandSearch?: string;
  setBrandSearch?: (brandSearch: string) => void;
  showBrands?: boolean;
  setShowBrands?: (showBrands: boolean) => void;
  filteredBrands?: any[];
  supplierSearch?: string;
  setSupplierSearch?: (supplierSearch: string) => void;
  showSuppliers?: boolean;
  setShowSuppliers?: (showSuppliers: boolean) => void;
  filteredSuppliers?: any[];
  locationSearch?: string;
  setLocationSearch?: (locationSearch: string) => void;
  showLocations?: boolean;
  setShowLocations?: (showLocations: boolean) => void;
  filteredLocations?: any[];
  officeSearch?: string;
  setOfficeSearch?: (officeSearch: string) => void;
  showOffices?: boolean;
  setShowOffices?: (showOffices: boolean) => void;
  filteredOffices?: any[];
  employeeSearch?: string;
  setEmployeeSearch?: (employeeSearch: string) => void;
  showEmployees?: boolean;
  setShowEmployees?: (showEmployees: boolean) => void;
  filteredEmployees?: any[];
  handleClose: () => void;
  handleFormSubmit: (e: React.FormEvent) => void;
}

export default function AddEditItemsModal({
  formMode = 'create',
  formData = {
    name: '',
    oldAssetTag: '',
    serialNumber: '',
    description: '',
    hostname: '',
    categoryId: null,
    category: null,
    brandId: null,
    brand: null,
    locationId: null,
    location: null,
    officeId: null,
    office: null,
    status: '',
    assignedTo: null,
    createdAt: '',
    updatedAt: '',
    remarks: '',
  },
  setFormData = () => {},
  formError = '',
  isSubmitting = false,
  statuses,
  editNewAsset,
  setEditNewAsset,
  handleGenerateAssetTag = () => {},
  modalRef,
  categoryRef,
  brandRef,
  supplierRef,
  locationRef,
  officeRef,
  employeeRef,
  categorySearch,
  setCategorySearch,
  showCategories,
  setShowCategories,
  filteredCategories,
  setCategoryAbbr,
  brandSearch,
  setBrandSearch,
  showBrands,
  setShowBrands,
  filteredBrands,
  supplierSearch,
  setSupplierSearch,
  showSuppliers,
  setShowSuppliers,
  filteredSuppliers,
  locationSearch,
  setLocationSearch,
  showLocations,
  setShowLocations,
  filteredLocations,
  setLocationAbbr,
  officeSearch,
  setOfficeSearch,
  showOffices,
  setShowOffices,
  filteredOffices,
  setOfficeAbbr,
  employeeSearch,
  setEmployeeSearch,
  showEmployees,
  setShowEmployees,
  filteredEmployees,
  handleClose,
  handleFormSubmit,
}: AddEditItemsModalProps) {
  const { user } = useUserContext();
  const [isNewAsset, setIsNewAsset] = useState(true);
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {isSubmitting && (
          <div className="absolute inset-0 z-100 h-full w-full bg-slate-800/50">
            <div className="flex h-full w-full items-center justify-center text-white">
              Loading...
            </div>
          </div>
        )}

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
          <div
            className="max-h-[70vh] space-y-4 overflow-y-auto p-6"
            ref={modalRef}
          >
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

              {/* New/Old Indicator */}
              <div className="col-span-2">
                <div className="flex flex-row items-center justify-between gap-2">
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    New / Old
                  </label>
                  <div>
                    <div className="gap-2">
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        New
                      </label>
                      <input
                        type="checkbox"
                        checked={isNewAsset}
                        onChange={() => setIsNewAsset(!isNewAsset)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="gap-2">
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Old
                      </label>
                      <input
                        type="checkbox"
                        checked={!isNewAsset}
                        onChange={() => setIsNewAsset(!isNewAsset)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Old Asset Tag */}
              <div className="col-span-2">
                <div className="flex flex-row items-center justify-between gap-2">
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Old Asset Tag
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. GS-OA-26-L0001"
                  value={formData.oldAssetTag || ''}
                  onChange={(e) => {
                    if (
                      (user?.role.includes('superadmin') ||
                        user?.role.includes('admin')) &&
                      editNewAsset
                    ) {
                      setFormData({
                        ...formData,
                        oldAssetTag: e.target.value,
                      });
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* New Asset Tag */}
              <div className="col-span-2">
                <div className="flex flex-row items-center justify-between gap-2">
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    NEW ASSET TAG
                  </label>

                  {(user?.role.includes('superadmin') ||
                    user?.role.includes('admin')) && (
                    <div className="flex flex-row items-center gap-2">
                      <button
                        type="button"
                        className="cursor-pointer text-xs text-slate-500 hover:text-slate-600 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
                        onClick={() => handleGenerateAssetTag()}
                      >
                        Generate
                      </button>
                      <label className="text-xs text-slate-500 dark:text-slate-400">
                        Editable?
                      </label>
                      <input
                        type="checkbox"
                        checked={editNewAsset}
                        onChange={(e) => setEditNewAsset(e.target.checked)}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Click 'Generate' to generate an asset tag"
                    value={formData.newAssetTag || ''}
                    onChange={(e) => {
                      if (
                        (user?.role.includes('superadmin') ||
                          user?.role.includes('admin')) &&
                        editNewAsset
                      ) {
                        setFormData({
                          ...formData,
                          newAssetTag: e.target.value,
                        });
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />

                  {formData?.newAssetTag && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          newAssetTag: '',
                        });
                      }}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      aria-label="Clear new asset tag"
                    >
                      ✕
                    </button>
                  )}
                </div>
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

              <div ref={employeeRef}>
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
                                `${employee?.firstName || ''} ${employee?.lastName || ''}`
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

              {/* Deployment Date */}
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Deployment Date
                </label>
                <div className="relative w-full">
                  <Flatpickr
                    placeholder="Select Date"
<<<<<<< HEAD
                    value={formData?.deploymentDate || ''}
=======
                    value={formData.deploymentDate}
>>>>>>> a61ba6ee5e1412a9ba930f9e11ad645a274baf66
                    className="mr-0 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    options={{
                      dateFormat: 'Y-m-d',
                      locale: 'en',
                      onChange(date) {
                        console.log(dayjs(date[0]).toISOString());

                        setFormData({
                          ...formData,
                          deploymentDate: date
                            ? dayjs(date[0]).toISOString()
                            : null,
                        });
                      },
                    }}
                  />

                  {/* {formData.deploymentDate && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          deploymentDate: null,
                        });
                      }}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      aria-label="Clear location"
                    >
                      ✕
                    </button>
                  )} */}
                </div>
              </div>

              {/* Invoice No */}
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Invoice No
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Enter Invoice Number"
                    value={formData.invoiceNo}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        invoiceNo: e.target.value,
                      });
                    }}
                    className="mr-0 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />

                  {/* {formData.deploymentDate && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          deploymentDate: null,
                        });
                      }}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      aria-label="Clear location"
                    >
                      ✕
                    </button>
                  )} */}
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
  );
}
