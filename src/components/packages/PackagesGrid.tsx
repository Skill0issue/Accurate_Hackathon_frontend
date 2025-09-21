'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { packagesAPI, packageRequirementsAPI } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  Package, 
  DollarSign, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  Star,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { PackageRequirement as PackageRequirementType } from '@/lib/api';

import { Package as PackageType } from '@/lib/api';

const packageTypeColors = {
  basic: 'bg-slate-100 text-slate-700 border-slate-200',
  premium: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500',
  enterprise: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-500',
};

const packageTypeIcons = {
  basic: Package,
  premium: Star,
  enterprise: Users,
};

export default function PackagesGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'type'>('type');

  // Fetch packages
  const {
    data: packagesData,
    isLoading: packagesLoading,
    error: packagesError,
  } = useQuery({
    queryKey: ['packages', searchTerm, typeFilter, sortBy],
    queryFn: async () => {
      const response = await packagesAPI.getPackages({
        search: searchTerm || undefined,
        package_type: typeFilter || undefined,
        limit: 100,
      });
      let packages = response.packages || [];
      
      // Sort packages to prioritize premium packages
      packages.sort((a: PackageType, b: PackageType) => {
        if (sortBy === 'type') {
          const aIsPremium = isPremiumPackage(a.package_type);
          const bIsPremium = isPremiumPackage(b.package_type);
          if (aIsPremium && !bIsPremium) return -1;
          if (!aIsPremium && bIsPremium) return 1;
          return a.package_name.localeCompare(b.package_name);
        } else if (sortBy === 'price') {
          return parseFloat(a.price) - parseFloat(b.price);
        } else {
          return a.package_name.localeCompare(b.package_name);
        }
      });
      
      return packages;
    },
  });

  // Fetch requirements for expanded packages
  const expandedPackageIds = Array.from(expandedPackages);
  const {
    data: requirementsData,
    isLoading: requirementsLoading,
  } = useQuery({
    queryKey: ['package-requirements', expandedPackageIds],
    queryFn: async () => {
      const requirementsMap: { [key: string]: PackageRequirementType[] } = {};
      
      for (const packageId of expandedPackageIds) {
        try {
          const response = await packageRequirementsAPI.getPackageRequirements({
            package_id: packageId,
            limit: 100,
          });
          requirementsMap[packageId] = response.requirements || [];
        } catch (error) {
          console.error(`Error fetching requirements for package ${packageId}:`, error);
          requirementsMap[packageId] = [];
        }
      }
      
      return requirementsMap;
    },
    enabled: expandedPackageIds.length > 0,
  });

  const togglePackage = (packageId: string) => {
    const newExpanded = new Set(expandedPackages);
    if (newExpanded.has(packageId)) {
      newExpanded.delete(packageId);
    } else {
      newExpanded.add(packageId);
    }
    setExpandedPackages(newExpanded);
  };

  const formatPrice = (price: string | number, currency: string = 'USD') => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numPrice);
  };

  const isPremiumPackage = (packageType: string) => {
    return ['premium', 'enterprise'].includes(packageType);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (packagesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (packagesError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error loading packages</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        }
      `}</style>

      {/* Header with Search and Filters */}
      <div className="bg-gradient-to-r from-slate-50 to-white rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search packages by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-normal bg-white shadow-sm hover:shadow-md transition-all duration-200 placeholder-slate-400 text-slate-700"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-8 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-normal bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-slate-700"
              >
                <option value="">All Types</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'type')}
                className="appearance-none px-4 py-2.5 pr-8 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-normal bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-slate-700"
              >
                <option value="type">Sort by Type</option>
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Packages Grid/List */}
      {viewMode === 'grid' ? (
        <div className="space-y-8">
          {/* Featured Packages Section */}
          {packagesData && packagesData.filter((pkg: PackageType) => isPremiumPackage(pkg.package_type)).length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-emerald-500 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-900">Featured Packages</h2>
                <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-emerald-100 rounded-full">
                  <Star className="w-3 h-3 text-purple-600 fill-current" />
                  <span className="text-xs font-medium text-purple-700">Premium & Enterprise</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packagesData && packagesData.filter((pkg: PackageType) => isPremiumPackage(pkg.package_type)).map((pkg: PackageType) => {
            const TypeIcon = packageTypeIcons[pkg.package_type];
            const isExpanded = expandedPackages.has(pkg.id);
            const requirements = requirementsData?.[pkg.id] || [];

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${
                  isPremiumPackage(pkg.package_type) 
                    ? 'border-2 border-purple-200 shadow-lg hover:shadow-xl' 
                    : 'border-slate-200'
                }`}
              >
                {/* Premium Package Header */}
                {isPremiumPackage(pkg.package_type) && (
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-white fill-current" />
                      <span className="text-sm font-medium text-white">Premium Package</span>
                    </div>
                  </div>
                )}

                {/* Package Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${packageTypeColors[pkg.package_type]}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-slate-900">{pkg.package_name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${packageTypeColors[pkg.package_type]}`}>
                          {pkg.package_type}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePackage(pkg.id)}
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 font-normal leading-relaxed mb-4 line-clamp-2">
                    {pkg.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-light text-slate-900">
                        {formatPrice(pkg.price, pkg.currency)}
                      </span>
                      <span className="text-sm text-slate-500 font-normal">
                        /{pkg.validity_days}d
                      </span>
                    </div>
                    {isPremiumPackage(pkg.package_type) && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                        <span className="text-xs font-medium text-amber-600">Featured</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Package Stats */}
                <div className="px-6 py-4 bg-slate-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-normal text-slate-600">
                        {pkg.max_candidates} candidates
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-normal text-slate-600">
                        {pkg.validity_days} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                {pkg.features && pkg.features.length > 0 && (
                  <div className="px-6 py-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Features</h4>
                    <div className="space-y-1">
                      {pkg.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span className="text-xs font-normal text-slate-600">{feature}</span>
                        </div>
                      ))}
                      {pkg.features.length > 3 && (
                        <div className="text-xs font-normal text-slate-500">
                          +{pkg.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Requirements Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-100"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                          <h4 className="text-sm font-medium text-slate-700">
                            Requirements ({requirements.length})
                          </h4>
                        </div>

                        {requirementsLoading ? (
                          <div className="flex justify-center py-4">
                            <LoadingSpinner />
                          </div>
                        ) : requirements.length > 0 ? (
                          <div className="space-y-3">
                            {requirements.map((req, index) => (
                              <motion.div
                                key={req.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-50 rounded-lg p-3 border border-slate-100"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h5 className="text-sm font-medium text-slate-900">
                                      {req.requirement_name}
                                    </h5>
                                    <p className="text-xs font-normal text-slate-600 mt-1">
                                      {req.description}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 ml-3">
                                    <span className="text-xs font-medium text-slate-500">
                                      {req.requirement_type}
                                    </span>
                                    {req.is_required && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Required
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="w-3 h-3 text-slate-400" />
                                      <span className="text-xs font-normal text-slate-600">
                                        {formatPrice(req.cost, 'USD')}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      <span className="text-xs font-normal text-slate-600">
                                        {req.estimated_days} days
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-normal text-slate-500">No requirements found</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Package Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-normal text-slate-500">
                      Updated {formatDate(pkg.updated_at)}
                    </div>
                    <div className={`text-xs font-medium ${
                      pkg.is_active ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
              </div>
            </div>
          )}

          {/* Basic Packages Section */}
          {packagesData && packagesData.filter((pkg: PackageType) => !isPremiumPackage(pkg.package_type)).length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-300 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-900">Basic Packages</h2>
                <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full">
                  <Package className="w-3 h-3 text-slate-600" />
                  <span className="text-xs font-medium text-slate-700">Standard</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packagesData && packagesData.filter((pkg: PackageType) => !isPremiumPackage(pkg.package_type)).map((pkg: PackageType) => {
                  const TypeIcon = packageTypeIcons[pkg.package_type];
                  const isExpanded = expandedPackages.has(pkg.id);
                  const requirements = requirementsData?.[pkg.id] || [];

                  return (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                    >
                      {/* Package Header */}
                      <div className="p-6 border-b border-slate-100">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${packageTypeColors[pkg.package_type]}`}>
                              <TypeIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-slate-900">{pkg.package_name}</h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${packageTypeColors[pkg.package_type]}`}>
                                {pkg.package_type}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => togglePackage(pkg.id)}
                            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-500" />
                            )}
                          </button>
                        </div>

                        <p className="text-xs text-slate-500 font-normal leading-relaxed mb-4 line-clamp-2">
                          {pkg.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-light text-slate-900">
                              {formatPrice(pkg.price, pkg.currency)}
                            </span>
                            <span className="text-sm text-slate-500 font-normal">
                              /{pkg.validity_days}d
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Package Stats */}
                      <div className="px-6 py-4 bg-slate-50">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-normal text-slate-600">
                              {pkg.max_candidates} candidates
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-normal text-slate-600">
                              {pkg.validity_days} days
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      {pkg.features && pkg.features.length > 0 && (
                        <div className="px-6 py-4">
                          <h4 className="text-sm font-medium text-slate-700 mb-2">Features</h4>
                          <div className="space-y-1">
                            {pkg.features.slice(0, 3).map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                <span className="text-xs font-normal text-slate-600">{feature}</span>
                              </div>
                            ))}
                            {pkg.features.length > 3 && (
                              <div className="text-xs font-normal text-slate-500">
                                +{pkg.features.length - 3} more features
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Requirements Section */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-slate-100"
                          >
                            <div className="p-6">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                <h4 className="text-sm font-medium text-slate-700">
                                  Requirements ({requirements.length})
                                </h4>
                              </div>

                              {requirementsLoading ? (
                                <div className="flex justify-center py-4">
                                  <LoadingSpinner />
                                </div>
                              ) : requirements.length > 0 ? (
                                <div className="space-y-3">
                                  {requirements.map((req, index) => (
                                    <motion.div
                                      key={req.id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="bg-slate-50 rounded-lg p-3 border border-slate-100"
                                    >
                                      <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                          <h5 className="text-sm font-medium text-slate-900">
                                            {req.requirement_name}
                                          </h5>
                                          <p className="text-xs font-normal text-slate-600 mt-1">
                                            {req.description}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-3">
                                          <span className="text-xs font-medium text-slate-500">
                                            {req.requirement_type}
                                          </span>
                                          {req.is_required && (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                              Required
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                          <div className="flex items-center gap-1">
                                            <DollarSign className="w-3 h-3 text-slate-400" />
                                            <span className="text-xs font-normal text-slate-600">
                                              {formatPrice(req.cost, 'USD')}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-slate-400" />
                                            <span className="text-xs font-normal text-slate-600">
                                              {req.estimated_days} days
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6">
                                  <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                  <p className="text-sm font-normal text-slate-500">No requirements found</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Package Footer */}
                      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-normal text-slate-500">
                            Updated {formatDate(pkg.updated_at)}
                          </div>
                          <div className={`text-xs font-medium ${
                            pkg.is_active ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {pkg.is_active ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        // List View
        <div className="space-y-8">
          {/* Featured Packages Section - List View */}
          {packagesData && packagesData.filter((pkg: PackageType) => isPremiumPackage(pkg.package_type)).length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-emerald-500 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-900">Featured Packages</h2>
                <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-emerald-100 rounded-full">
                  <Star className="w-3 h-3 text-purple-600 fill-current" />
                  <span className="text-xs font-medium text-purple-700">Premium & Enterprise</span>
                </div>
              </div>
              <div className="space-y-4">
                {packagesData && packagesData.filter((pkg: PackageType) => isPremiumPackage(pkg.package_type)).map((pkg: PackageType) => {
            const TypeIcon = packageTypeIcons[pkg.package_type];
            const isExpanded = expandedPackages.has(pkg.id);
            const requirements = requirementsData?.[pkg.id] || [];

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                  isPremiumPackage(pkg.package_type) 
                    ? 'border-2 border-purple-200 shadow-lg hover:shadow-xl' 
                    : 'border-slate-200'
                }`}
              >
                {/* Premium Package Header for List View */}
                {isPremiumPackage(pkg.package_type) && (
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-white fill-current" />
                      <span className="text-sm font-medium text-white">Premium Package</span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${packageTypeColors[pkg.package_type]}`}>
                        <TypeIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-slate-900">{pkg.package_name}</h3>
                        <p className="text-xs font-normal text-slate-500 line-clamp-1">{pkg.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-light text-slate-900">
                            {formatPrice(pkg.price, pkg.currency)}
                          </span>
                          <span className="text-sm text-slate-500 font-normal">
                            /{pkg.validity_days}d
                          </span>
                        </div>
                        {isPremiumPackage(pkg.package_type) && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-amber-400 fill-current" />
                            <span className="text-xs font-medium text-amber-600">Featured</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => togglePackage(pkg.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Requirements in List View */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-100 bg-slate-50"
                    >
                      <div className="p-6">
                        <h4 className="text-sm font-medium text-slate-700 mb-4">
                          Requirements ({requirements.length})
                        </h4>
                        {requirementsLoading ? (
                          <div className="flex justify-center py-4">
                            <LoadingSpinner />
                          </div>
                        ) : requirements.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {requirements.map((req) => (
                              <div key={req.id} className="bg-white rounded-lg p-4 border border-slate-200">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="text-sm font-medium text-slate-900">
                                    {req.requirement_name}
                                  </h5>
                                  {req.is_required && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Required
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-normal text-slate-600 mb-3">
                                  {req.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-normal text-slate-500">
                                    {req.requirement_type}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-normal text-slate-600">
                                      {formatPrice(req.cost, 'USD')}
                                    </span>
                                    <span className="text-xs font-normal text-slate-600">
                                      {req.estimated_days} days
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-normal text-slate-500">No requirements found</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
              </div>
            </div>
          )}

          {/* Basic Packages Section - List View */}
          {packagesData && packagesData.filter((pkg: PackageType) => !isPremiumPackage(pkg.package_type)).length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-300 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-900">Basic Packages</h2>
                <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full">
                  <Package className="w-3 h-3 text-slate-600" />
                  <span className="text-xs font-medium text-slate-700">Standard</span>
                </div>
              </div>
              <div className="space-y-4">
                {packagesData && packagesData.filter((pkg: PackageType) => !isPremiumPackage(pkg.package_type)).map((pkg: PackageType) => {
                  const TypeIcon = packageTypeIcons[pkg.package_type];
                  const isExpanded = expandedPackages.has(pkg.id);
                  const requirements = requirementsData?.[pkg.id] || [];

                  return (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${packageTypeColors[pkg.package_type]}`}>
                              <TypeIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-slate-900">{pkg.package_name}</h3>
                              <p className="text-xs font-normal text-slate-500 line-clamp-1">{pkg.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-light text-slate-900">
                                  {formatPrice(pkg.price, pkg.currency)}
                                </span>
                                <span className="text-sm text-slate-500 font-normal">
                                  /{pkg.validity_days}d
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => togglePackage(pkg.id)}
                              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-slate-500" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-slate-500" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Requirements in List View */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-slate-100 bg-slate-50"
                          >
                            <div className="p-6">
                              <h4 className="text-sm font-medium text-slate-700 mb-4">
                                Requirements ({requirements.length})
                              </h4>
                              {requirementsLoading ? (
                                <div className="flex justify-center py-4">
                                  <LoadingSpinner />
                                </div>
                              ) : requirements.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {requirements.map((req) => (
                                    <div key={req.id} className="bg-white rounded-lg p-4 border border-slate-200">
                                      <div className="flex items-start justify-between mb-2">
                                        <h5 className="text-sm font-medium text-slate-900">
                                          {req.requirement_name}
                                        </h5>
                                        {req.is_required && (
                                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Required
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs font-normal text-slate-600 mb-3">
                                        {req.description}
                                      </p>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-normal text-slate-500">
                                          {req.requirement_type}
                                        </span>
                                        <div className="flex items-center gap-3">
                                          <span className="text-xs font-normal text-slate-600">
                                            {formatPrice(req.cost, 'USD')}
                                          </span>
                                          <span className="text-xs font-normal text-slate-600">
                                            {req.estimated_days} days
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6">
                                  <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                  <p className="text-sm font-normal text-slate-500">No requirements found</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {packagesData?.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No packages found</h3>
          <p className="text-sm font-normal text-slate-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
