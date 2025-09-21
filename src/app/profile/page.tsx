import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserProfile from '@/components/profile/UserProfile';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>
          <UserProfile />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}