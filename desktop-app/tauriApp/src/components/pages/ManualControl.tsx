
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Fan, Droplets, RotateCcw, Thermometer, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useControlMode } from '@/contexts/ControlModeContext';
import { Button } from '@/components/ui/button';

const ManualControl = () => {
  const { mode, setMode } = useControlMode();
  console.log('ManualControl page - Current control mode:', mode);
  
  const [manualStates, setManualStates] = useState({
    fan: false,
    waterValve: false,
    rotationMotor: false,
    heater: false
  });

  // Load manual states from localStorage on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('manualStates');
      if (stored) {
        const parsedStates = JSON.parse(stored);
        setManualStates(parsedStates);
      }
    } catch (error) {
      console.warn('Failed to load manual states from localStorage:', error);
    }
  }, []);

  const handleToggle = (actuator: string, state: boolean) => {
    if (mode === 'automatic') {
      toast.error("Cannot control actuators in Automatic Mode. Switch to Manual Mode first.");
      return;
    }

    const newStates = {
      ...manualStates,
      [actuator]: state
    };

    console.log(`Toggling ${actuator} to ${state}`);

    // Update state
    setManualStates(newStates);

    // Save to localStorage
    try {
      localStorage.setItem('manualStates', JSON.stringify(newStates));
      console.log('Manual states saved to localStorage:', newStates);
    } catch (error) {
      console.warn('Failed to save manual states to localStorage:', error);
    }

    // Simulate sending command via serial port
    console.log(`Manual control: ${actuator} ${state ? 'ON' : 'OFF'}`);
    toast.success(`${actuator} turned ${state ? 'ON' : 'OFF'}`);
  };

  const actuators = [
    {
      id: 'fan',
      name: 'Circulation Fan',
      icon: <Fan className="h-6 w-6" />,
      description: 'Controls air circulation within the incubator',
      iconClass: 'text-blue-600'
    },
    {
      id: 'waterValve',
      name: 'Water Valve',
      icon: <Droplets className="h-6 w-6" />,
      description: 'Opens/closes water valve for humidity control',
      iconClass: 'text-cyan-600'
    },
    {
      id: 'rotationMotor',
      name: 'Rotation Motor',
      icon: <RotateCcw className="h-6 w-6" />,
      description: 'Controls egg turning mechanism',
      iconClass: 'text-green-600'
    },
    {
      id: 'heater',
      name: 'Heater Element',
      icon: <Thermometer className="h-6 w-6" />,
      description: 'Controls heating element for temperature regulation',
      iconClass: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">Manual Control</h1>
        <div className={`hidden md:inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 ${mode === 'automatic' ? 'text-amber-700 bg-amber-50' : 'text-green-700 bg-green-50'}`}>
          <span className="text-sm font-medium">{mode === 'automatic' ? 'Automatic Mode Active' : 'Manual Mode Active'}</span>
        </div>
      </div>

      {/* Mode Warning */}
      {mode === 'automatic' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-700" />
              <div>
                <p className="text-amber-800 font-medium">Automatic Mode is Active</p>
                <p className="text-sm text-amber-700">Switch to Manual Mode to enable controls.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actuator Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actuators.map((actuator) => (
          <Card key={actuator.id} className={mode === 'automatic' ? 'opacity-60' : ''}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3">
                  <div className={actuator.iconClass}>{actuator.icon}</div>
                  <span>{actuator.name}</span>
                </CardTitle>
                <CardDescription>{actuator.description}</CardDescription>
              </div>
              <Switch
                checked={manualStates[actuator.id as keyof typeof manualStates]}
                onCheckedChange={(checked) => handleToggle(actuator.id, checked)}
                disabled={mode === 'automatic'}
                className="data-[state=checked]:bg-green-600"
              />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      manualStates[actuator.id as keyof typeof manualStates]
                        ? 'bg-green-500 shadow-green-500/50 shadow-sm'
                        : 'bg-gray-300'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      manualStates[actuator.id as keyof typeof manualStates]
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {manualStates[actuator.id as keyof typeof manualStates] ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Emergency Stop */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-800">Emergency Controls</h3>
              <p className="text-sm text-red-600">Use only in emergencies. Disables all actuators immediately.</p>
            </div>
            <Button
              variant="destructive"
              size="lg"
              onClick={() => {
                const stopAllStates = { fan: false, waterValve: false, rotationMotor: false, heater: false };
                setManualStates(stopAllStates);
                try {
                  localStorage.setItem('manualStates', JSON.stringify(stopAllStates));
                } catch (error) {
                  console.warn('Failed to save manual states to localStorage:', error);
                }
                toast.error('All actuators stopped!');
              }}
              disabled={mode === 'automatic'}
            >
              STOP ALL
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualControl;
