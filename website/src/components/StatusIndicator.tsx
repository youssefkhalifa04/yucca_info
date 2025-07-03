
import React from 'react';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  label: string;
  icon: React.ReactNode;
  status: boolean;
  className?: string;
}

const StatusIndicator = ({ label, icon, status, className }: StatusIndicatorProps) => {
  return (
    <div className={cn("flex items-center justify-between p-3 rounded-lg border", className)}>
      <div className="flex items-center space-x-3">
        <div className={cn("text-gray-600", status && "text-green-600")}>
          {icon}
        </div>
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        <div
          className={cn(
            "w-3 h-3 rounded-full",
            status ? "bg-green-500 shadow-green-500/50 shadow-sm" : "bg-gray-300"
          )}
        />
        <span className={cn("text-sm font-medium", status ? "text-green-600" : "text-gray-500")}>
          {status ? "ON" : "OFF"}
        </span>
      </div>
    </div>
  );
};

export default StatusIndicator;
