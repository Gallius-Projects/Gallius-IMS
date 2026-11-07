export interface Suppliers {
  id: number;
  name: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  address: string;
}

export type SuppliersFormData = Omit<Suppliers, 'id'>;
