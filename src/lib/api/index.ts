// Export all API clients
export * from './users';
export * from './companies';
export * from './orders';
export * from './packages';
export * from './subjects';
export * from './sub-orders';

// Export package requirements with alias to avoid conflicts
export type {
  PackageRequirement as PackageRequirementType,
  PackageRequirementListResponse
} from './package-requirements';
export { packageRequirementsAPI } from './package-requirements';

// Export searches with alias to avoid conflicts
export type {
  Search as SearchType,
  SearchListResponse
} from './searches';
export { searchesAPI } from './searches';

// Re-export the main API instance
export { api, authAPI } from './api';
