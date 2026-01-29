export type UserRole = 'admin' | 'gestor' | 'buyer';

export type BuyerUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
};

export type UserFormPayload = {
  name: string;
  email: string;
  role: UserRole;
};

export type MeUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};
