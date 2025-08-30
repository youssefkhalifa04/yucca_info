
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Dashboard from '@/components/pages/Dashboard';
import Configuration from '@/components/pages/Configuration';
import ManualControl from '@/components/pages/ManualControl';
import AutomaticMode from '@/components/pages/AutomaticMode';
import EggTypeSelection from '@/components/pages/EggTypeSelection';
import LogsHistory from '@/components/pages/LogsHistory';
import Settings from '@/components/pages/Settings';
import useApi from '../hooks/use-api.js'
import { useControlMode } from '@/contexts/ControlModeContext';
import { useEggType } from "@/contexts/EggTypeContext";
export type PageType = 'dashboard' | 'configuration' | 'manual' | 'automatic' | 'eggs' | 'logs' | 'settings';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const { mode, setMode } = useControlMode();
  const {SendMode , sendEggType} = useApi();
  const { getCurrentEggType } = useEggType();
  const currentEggType = getCurrentEggType();

  useEffect(()=>{
    const sendMode = async ()=>{
      await SendMode(mode);
    }
    sendMode();
  });
  useEffect(()=>{
    const sendEgg = async () => {
      const exist =  currentEggType ? currentEggType : 'chicken'
      await sendEggType(exist)
    }
    sendEgg();
  },[currentEggType]);
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
    <AppLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </AppLayout>
  );
};

export default Index;
