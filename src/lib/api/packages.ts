import { api } from './api';

export interface Package {
  id: string;
  package_name: string;
  description?: string;
  package_type: 'basic' | 'premium' | 'enterprise';
  price: string; // Changed to string as per API spec
  currency: string;
  validity_days: number;
  max_candidates: number;
  features: string[]; // Changed to array as per API spec
  company_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PackageListResponse {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  has_previous: boolean;
  packages: Package[];
}


export interface PackageRequirement {
  id: string;
  requirement_type: string;
  requirement_name: string;
  description?: string;
  is_required: boolean;
  cost: string; // Changed to string as per API spec
  estimated_days: number;
  package_id: string;
  created_at: string;
  updated_at: string;
}

export const packagesAPI = {
  // Get all packages with pagination and filtering
  getPackages: async (params?: {
    skip?: number;
    limit?: number;
    company_id?: string;
    package_type?: string;
    is_active?: boolean;
    search?: string;
  }): Promise<PackageListResponse> => {
    const response = await api.get('/packages/', { params });
    return response.data;
  },

  // Get specific package by ID
  getPackageById: async (packageId: string): Promise<Package> => {
    const response = await api.get(`/packages/${packageId}`);
    return response.data;
  },

  // Get package requirements
  getPackageRequirements: async (packageId: string): Promise<PackageRequirement[]> => {
    const response = await api.get(`/packages/${packageId}/requirements`);
    return response.data;
  },
};
