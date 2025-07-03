
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/pages/Dashboard';
import Configuration from '@/components/pages/Configuration';
import ManualControl from '@/components/pages/ManualControl';
import AutomaticMode from '@/components/pages/AutomaticMode';
import EggTypeSelection from '@/components/pages/EggTypeSelection';
import LogsHistory from '@/components/pages/LogsHistory';
import Settings from '@/components/pages/Settings';

export type PageType = 'dashboard' | 'configuration' | 'manual' | 'automatic' | 'eggs' | 'logs' | 'settings';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'configuration':
        return <Configuration />;
      case 'manual':
        return <ManualControl />;
      case 'automatic':
        return <AutomaticMode />;
      case 'eggs':
        return <EggTypeSelection />;
      case 'logs':
        return <LogsHistory />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  );
};

export default Index;
