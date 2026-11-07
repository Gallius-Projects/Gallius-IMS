export interface Users {
  id: string;
  username: string;
  role: string;
}

export type UsersFormData = Omit<Users, 'id'>;
