
import React from 'react';
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
          <span>USB Connected</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
