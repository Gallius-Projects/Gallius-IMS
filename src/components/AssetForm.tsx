import { useState } from 'react';
import type { Asset } from '../types/asset';
import { CATEGORY_LIST, STATUS_LIST, CONDITION_LIST } from '../types/asset';
import SearchableDropdown from './textfields/searchable-dropdown';
import { Pencil, PencilOff } from 'lucide-react';

interface AssetFormProps {
  initialData: Asset | null;
  existingTags: string[];
  existingSerials: string[];
  onSave: (data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function AssetForm({
  initialData,
  existingTags,
  existingSerials,
  onSave,
  onCancel,
}: AssetFormProps) {
  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    serialNumber: initialData?.serialNumber ?? '',
    assetTag: initialData?.assetTag ?? '',
    category: initialData?.category ?? CATEGORY_LIST[0],
    purchasePrice: initialData?.purchasePrice ?? 0,
    purchaseDate: initialData?.purchaseDate
      ? initialData.purchaseDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    condition: initialData?.condition ?? CONDITION_LIST[0],
    status: initialData?.status ?? STATUS_LIST[0],
    assignedTo: initialData?.assignedTo ?? '',
    department: initialData?.department ?? '',
    location: initialData?.location ?? '',
    description: initialData?.description ?? '',
    vendor: initialData?.vendor ?? '',
    warrantyExpiry: initialData?.warrantyExpiry ? initialData.warrantyExpiry.slice(0, 10) : '',
  });

  const [editNewAsset, setEditNewAsset] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string | number) => setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.assetTag.trim()) e.assetTag = 'Asset tag is required';
    else if (existingTags.includes(form.assetTag.trim())) e.assetTag = 'Asset tag already exists';
    if (!form.serialNumber.trim()) e.serialNumber = 'Serial number is required';
    else if (existingSerials.includes(form.serialNumber.trim()))
      e.serialNumber = 'Serial number already exists';
    if (!form.location.trim()) e.location = 'Location is required';
    if (form.purchasePrice < 0) e.purchasePrice = 'Price must be positive';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      name: form.name.trim(),
      category: form.categoryId,
      brandId: form.brandId,
      supplierId: form.supplierId,
      office: form.officeId,
      locationId: form.locationId,
      status: form.status as Asset['status'],
      isNew: form.isNew,
      newAssetTag: form.newAssetTag.trim(),
      oldAssetTag: form.oldAssetTag.trim(),
      hostname: form.hostname.trim(),
      serialNumber: form.serialNumber.trim(),
      itemPrice: Number(form.itemPrice),
      datePurchased: form.datePurchased,
      deployedById: form.deployedById,
      dateDeployed: form.dateDeployed,
      assignedTo: form.assignedTo,
      invoiceNo: form.invoiceNo.trim(),
      warrantyExpiry: form.warrantyExpiry || undefined,
      assetCondition: form.condition as Asset['condition'],
      description: form.description.trim(),
      remarks: form.remarks.trim(),
    });
  };

  const LabeledField = ({
    label,
    error,
    children,
  }: {
    label: string;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div>
      <label
        className="mb-1 block text-xs font-semibold"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-0.5 text-xs text-red-500">{error}</p>}
    </div>
  );

  const handleAssetTag = async () => {
    if (user?.role.includes('superadmin') || user?.role.includes('admin')) {
      // if (!formData.categoryId || !formData.officeId || !formData.locationId) {
      //   setFormError('Please select a tenant, category, and location');

      //   setFormData((prev) => {
      //     return {
      //       ...prev,
      //       newAssetTag: '',
      //     };
      //   });
      //   setTimeout(() => {
      //     setFormError('');
      //   }, 8000);
      //   return;
      // }
      if (form.categoryId && form.officeId && form.locationId && form.isNew) {
        console.log('Generating new asset tag');
        const params = {
          officeId: form.officeId,
          categoryId: form.categoryId,
          locationId: form.locationId,
        };

        const response = await axiosInstance.get(`/items/generate-asset-tag`, {
          params,
        });

        const generatedAssetTag = response.data;

        set('newAssetTag', generatedAssetTag);
      }
      if (!form.isNew) {
        set('newAssetTag', '');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <LabeledField label="Asset Name *" error={errors.name}>
        <input
          className="form-input"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. Dell Latitude 5540"
          required
        />
      </LabeledField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabeledField label="Category *">
          <SearchableDropdown
            placeholder="Select Category"
            data={CATEGORY_LIST}
            value={form.categoryId || null}
            onChange={(value: number | null) => {
              set('categoryId', value);
            }}
            required
          />
        </LabeledField>
        <LabeledField label="Brand *">
          <SearchableDropdown
            placeholder="Select Brand"
            data={CATEGORY_LIST}
            value={form.brandId || null}
            onChange={(value: number | null) => {
              set('brandId', value);
            }}
            required
          />
        </LabeledField>
        <LabeledField label="Supplier *">
          <SearchableDropdown
            placeholder="Select Supplier"
            data={CATEGORY_LIST}
            value={form.supplierId || null}
            onChange={(value: number | null) => {
              set('supplierId', value);
            }}
            required
          />
        </LabeledField>
        <LabeledField label="Office *">
          <SearchableDropdown
            placeholder="Select Office"
            data={CATEGORY_LIST}
            value={form.officeId || null}
            onChange={(value: number | null) => {
              set('officeId', value);
            }}
            required
          />
        </LabeledField>
        <LabeledField label="Location *" error={errors.location}>
          <SearchableDropdown
            placeholder="Select Location"
            data={CATEGORY_LIST}
            value={form.locationId || null}
            onChange={(value: number | null) => {
              set('locationId', value);
            }}
            required
          />
        </LabeledField>
        <LabeledField label="Status">
          <select
            className="form-select"
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
          >
            {STATUS_LIST.map((s: string) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </LabeledField>
      </div>

      <LabeledField label="New / Old *" error={errors.assetTag}>
        {/* New/Old Indicator */}
        <div className="flex rounded-xl bg-slate-200 p-1 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => {
              set('isNew', true);
              handleAssetTag();
            }}
            aria-pressed={form.isNew}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
              form.isNew
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            New
          </button>

          <button
            type="button"
            onClick={() => {
              set('isNew', false);
            }}
            aria-pressed={!form.isNew}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
              !form.isNew
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Old
          </button>
        </div>
      </LabeledField>

      <LabeledField label="New Asset Tag" error={errors.assetTag}>
        <div className="relative">
          <input
            className="form-input"
            value={form.assetTag}
            onChange={(e) => set('newAssetTag', e.target.value)}
            placeholder="e.g. GS-OA-26-L0001"
          />

          <div className="absolute top-1/2 right-3 flex -translate-y-1/2 gap-2">
            {/* Edit condition */}
            {/* {form?.newAssetTag && (
            )} */}
            <button
              type="button"
              onClick={() => setEditNewAsset(!editNewAsset)}
              className="cursor-pointer text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title={`${editNewAsset ? 'Editable' : 'Uneditable'}`}
            >
              {editNewAsset ? <Pencil className="h-4 w-4" /> : <PencilOff className="h-4 w-4" />}
            </button>

            {form?.newAssetTag && (
              <button
                type="button"
                onClick={() => {
                  set('newAssetTag', '');
                }}
                className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear new asset tag"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </LabeledField>
      <LabeledField label="Old Asset Tag" error={errors.assetTag}>
        <input
          className="form-input"
          value={form.assetTag}
          onChange={(e) => set('oldAssetTag', e.target.value)}
          placeholder="e.g. GSIT-001"
        />
      </LabeledField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabeledField label="Hostname" error={errors.serialNumber}>
          <input
            className="form-input"
            value={form.serialNumber}
            onChange={(e) => set('hostname', e.target.value)}
            placeholder="e.g. SN-12345"
            required
          />
        </LabeledField>
        <LabeledField label="Serial Number *" error={errors.serialNumber}>
          <input
            className="form-input"
            value={form.serialNumber}
            onChange={(e) => set('serialNumber', e.target.value)}
            placeholder="e.g. SN-12345"
            required
          />
        </LabeledField>
        <LabeledField label="Purchase Price" error={errors.purchasePrice}>
          <input
            type="number"
            min="0"
            step="0.01"
            className="form-input"
            value={form.purchasePrice}
            onChange={(e) => set('purchasePrice', e.target.value)}
          />
        </LabeledField>
        <LabeledField label="Purchase Date">
          <input
            type="date"
            className="form-input"
            value={form.purchaseDate}
            onChange={(e) => set('purchaseDate', e.target.value)}
          />
        </LabeledField>
        <LabeledField label="Deployed By">
          <input
            className="form-input"
            value={form.assignedTo}
            onChange={(e) => set('deployedBy', e.target.value)}
            placeholder="e.g. John Doe"
          />
        </LabeledField>
        <LabeledField label="Date Deployed">
          <input
            type="date"
            className="form-input"
            value={form.purchaseDate}
            onChange={(e) => set('dateDeployed', e.target.value)}
          />
        </LabeledField>
        <LabeledField label="Assigned To">
          <input
            className="form-input"
            value={form.assignedTo}
            onChange={(e) => set('assignedTo', e.target.value)}
            placeholder="e.g. John Doe"
          />
        </LabeledField>
        <LabeledField label="Invoice No">
          <input
            className="form-input"
            value={form.invoiceNo}
            onChange={(e) => set('invoiceNo', e.target.value)}
            placeholder="e.g. S0FP3900C0G10"
          />
        </LabeledField>
        <LabeledField label="Warranty Expiry">
          <input
            type="date"
            className="form-input"
            value={form.warrantyExpiry}
            onChange={(e) => set('warrantyExpiry', e.target.value)}
          />
        </LabeledField>
        <LabeledField label="Condition">
          <select
            className="form-select"
            value={form.condition}
            onChange={(e) => set('condition', e.target.value)}
          >
            {CONDITION_LIST.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </LabeledField>
      </div>

      <LabeledField label="Description">
        <textarea
          className="form-input resize-none"
          rows={3}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Brief description of the asset..."
        />
      </LabeledField>

      <LabeledField label="Remarks">
        <textarea
          className="form-input resize-none"
          rows={3}
          value={form.description}
          onChange={(e) => set('remarks', e.target.value)}
          placeholder="Deployment locations, user logs, physical conditions, etc."
        />
      </LabeledField>

      <div
        className="flex justify-end gap-3 border-t pt-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {initialData ? 'Save Changes' : 'Register Asset'}
        </button>
      </div>
    </form>
  );
}
