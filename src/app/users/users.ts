export interface User {
  id: number;
  user_id: number;
  role_id: number;
  first_name: string;
  last_name: string;
  status: number;
  email: string | null;
  phone_number: string;
  username: string;
  created_at: string;
  role: Role
}

export interface Role {
  id: number;
  name: string;
  description: string;
}
