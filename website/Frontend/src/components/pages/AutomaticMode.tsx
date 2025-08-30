
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Settings, CheckCircle, AlertCircle, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';
import { useControlMode } from '@/contexts/ControlModeContext';

const AutomaticMode = () => {
  const { mode, setMode } = useControlMode();
  console.log('AutomaticMode page - Current control mode:', mode);
  
  const [autoSettings, setAutoSettings] = useState({
    temperatureControl: true,
    humidityControl: true,
    rotationControl: true,
    ventilationControl: true
  });

  // Load auto settings from localStorage on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('autoSettings');
      console.log('Loading auto settings from localStorage:', stored);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setAutoSettings(parsedSettings);
        console.log('Auto settings loaded:', parsedSettings);
      } else {
        console.log('No stored auto settings found, using defaults');
      }
    } catch (error) {
      console.warn('Failed to load auto settings from localStorage:', error);
    }
  }, []);

  const handleModeToggle = (enabled : boolean) => {
    const newMode = enabled ? "automatic" : "manual";
    setMode(newMode as 'manual' | 'automatic');
    toast.success(`Switched to ${newMode} Mode`);
    console.log(`Mode changed to: ${newMode}`);
  };

  const handleSettingToggle = (setting: string, enabled: boolean) => {
    const newSettings = {
      ...autoSettings,
      [setting]: enabled
    };
    
    console.log(`Toggling ${setting} to ${enabled}`);
    
    // Update state
    setAutoSettings(newSettings);
    
    // Save to localStorage
    try {
      localStorage.setItem('autoSettings', JSON.stringify(newSettings));
      console.log('Auto settings saved to localStorage:', newSettings);
    } catch (error) {
      console.warn('Failed to save auto settings to localStorage:', error);
    }
    
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
          <Badge variant={mode === 'automatic' ? "default" : "secondary"} className="text-sm">
            {mode === 'automatic' ? "Automatic Mode" : "Manual Mode"}
          </Badge>
        </div>
      </div>

      {/* Mode Control */}
      <Card className={`border-2 ${mode === 'automatic' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className={`h-6 w-6 ${mode === 'automatic' ? 'text-green-600' : 'text-gray-600'}`} />
              <span>Automatic Mode Control</span>
            </div>
            <Switch
              checked={mode === 'automatic'}
              onCheckedChange={handleModeToggle}
              className="data-[state=checked]:bg-green-600 scale-125"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {mode === 'automatic' ? (
                <Play className="h-5 w-5 text-green-600" />
              ) : (
                <Pause className="h-5 w-5 text-gray-600" />
              )}
              <span className={`font-medium ${mode === 'automatic' ? 'text-green-800' : 'text-gray-600'}`}>
                {mode === 'automatic' ? 'Automatic control is ACTIVE' : 'Manual control is ACTIVE'}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {mode === 'automatic'
              ? 'The incubator is automatically maintaining optimal conditions based on your configuration.'
              : 'You have full manual control over all actuators. Switch to automatic for hands-off operation.'
            }
          </p>
        </CardContent>
      </Card>

      {/* Automatic Control Systems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {controlSystems.map((system) => (
          <Card key={system.id} className={mode !== 'automatic' ? "opacity-60" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <span className="text-base">{system.name}</span>
                </div>
                <Switch
                  checked={autoSettings[system.id as keyof typeof autoSettings] && mode === 'automatic'}
                  onCheckedChange={(checked) => handleSettingToggle(system.id, checked)}
                  disabled={mode !== 'automatic'}
                  className="data-[state=checked]:bg-blue-600"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {system.description}
              </p>
              <div className="flex items-center space-x-2">
                {autoSettings[system.id as keyof typeof autoSettings] && mode === 'automatic' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                )}
                <span className={`text-sm ${
                  autoSettings[system.id as keyof typeof autoSettings] && mode === 'automatic'
                    ? 'text-green-600 font-medium'
                    : 'text-gray-500'
                }`}>
                  {autoSettings[system.id as keyof typeof autoSettings] && mode === 'automatic'
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
              disabled={mode !== 'automatic'}
            >
              Enable All Controls
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("Configuration reloaded")}
              disabled={mode !== 'automatic'}
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
