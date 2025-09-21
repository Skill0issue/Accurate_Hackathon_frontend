# API Client Structure

This directory contains organized API client files for each entity in the Background Check Management System. Each file provides TypeScript interfaces and API functions for a specific entity.

## 📁 File Structure

```
src/lib/api/
├── api.ts                    # Main axios configuration and auth API
├── index.ts                  # Central export file
├── users.ts                  # User management API
├── companies.ts              # Company management API
├── orders.ts                 # Order management API
├── packages.ts               # Package management API
├── package-requirements.ts   # Package requirements API
├── subjects.ts               # Subject management API
├── sub-orders.ts             # Sub-order management API
├── searches.ts               # Search management API
└── README.md                 # This documentation
```

## 🔧 Usage

### Import Individual APIs
```typescript
import { usersAPI, companiesAPI, ordersAPI } from '@/lib/api';

// Get all users
const users = await usersAPI.getUsers();

// Get companies with pagination
const companies = await companiesAPI.getCompanies({ skip: 0, limit: 10 });

// Get orders with filtering
const orders = await ordersAPI.getOrders({ 
  company_id: 'company-id',
  status: 'completed',
  limit: 20 
});
```

### Import Types
```typescript
import type { User, Company, Order, Package } from '@/lib/api';

// Use types in your components
const [users, setUsers] = useState<User[]>([]);
const [companies, setCompanies] = useState<Company[]>([]);
```

### Import Main API Instance
```typescript
import { api, authAPI } from '@/lib/api';

// Use the main axios instance for custom requests
const response = await api.get('/custom-endpoint');

// Use auth API
await authAPI.login('email@example.com', 'password');
```

## 📊 Available APIs

### 1. **Users API** (`usersAPI`)
- `getUsers()` - Get all users with pagination
- `getCurrentUser()` - Get current authenticated user
- `getUserById(id)` - Get specific user

### 2. **Companies API** (`companiesAPI`)
- `getCompanies()` - Get all companies
- `getCompanyById(id)` - Get specific company
- `getCompanyStats(id)` - Get company statistics

### 3. **Orders API** (`ordersAPI`)
- `getOrders()` - Get all orders with filtering
- `getOrderById(id)` - Get specific order
- `getOrderStats(id)` - Get order statistics

### 4. **Packages API** (`packagesAPI`)
- `getPackages()` - Get all packages with filtering
- `getPackageById(id)` - Get specific package
- `getPackageRequirements(id)` - Get package requirements

### 5. **Package Requirements API** (`packageRequirementsAPI`)
- `getPackageRequirements()` - Get all requirements
- `getPackageRequirementById(id)` - Get specific requirement
- `getRequirementTypes()` - Get available requirement types
- `getRequirementsByPackage(packageId)` - Get requirements for package

### 6. **Subjects API** (`subjectsAPI`)
- `getSubjects()` - Get all subjects with filtering
- `getSubjectById(id)` - Get specific subject
- `getSubjectSearches(id)` - Get searches for subject

### 7. **Sub-Orders API** (`subOrdersAPI`)
- `getSubOrders()` - Get all sub-orders with filtering
- `getSubOrderById(id)` - Get specific sub-order
- `getSubOrderSearches(id)` - Get searches for sub-order

### 8. **Searches API** (`searchesAPI`)
- `getSearches()` - Get all searches with filtering
- `getSearchById(id)` - Get specific search

## 🔐 Authentication

All API calls automatically include JWT authentication via axios interceptors. The token is stored in localStorage and added to request headers.

### Auth API Functions
- `authAPI.login(email, password)` - Login user
- `authAPI.getCurrentUser()` - Get current user info
- `authAPI.logout()` - Logout and clear stored data

## 📝 TypeScript Support

All APIs are fully typed with TypeScript interfaces:

- **Entity Types**: `User`, `Company`, `Order`, `Package`, etc.
- **List Response Types**: `UserListResponse`, `CompanyListResponse`, etc.
- **Response Types**: List responses with pagination metadata
- **Special Types**: `CompanyStats`, `OrderStats`, etc.

## 🚀 Features

- **Read-Only Operations**: Only GET operations for data fetching
- **Automatic Authentication**: JWT tokens automatically included
- **Error Handling**: 401 responses automatically redirect to login
- **Type Safety**: Full TypeScript support
- **Pagination**: Built-in pagination support
- **Filtering**: Query parameter filtering
- **Statistics**: Access to statistics and analytics data

## 📋 Example Usage in Components

```typescript
import React, { useEffect, useState } from 'react';
import { usersAPI, companiesAPI, type User, type Company } from '@/lib/api';

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, companiesResponse] = await Promise.all([
          usersAPI.getUsers({ limit: 10 }),
          companiesAPI.getCompanies({ limit: 5 })
        ]);
        
        setUsers(usersResponse.users);
        setCompanies(companiesResponse.companies);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Users ({users.length})</h2>
      <h2>Companies ({companies.length})</h2>
    </div>
  );
};
```

## 🔄 API Response Format

All list endpoints return a consistent format:

```typescript
interface ListResponse<T> {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  has_previous: boolean;
  [items]: T[];
}
```

This structure provides pagination metadata along with the actual data items.
