import { api } from './api';

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

export interface PackageRequirementListResponse {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  has_previous: boolean;
  requirements: PackageRequirement[];
}


export const packageRequirementsAPI = {
  // Get all package requirements with pagination and filtering
  getPackageRequirements: async (params?: {
    skip?: number;
    limit?: number;
    package_id?: string;
    requirement_type?: string;
    is_required?: boolean;
    company_id?: string;
    search?: string;
  }): Promise<PackageRequirementListResponse> => {
    const response = await api.get('/package-requirements/', { params });
    return response.data;
  },

  // Get specific package requirement by ID
  getPackageRequirementById: async (requirementId: string): Promise<PackageRequirement> => {
    const response = await api.get(`/package-requirements/${requirementId}`);
    return response.data;
  },

  // Get requirement types list
  getRequirementTypes: async (): Promise<string[]> => {
    const response = await api.get('/package-requirements/types/list');
    return response.data;
  },

  // Get requirements by package ID
  getRequirementsByPackage: async (packageId: string): Promise<PackageRequirement[]> => {
    const response = await api.get(`/package-requirements/by-package/${packageId}`);
    return response.data;
  },
};
