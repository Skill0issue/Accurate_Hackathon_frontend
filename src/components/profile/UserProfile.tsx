'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Calendar,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Award,
  Activity,
  Settings,
  Bell,
  Key,
  Globe
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { usersAPI } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  job_title?: string;
  employee_id?: string;
  phone?: string;
  company_id: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

const roleColors = {
  system_admin: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
  company_admin: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
  hr: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
  manager: 'bg-gradient-to-r from-purple-500 to-violet-500 text-white',
  employee: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white',
};

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  verified: 'bg-blue-100 text-blue-800 border-blue-200',
};

export default function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    job_title: '',
  });

  // Fetch user profile data
  const { data: userProfile, isLoading: profileLoading, refetch } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        // For now, we'll use the current user data from auth context
        // In a real app, you'd fetch detailed profile data
        return {
          id: user.id,
          name: user.name || 'Super Admin',
          email: user.email || 'admin@example.com',
          role: user.role || 'system_admin',
          department: user.department || 'IT',
          job_title: user.job_title || 'System Administrator',
          employee_id: user.employee_id || 'ADMIN001',
          phone: user.phone || '+1-555-0000',
          company_id: (user as any).company_id || '',
          is_active: user.is_active || true,
          is_verified: user.is_verified || true,
          last_login_at: (user as any).last_login_at || new Date().toISOString(),
          created_at: (user as any).created_at || new Date().toISOString(),
          updated_at: (user as any).updated_at || new Date().toISOString(),
        } as UserProfileData;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!user?.id,
  });

  const handleEdit = () => {
    if (userProfile) {
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone || '',
        department: userProfile.department || '',
        job_title: userProfile.job_title || '',
      });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      job_title: '',
    });
  };

  const handleSave = async () => {
    try {
      // In a real app, you'd call an API to update the user profile
      console.log('Saving profile:', formData);
      // await usersAPI.updateUser(userProfile.id, formData);
      setIsEditing(false);
      // refetch();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      system_admin: 'System Administrator',
      company_admin: 'Company Administrator',
      hr: 'HR Manager',
      manager: 'Manager',
      employee: 'Employee',
    };
    return roleMap[role] || role;
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
        <p className="text-gray-500">Unable to load your profile information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl"></div>
        
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Enhanced Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">{userProfile.name}</h2>
                <p className="text-lg text-gray-600">{userProfile.email}</p>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${roleColors[userProfile.role as keyof typeof roleColors]}`}>
                    <Award className="w-4 h-4 mr-1" />
                    {getRoleDisplayName(userProfile.role)}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${statusColors.active}`}>
                    <Activity className="w-4 h-4 mr-1" />
                    Active
                  </span>
                  {userProfile.is_verified && (
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${statusColors.verified}`}>
                      <Shield className="w-4 h-4 mr-1" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </motion.button>
              ) : (
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Member Since</p>
              <p className="text-2xl font-bold text-gray-900">{formatDate(userProfile.created_at)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Login</p>
              <p className="text-2xl font-bold text-gray-900">
                {userProfile.last_login_at ? formatDateTime(userProfile.last_login_at) : 'Never'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Account Status</p>
              <p className="text-2xl font-bold text-green-600">Active</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Security Level</p>
              <p className="text-2xl font-bold text-blue-600">High</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            <p className="text-sm text-gray-500">Your personal details and contact information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Basic Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                ) : (
                  <p className="text-lg text-gray-900 font-medium">{userProfile.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-lg text-gray-900 font-medium">{userProfile.email}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-lg text-gray-900 font-medium">{userProfile.phone || 'Not provided'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              Professional Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.job_title}
                    onChange={(e) => handleInputChange('job_title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                ) : (
                  <p className="text-lg text-gray-900 font-medium">{userProfile.job_title || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                ) : (
                  <p className="text-lg text-gray-900 font-medium">{userProfile.department || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                <p className="text-lg text-gray-900 font-medium">{userProfile.employee_id || 'Not assigned'}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Account Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Account Security</h2>
            <p className="text-sm text-gray-500">Security settings and account details</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Security Overview</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${statusColors.active}`}>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Active
                    </span>
                    {userProfile.is_verified && (
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${statusColors.verified}`}>
                        <Shield className="w-4 h-4 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User Role</label>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${roleColors[userProfile.role as keyof typeof roleColors]}`}>
                    <Award className="w-4 h-4 mr-1" />
                    {getRoleDisplayName(userProfile.role)}
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900 font-medium">
                      {userProfile.last_login_at ? formatDateTime(userProfile.last_login_at) : 'Never'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900 font-medium">
                      {formatDate(userProfile.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}