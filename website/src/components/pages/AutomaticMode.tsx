
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Settings, CheckCircle, AlertCircle, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';

const AutomaticMode = () => {
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [autoSettings, setAutoSettings] = useState({
    temperatureControl: true,
    humidityControl: true,
    rotationControl: true,
    ventilationControl: true
  });

  const handleModeToggle = (enabled: boolean) => {
    setIsAutoMode(enabled);
    const mode = enabled ? "Automatic" : "Manual";
    toast.success(`Switched to ${mode} Mode`);
    console.log(`Mode changed to: ${mode}`);
  };

  const handleSettingToggle = (setting: string, enabled: boolean) => {
    setAutoSettings(prev => ({
      ...prev,
      [setting]: enabled
    }));
    toast.success(`${setting} ${enabled ? 'enabled' : 'disabled'} in automatic mode`);
  };

  const controlSystems = [
    {
      id: 'temperatureControl',
      name: 'Temperature Control',
      description: 'Automatically maintain temperature within set thresholds',
      status: 'Active - Maintaining 37.8°C'
    },
    {
      id: 'humidityControl',
      name: 'Humidity Control',
      description: 'Automatically control water valve based on humidity levels',
      status: 'Active - Maintaining 62%'
    },
    {
      id: 'rotationControl',
      name: 'Rotation Control',
      description: 'Automatically rotate eggs at configured intervals',
      status: 'Next rotation in 45 minutes'
    },
    {
      id: 'ventilationControl',
      name: 'Ventilation Control',
      description: 'Automatically control fan operation for air circulation',
      status: 'Fan cycling every 30 seconds'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Automatic Mode</h1>
        <div className="flex items-center space-x-4">
          <Badge variant={isAutoMode ? "default" : "secondary"} className="text-sm">
            {isAutoMode ? "Automatic Mode" : "Manual Mode"}
          </Badge>
        </div>
      </div>

      {/* Mode Control */}
      <Card className={`border-2 ${isAutoMode ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className={`h-6 w-6 ${isAutoMode ? 'text-green-600' : 'text-gray-600'}`} />
              <span>Automatic Mode Control</span>
            </div>
            <Switch
              checked={isAutoMode}
              onCheckedChange={handleModeToggle}
              className="data-[state=checked]:bg-green-600 scale-125"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isAutoMode ? (
                <Play className="h-5 w-5 text-green-600" />
              ) : (
                <Pause className="h-5 w-5 text-gray-600" />
              )}
              <span className={`font-medium ${isAutoMode ? 'text-green-800' : 'text-gray-600'}`}>
                {isAutoMode ? 'Automatic control is ACTIVE' : 'Manual control is ACTIVE'}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {isAutoMode 
              ? 'The incubator is automatically maintaining optimal conditions based on your configuration.'
              : 'You have full manual control over all actuators. Switch to automatic for hands-off operation.'
            }
          </p>
        </CardContent>
      </Card>

      {/* Automatic Control Systems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {controlSystems.map((system) => (
          <Card key={system.id} className={!isAutoMode ? "opacity-60" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <span className="text-base">{system.name}</span>
                </div>
                <Switch
                  checked={autoSettings[system.id as keyof typeof autoSettings] && isAutoMode}
                  onCheckedChange={(checked) => handleSettingToggle(system.id, checked)}
                  disabled={!isAutoMode}
                  className="data-[state=checked]:bg-blue-600"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {system.description}
              </p>
              <div className="flex items-center space-x-2">
                {autoSettings[system.id as keyof typeof autoSettings] && isAutoMode ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                )}
                <span className={`text-sm ${
                  autoSettings[system.id as keyof typeof autoSettings] && isAutoMode
                    ? 'text-green-600 font-medium'
                    : 'text-gray-500'
                }`}>
                  {autoSettings[system.id as keyof typeof autoSettings] && isAutoMode
                    ? system.status
                    : 'Inactive'
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => toast.success("All automatic controls enabled")}
              disabled={!isAutoMode}
            >
              Enable All Controls
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("Configuration reloaded")}
              disabled={!isAutoMode}
            >
              Reload Configuration
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("System diagnostics started")}
            >
              Run Diagnostics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomaticMode;
