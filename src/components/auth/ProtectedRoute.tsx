'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermissions?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  requiredPermissions = [] 
}) => {
  const { isAuthenticated, isLoading, user, permissions } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && user) {
      // Check role requirement
      if (requiredRole && user.role !== requiredRole) {
        router.push('/unauthorized');
        return;
      }

      // Check permission requirements
      if (requiredPermissions.length > 0) {
        const hasRequiredPermissions = requiredPermissions.every(permission =>
          permissions.includes(permission)
        );
        
        if (!hasRequiredPermissions) {
          router.push('/unauthorized');
          return;
        }
      }
    }
  }, [isAuthenticated, isLoading, user, permissions, requiredRole, requiredPermissions, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
