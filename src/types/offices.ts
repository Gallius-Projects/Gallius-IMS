export interface Offices {
  id: number;
  name: string;
  abbreviation: string;
}

export type OfficesFormData = Omit<Offices, 'id'>;
