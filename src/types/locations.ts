export interface Locations {
  id: number;
  name: string;
  abbreviation: string;
}

export type LocationFormData = Omit<Locations, 'id'>;
