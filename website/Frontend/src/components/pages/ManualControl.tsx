
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Fan, Droplets, RotateCcw, Thermometer, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useControlMode } from '@/contexts/ControlModeContext';

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
      console.log('Loading manual states from localStorage:', stored);
      if (stored) {
        const parsedStates = JSON.parse(stored);
        setManualStates(parsedStates);
        console.log('Manual states loaded:', parsedStates);
      } else {
        console.log('No stored manual states found, using defaults');
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
      color: 'blue'
    },
    {
      id: 'waterValve',
      name: 'Water Valve',
      icon: <Droplets className="h-6 w-6" />,
      description: 'Opens/closes water valve for humidity control',
      color: 'cyan'
    },
    {
      id: 'rotationMotor',
      name: 'Rotation Motor',
      icon: <RotateCcw className="h-6 w-6" />,
      description: 'Controls egg turning mechanism',
      color: 'green'
    },
    {
      id: 'heater',
      name: 'Heater Element',
      icon: <Thermometer className="h-6 w-6" />,
      description: 'Controls heating element for temperature regulation',
      color: 'red'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manual Control</h1>
        <div className="flex items-center space-x-4">
          <Badge variant={mode === 'automatic' ? "default" : "secondary"} className="text-sm">
            {mode === 'automatic' ? "Automatic Mode Active" : "Manual Mode Active"}
          </Badge>
        </div>
      </div>

      {/* Mode Warning */}
      {mode === 'automatic' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-orange-800 font-medium">Automatic Mode is Active</p>
                <p className="text-sm text-orange-600">
                  Switch to Manual Mode in the Automatic Mode page to enable manual controls.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actuator Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actuators.map((actuator) => (
          <Card key={actuator.id} className={mode === 'automatic' ? "opacity-60" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`text-${actuator.color}-600`}>
                    {actuator.icon}
                  </div>
                  <span>{actuator.name}</span>
                </div>
                <Switch
                  checked={manualStates[actuator.id as keyof typeof manualStates]}
                  onCheckedChange={(checked) => handleToggle(actuator.id, checked)}
                  disabled={mode === 'automatic'}
                  className="data-[state=checked]:bg-green-600"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {actuator.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <div className="flex items-center space-x-2">
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
              <p className="text-sm text-red-600">
                Use these controls only in emergency situations
              </p>
            </div>
            <button
              onClick={() => {
                const stopAllStates = {
                  fan: false,
                  waterValve: false,
                  rotationMotor: false,
                  heater: false
                };
                
                console.log('STOP ALL activated - setting all actuators to false');
                
                // Update state
                setManualStates(stopAllStates);
                
                // Save to localStorage
                try {
                  localStorage.setItem('manualStates', JSON.stringify(stopAllStates));
                  console.log('Manual states saved to localStorage (STOP ALL):', stopAllStates);
                } catch (error) {
                  console.warn('Failed to save manual states to localStorage:', error);
                }
                
                toast.error("All actuators stopped!");
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              disabled={mode === 'automatic'}
            >
              STOP ALL
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualControl;
