import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Dashboard from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
