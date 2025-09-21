export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  job_title?: string;
  employee_id?: string;
  phone?: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string;
}

export interface Company {
  id: string;
  company_name: string;
  company_code: string;
  logo_url?: string;
  website_url?: string;
  timezone?: string;
  currency: string;
  is_active: boolean;
  is_verified: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
  company?: Company;
  permissions: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  company: Company | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
