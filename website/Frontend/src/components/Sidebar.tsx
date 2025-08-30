
import React, { useEffect, useState } from 'react';
import { PageType } from '@/pages/Index';
import { 
  Gauge, 
  Settings2, 
  Hand, 
  Zap, 
  Egg, 
  FileText, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from './ui/sonner';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const Sidebar = ({ currentPage, onPageChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard' as PageType, label: 'Dashboard', icon: Gauge },
    { id: 'configuration' as PageType, label: 'Configuration', icon: Settings2 },
    { id: 'manual' as PageType, label: 'Manual Control', icon: Hand },
    { id: 'automatic' as PageType, label: 'Automatic Mode', icon: Zap },
    { id: 'eggs' as PageType, label: 'Egg Types', icon: Egg },
    { id: 'logs' as PageType, label: 'Logs & History', icon: FileText },
    { id: 'settings' as PageType, label: 'Settings', icon: Settings },
  ];
   const [settings , setSettings] = useState({
      serialPort: 'COM3',
      baudRate: '9600',
      refreshRate: '5',
      passwordProtection: false,
      autoBackup: true,
      connectionType: 'HTTP',
      soundAlerts: true,
      dataLogging: true,
      tempUnit: 'celsius',
    });
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [test , setTest] = useState(0);
    async function sendSettingsToServer() {
        try {
          const response = await fetch('http://localhost:3000/api/settings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
          });
          console.log('Sending settings to server:', settings);
          
          if (!response.ok) {
            throw new Error('Failed to save settings');
          }
          
          const data = await response.json();
          console.log('Settings saved successfully:', data);
        } catch (error) {
          console.error('Error saving settings:', error);
          toast.error('Failed to save settings');
        }
      }
      
    
  
  
  
    useEffect(() => {
      const handleTestConnection = async () => {
      
        try {
            await sendSettingsToServer();
            const response = await fetch('http://localhost:3000/api/status');
            const data = await response.json();
            setConnectionStatus(data.status);
          } catch (error) {
            console.error('Error checking connection status:', error);
          }
          setTest(test + 1);
        if (connectionStatus === 'Connected' ) {
          console.log('Connection successful');
        }
        
        
    };
  
      handleTestConnection();
    });
  return (
    <div className="w-64 bg-slate-900 text-white fixed top-0 left-0 h-screen z-50 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-center">Egg Incubator Control</h1>
        <p className="text-sm text-slate-400 text-center mt-1">Professional Edition</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200",
                    currentPage === item.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <IconComponent size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>{connectionStatus}</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
