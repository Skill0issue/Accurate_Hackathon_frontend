import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CompanyManagement from '@/components/companies/CompanyManagement';

export default function CompaniesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
            <p className="text-gray-600 mt-1">Manage companies, users, and system settings</p>
          </div>
          <CompanyManagement />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
