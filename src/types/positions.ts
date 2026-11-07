export interface Positions {
  id: number;
  name: string;
  departmentId: number;
  department: {
    id: number;
    name: string;
    abbreviation: string;
  };
}

export type PositionFormData = Omit<Positions, 'id' | 'department'>;
