import { InventoryLogs } from './inventoryLogs';

interface Employees {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  suffix: string;
  officeId: number | null;
  office: {
    name: string;
  };
  departmentId: number | null;
  department: {
    name: string;
  };
  positionId: number | null;
  position: {
    name: string;
  };
  status: boolean;
  accounts: {
    uuid: string;
  };
}

export interface InventoryItem {
  id: number;
  name: string;
  oldAssetTag: string;
  newAssetTag: string;
  serialNumber: string;
  hostname: string;
  status: string;
  categoryId: number | null;
  category: { id: number; name: string } | null;
  brandId: number | null;
  brand: { id: number; name: string } | null;
  locationId: number | null;
  location: { id: number; name: string } | null;
  officeId: number | null;
  office: { id: number; name: string } | null;
  supplierId: number | null;
  supplier: { id: number; name: string } | null;
  invoiceNo?: string;
  dateDeployed?: Date | null;
  datePurchased?: Date | null;
  assetCondition?: string;
  isNew?: boolean;
  assignedTo: number | null;
  assignedEmp: Employees;
  deployedById: number | null;
  deployedBy: Employees;
  updatedBy: string;
  inventoryLogs: InventoryLogs;
  description: string;
  remarks: string;
}

export type ItemFormData = Omit<
  InventoryItem,
  | 'id'
  | 'category'
  | 'brand'
  | 'location'
  | 'office'
  | 'supplier'
  | 'assignedEmp'
  | 'deployedBy'
  | 'updatedBy'
  | 'inventoryLogs'
>;
