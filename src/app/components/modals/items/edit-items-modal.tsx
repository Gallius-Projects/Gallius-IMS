import { useUserContext } from '@/context/UserContext';
import { AlertCircle, Loader2, X } from 'lucide-react';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import dayjs from 'dayjs';
import SearchableDropdown from '../../ui-templates/searchable-dropdown';
import axiosInstance from '@/lib/axiosInstance';
import { useEffect, useRef, useState } from 'react';
import Dropdown from '../../ui-templates/dropdown';

interface EditItemsModalProps {
  formMode?: 'create' | 'edit';
  isOpen: boolean;
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
    remarks: string;
    datePurchased: Date | null;
    dateDeployed: Date | null;
    invoiceNo: string;
    assetCondition: string;
    isNew: boolean;
  };
  setFormData?: (formData: any) => void;
  formError?: string;
  setFormError?: (formError: string) => void;
  isSubmitting?: boolean;
  statuses?: { label: string; value: string }[];
  editNewAsset?: boolean;
  setEditNewAsset?: (editNewAsset: boolean) => void;
  handleGenerateAssetTag?: () => void;
  categories?: any;
  handleClose: () => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  itemToUpdate: any;
}

export default function EditItemsModal({
  formMode = 'create',
  isOpen = false,
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
    remarks: '',
    datePurchased: null,
    dateDeployed: null,
    invoiceNo: '',
    assetCondition: '',
    isNew: true,
  },
  setFormData = () => {},
  formError = '',
  isSubmitting = false,
  statuses,
  editNewAsset,
  categories,
  setEditNewAsset,
  handleGenerateAssetTag = () => {},
  handleClose,
  handleFormSubmit,
}: EditItemsModalProps) {
  const { user } = useUserContext();

  const modalRef = useRef<HTMLDivElement>(null);

  const [itemDetails, setItemDetails] = useState([]);

  const [brands, setBrands] = useState([]);
  const [locations, setLocations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [offices, setOffices] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [employeeSearch, setEmployeeSearch] = useState('');

  const [deployedBySearch, setDeployedBySearch] = useState('');

  const [categorySearch, setCategorySearch] = useState('');

  const [brandSearch, setBrandSearch] = useState('');

  const [supplierSearch, setSupplierSearch] = useState('');

  const [officeSearch, setOfficeSearch] = useState('');

  const [locationSearch, setLocationSearch] = useState('');

  useEffect(() => {
    console.log(formMode);

    if (formMode === 'edit') {
      console.log(formMode);

      const handleEmbedItemDetails = async () => {
        const getOldItem = await axiosInstance.get(`/items/${item.id}`);
        const oldItemData = getOldItem.data;

        setItemDetails(oldItemData);

        setFormData({
          name: oldItemData?.name || '',
          oldAssetTag: oldItemData?.oldAssetTag || '',
          newAssetTag: oldItemData?.newAssetTag || '',
          serialNumber: oldItemData?.serialNumber || '',
          hostname: oldItemData?.hostname || '',
          status: oldItemData?.status.toUpperCase() || '',
          categoryId: oldItemData?.categoryId || null,
          brandId: oldItemData?.brandId || null,
          locationId: oldItemData?.locationId || null,
          officeId: oldItemData?.officeId || null,
          supplierId: oldItemData?.supplierId || null,
          datePurchased: oldItemData?.datePurchased || null,
          dateDeployed: oldItemData?.dateDeployed || null,
          invoiceNo: oldItemData?.invoiceNo || '',
          assetCondition: oldItemData?.assetCondition || '',
          isNew: oldItemData?.isNew ?? true,
          assignedTo: oldItemData?.assignedTo || null,
          description: oldItemData?.description || '',
          remarks: oldItemData?.remarks || '',
        });

        setCategorySearch(oldItemData?.category?.name || '');
        setBrandSearch(oldItemData?.brand?.name || '');
        setLocationSearch(oldItemData?.location?.name || '');
        setOfficeSearch(oldItemData?.office?.name || '');
        setSupplierSearch(oldItemData?.supplier?.name || '');
        setEmployeeSearch(
          `${oldItemData?.assignedEmp?.firstName} ${oldItemData?.assignedEmp?.lastName}` ||
            ''
        );
      };

      handleEmbedItemDetails();
    }
  }, [isOpen, formMode]);

  console.log(itemDetails);

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

  const assetConditions = [
    { id: 1, name: 'Excellent' },
    { id: 2, name: 'Good' },
    { id: 3, name: 'Fair' },
    { id: 4, name: 'Poor' },
    { id: 5, name: 'Broken' },
  ];

  useEffect(() => {
    if (formError) {
      modalRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [formError]);

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
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
            Edit Inventory Asset
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
              <SearchableDropdown
                label="Category"
                data={categories}
                // ref={categoryRef}
                search={categorySearch}
                setSearch={setCategorySearch}
                onChange={(value: any) => {
                  setFormData({
                    ...formData,
                    categoryId: parseInt(value),
                  });
                }}
                placeholder="Select Category"
                required
              />

              {/* Brand */}
              <SearchableDropdown
                label="Brand"
                data={brands}
                // ref={brandRef}
                search={brandSearch}
                setSearch={setBrandSearch}
                placeholder="Select Brand"
                required
                onChange={(value: any) => {
                  setFormData({
                    ...formData,
                    brandId: parseInt(value),
                  });
                }}
              />

              {/* Supplier */}
              <SearchableDropdown
                label="Supplier"
                data={suppliers}
                // ref={supplierRef}
                search={supplierSearch}
                setSearch={setSupplierSearch}
                placeholder="Select Supplier"
                required
                onChange={(value: any) => {
                  setFormData({
                    ...formData,
                    supplierId: parseInt(value),
                  });
                }}
              />

              {/* Offices */}
              <SearchableDropdown
                label="Tenant"
                data={offices}
                // ref={officeRef}
                search={officeSearch}
                setSearch={setOfficeSearch}
                placeholder="Select Tenant"
                required
                onChange={(value: any) => {
                  setFormData({
                    ...formData,
                    officeId: parseInt(value),
                  });
                }}
              />

              {/* Location */}
              <SearchableDropdown
                label="Location"
                data={locations}
                // ref={locationRef}
                value={locationSearch}
                placeholder="Select Location"
                required
                onChange={(value: any) => {
                  setFormData({
                    ...formData,
                    locationId: parseInt(value),
                  });
                }}
              />

              {/* Status */}
              <Dropdown
                label="Status"
                data={statuses}
                value={
                  formData?.status
                    ? statuses.find(
                        (item) =>
                          item.name.toLowerCase() ===
                          formData?.status?.toLowerCase()
                      )?.name
                    : ''
                }
                onChange={(value: any) => {
                  console.log(value);

                  setFormData({
                    ...formData,
                    status: value ? value?.name?.toUpperCase() : '',
                  });
                }}
                placeholder="Select Status"
                required
              />

              {/* New/Old Indicator */}
              <div className="col-span-2 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  NEW / OLD
                </label>

                <div className="flex rounded-xl bg-slate-200 p-1 dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        isNew: true,
                        oldAssetTag: '',
                      });
                      handleGenerateAssetTag();
                    }}
                    aria-pressed={formData.isNew}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                      formData.isNew
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    New
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        isNew: false,
                        newAssetTag: '',
                      });
                    }}
                    aria-pressed={!formData.isNew}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                      !formData.isNew
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    Old
                  </button>
                </div>
              </div>

              {/* New Asset Tag */}
              {/* Old Asset Tag */}
              {formData.isNew ? (
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
                        <button
                          type="button"
                          onClick={() => setEditNewAsset(!editNewAsset)}
                          className="cursor-pointer text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title={`${editNewAsset ? 'Make uneditable' : 'Make editable'}`}
                        >
                          {editNewAsset ? 'Editable' : 'Uneditable'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Click 'Generate' to generate an asset tag"
                      value={formData.newAssetTag || ''}
                      disabled={!editNewAsset}
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

                    <div className="absolute top-1/2 right-3 flex -translate-y-1/2 gap-2">
                      {/* <button
                        type="button"
                        onClick={() => setEditNewAsset(!editNewAsset)}
                        className="cursor-pointer text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title={`${editNewAsset ? 'Make uneditable' : 'Make editable'}`}
                      >
                        {editNewAsset ? (
                          <PencilOff className="h-4 w-4" />
                        ) : (
                          <Pencil className="h-4 w-4" />
                        )}
                      </button> */}

                      {formData?.newAssetTag && editNewAsset && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              newAssetTag: '',
                            });
                          }}
                          className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          aria-label="Clear new asset tag"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
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
                        user?.role.includes('superadmin') ||
                        user?.role.includes('admin')
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
              )}

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

              {/* Employee Select */}
              <SearchableDropdown
                label="Assigned to"
                data={employees.map((emp: any) => ({
                  ...emp,
                  name: `${emp?.firstName} ${emp?.lastName}`,
                }))}
                // ref={employeeRef}
                search={employeeSearch}
                setSearch={setEmployeeSearch}
                placeholder="Select Employee"
                required
                onChange={(value: any) => {
                  setFormData({
                    ...formData,
                    assignedTo: parseInt(value),
                  });
                }}
              />

              {/* Deployed By */}
              <SearchableDropdown
                label="Deployed by"
                data={employees.map((emp: any) => ({
                  ...emp,
                  name: `${emp?.firstName} ${emp?.lastName}`,
                }))}
                // ref={deployedByRef}
                value={deployedBySearch}
                placeholder="Select Deployee"
                required
                onChange={(value: any) => {
                  setFormData({
                    ...formData,
                    deployedBy: parseInt(value),
                  });
                }}
              />

              {/*  Date Purchased */}
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Date Purchased
                </label>
                <div className="relative w-full">
                  <Flatpickr
                    placeholder="Select Date"
                    value={formData?.datePurchased || ''}
                    className="mr-0 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    options={{
                      dateFormat: 'm-d-Y',
                      locale: 'en',
                      onChange(date) {
                        console.log(dayjs(date[0]).toISOString());

                        setFormData({
                          ...formData,
                          datePurchased: date
                            ? dayjs(date[0]).toISOString()
                            : null,
                        });
                      },
                    }}
                  />

                  {formData.datePurchased && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          datePurchased: null,
                        });
                      }}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      aria-label="Clear date purchased"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Date Deployed */}
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Date Deployed
                </label>
                <div className="relative w-full">
                  <Flatpickr
                    placeholder="Select Date"
                    value={formData?.dateDeployed || ''}
                    className="mr-0 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    options={{
                      dateFormat: 'm-d-Y',
                      locale: 'en',
                      onChange(date) {
                        console.log(dayjs(date[0]).toISOString());

                        setFormData({
                          ...formData,
                          dateDeployed: date
                            ? dayjs(date[0]).toISOString()
                            : null,
                        });
                      },
                    }}
                  />

                  {formData.dateDeployed && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          dateDeployed: null,
                        });
                      }}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      aria-label="Clear location"
                    >
                      ✕
                    </button>
                  )}
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
                </div>
              </div>

              <Dropdown
                label="Asset Condition"
                placeholder="Select Asset Condition"
                data={assetConditions}
                value={
                  formData?.assetCondition
                    ? assetConditions.find(
                        (item) =>
                          item.name?.toLowerCase() ===
                          formData?.assetCondition?.toLowerCase()
                      )?.name
                    : ''
                }
                onChange={(value: any) => {
                  setFormData({
                    ...formData,
                    assetCondition: value ? value?.name?.toUpperCase() : '',
                  });
                }}
                required
              />

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
