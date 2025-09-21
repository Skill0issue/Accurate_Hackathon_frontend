'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Package, 
  Users, 
  User, 
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

  const menuItems = [
    {
      name: 'Home',
      href: '/dashboard',
      icon: Home,
    },
    {
      name: 'Orders',
      href: '/orders',
      icon: Package,
    },
    {
      name: 'Packages',
      href: '/packages',
      icon: Package,
    },
    {
      name: 'Company',
      href: '/companies',
      icon: Building2,
    },
  ];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const sidebarVariants = {
    expanded: {
      width: '280px',
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
    collapsed: {
      width: '80px',
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
  };

  const itemVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        delay: 0.1,
      },
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      className="fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 shadow-2xl z-50"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">BCMS</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-slate-300" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-slate-300" />
            )}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        variants={itemVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="font-medium"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 w-2 h-2 bg-white rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-700">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="mb-4"
              >
                <Link href="/profile">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-pointer transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {user?.role}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  variants={itemVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
}
