'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import ChatExperience from '../chat/ChatBot';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      
      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto"
        style={{ marginLeft: isCollapsed ? '80px' : '280px' }}
      >
        <div className="p-6">
          {children}
          <ChatExperience />
        </div>
      </motion.main>
    </div>
  );
}
