export type Role = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  lookerUser?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
