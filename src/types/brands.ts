export interface Brands {
  id: number;
  name: string;
}

export type BrandFormData = Omit<Brands, 'id'>;
