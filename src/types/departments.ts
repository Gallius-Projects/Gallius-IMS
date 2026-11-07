export interface Departments {
  id: number;
  name: string;
  abbreviation: string;
}

export type DepartmentFormData = Omit<Departments, 'id'>;
