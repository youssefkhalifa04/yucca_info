
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
        <div className={cn("text-muted-foreground", status && "text-green-600")}> 
          {icon}
        </div>
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        <div
          className={cn(
            "w-3 h-3 rounded-full",
            status ? "bg-green-500 shadow-green-500/50 shadow-sm" : "bg-muted"
          )}
        />
        <span className={cn("text-sm font-medium", status ? "text-green-600" : "text-muted-foreground")}> 
          {status ? "ON" : "OFF"}
        </span>
      </div>
    </div>
  );
};

export default StatusIndicator;
