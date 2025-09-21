import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  display_code: string; // Added missing field from API spec
  role: string;
  department?: string;
  job_title?: string;
  employee_id?: string;
  phone?: string;
  company_id?: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserListResponse {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  has_previous: boolean;
  users: User[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CompanyInfo {
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
  company: CompanyInfo | null;
  permissions: string[];
}

export const usersAPI = {
  // Get all users with pagination and filtering
  getUsers: async (params?: {
    skip?: number;
    limit?: number;
    company_id?: string;
    role?: string;
  }): Promise<UserListResponse> => {
    const response = await api.get('/users/', { params });
    return response.data;
  },

  // Get current user information
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Get specific user by ID
  getUserById: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
};
