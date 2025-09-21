import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PackagesGrid from '@/components/packages/PackagesGrid';

export default function PackagesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
            <p className="text-gray-600 mt-1">Browse and select background check packages</p>
          </div>
          <PackagesGrid />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
