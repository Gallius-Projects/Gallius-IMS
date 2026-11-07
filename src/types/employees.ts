export interface Employees {
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

export type EmployeeFormData = Omit<
  Employees,
  'id' | 'accounts' | 'office' | 'department' | 'position'
>;
