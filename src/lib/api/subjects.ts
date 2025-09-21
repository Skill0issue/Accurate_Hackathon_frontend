import { api } from './api';

export interface Subject {
  id: string;
  name: string;
  display_code: string;
  email: string;
  phone: string;
  date_of_birth: string;
  ssn: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  company_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubjectListResponse {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  has_previous: boolean;
  subjects: Subject[];
}


export interface SubjectSearch {
  id: string;
  sub_order_id: string;
  package_requirement_id: string;
  search_type: string;
  search_cost: string; // Changed to string as per API spec
  search_status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  status_code: string;
  search_status_notes: any[]; // Changed to any[] as per API spec (empty array in example)
  subject_id: string;
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export const subjectsAPI = {
  // Get all subjects with pagination and filtering
  getSubjects: async (params?: {
    skip?: number;
    limit?: number;
    company_id?: string;
    search?: string;
    is_active?: boolean;
  }): Promise<SubjectListResponse> => {
    const response = await api.get('/subjects/', { params });
    return response.data;
  },

  // Get specific subject by ID
  getSubjectById: async (subjectId: string): Promise<Subject> => {
    const response = await api.get(`/subjects/${subjectId}`);
    return response.data;
  },

  // Get searches for a subject
  getSubjectSearches: async (subjectId: string): Promise<SubjectSearch[]> => {
    const response = await api.get(`/subjects/${subjectId}/searches`);
    return response.data;
  },
};
