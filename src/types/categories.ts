export interface Categories {
  id: number;
  name: string;
  abbreviation: string;
  quantity: number;
}

export type CategoryFormData = Omit<Categories, 'id'>;
