
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Filter, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: string;
  message: string;
  value?: string;
}

const LogsHistory = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Mock log data
  const logs: LogEntry[] = [
    /*{
      id: '1',
      timestamp: '2024-06-28 14:30:15',
      type: 'success',
      category: 'Temperature',
      message: 'Temperature stabilized',
      value: '37.5°C'
    },
    {
      id: '2',
      timestamp: '2024-06-28 14:25:42',
      type: 'info',
      category: 'Rotation',
      message: 'Egg rotation completed',
      value: '180° turn'
    },
    {
      id: '3',
      timestamp: '2024-06-28 14:20:33',
      type: 'warning',
      category: 'Humidity',
      message: 'Humidity below threshold',
      value: '55%'
    },
    {
      id: '4',
      timestamp: '2024-06-28 14:15:21',
      type: 'info',
      category: 'System',
      message: 'Configuration updated',
      value: 'Chicken eggs preset'
    },
    {
      id: '5',
      timestamp: '2024-06-28 14:10:18',
      type: 'error',
      category: 'Sensor',
      message: 'Temperature sensor timeout',
      value: 'Sensor #1'
    },
    {
      id: '6',
      timestamp: '2024-06-28 14:05:45',
      type: 'success',
      category: 'System',
      message: 'Automatic mode activated'
    },
    {
      id: '7',
      timestamp: '2024-06-28 14:00:12',
      type: 'info',
      category: 'Fan',
      message: 'Ventilation cycle started',
      value: '30s duration'
    },
    {
      id: '8',
      timestamp: '2024-06-28 13:55:33',
      type: 'warning',
      category: 'Temperature',
      message: 'Temperature spike detected',
      value: '38.2°C'
    }*/
  ];

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLogBadgeVariant = (type: string) => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'success':
        return 'default';
      default:
        return 'outline';
    }
  };

  const filteredLogs = logs.filter(log => {
    const typeMatch = filterType === 'all' || log.type === filterType;
    const categoryMatch = filterCategory === 'all' || log.category === filterCategory;
    return typeMatch && categoryMatch;
  });

  const handleExportLogs = () => {
    const csvContent = [
      'Timestamp,Type,Category,Message,Value',
      ...filteredLogs.map(log => 
        `"${log.timestamp}","${log.type}","${log.category}","${log.message}","${log.value || ''}"`
      )
    ].join('\n');
    
    console.log('CSV Content:', csvContent);
    toast.success('Logs exported to CSV successfully');
  };

  const categories = ['all', ...Array.from(new Set(logs.map(log => log.category)))];
  const types = ['all', 'info', 'warning', 'error', 'success'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">Logs & History</h1>
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <Badge variant="secondary">{filteredLogs.length} entries</Badge>
        </div>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Type:</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Category:</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleExportLogs} variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Display */}
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex-shrink-0">
                  {getLogIcon(log.type)}
                </div>
                
                <div className="flex-shrink-0 font-mono text-sm text-muted-foreground">
                  {log.timestamp}
                </div>
                
                <Badge variant={getLogBadgeVariant(log.type)} className="flex-shrink-0">
                  {log.type.toUpperCase()}
                </Badge>
                
                <Badge variant="outline" className="flex-shrink-0">
                  {log.category}
                </Badge>
                
                <div className="flex-1 min-w-0">
                  <span className="text-sm">{log.message}</span>
                  {log.value && (
                    <span className="ml-2 text-sm font-medium text-primary">
                      ({log.value})
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No logs match the current filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {types.slice(1).map(type => {
          const count = logs.filter(log => log.type === type).length;
          return (
            <Card key={type}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  {getLogIcon(type)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LogsHistory;
