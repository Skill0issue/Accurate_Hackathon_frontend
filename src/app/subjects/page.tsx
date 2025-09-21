import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function SubjectsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Subjects</h1>
            <p className="text-slate-600 mt-2">Manage background check subjects</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <p className="text-slate-500">Subjects content will be implemented here</p>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
