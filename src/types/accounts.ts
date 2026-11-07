export interface Accounts {
  uuid: string;
  username: string;
  roleId: number | null;
  role: {
    id: number;
    role: string;
  };
  status: boolean;
}

export type AccountsFormData = {
  username: string;
  password: string;
  roleId: number | null;
  status: boolean;
};
