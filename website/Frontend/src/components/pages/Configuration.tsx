
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEggType, EggType } from '@/contexts/EggTypeContext';

const Configuration = () => {
  const { getCurrentEggType, updateCurrentEggType } = useEggType();
  const currentEggType = getCurrentEggType();

  const [config, setConfig] = useState({
    minTemp: currentEggType.temperature - 1,
    maxTemp: currentEggType.temperature,
    minHumidity: currentEggType.humidity - 1,
    maxHumidity: currentEggType.humidity,
    rotationInterval: currentEggType.rotationInterval,
    fanRunTime: 30, // seconds
    heaterPower: 75 // percentage
  });

  const [isValid, setIsValid] = useState(true);

  // Update configuration when egg type changes
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      minTemp: currentEggType.temperature - 1,
      maxTemp: currentEggType.temperature,
      minHumidity: currentEggType.humidity - 1,
      maxHumidity: currentEggType.humidity,
      rotationInterval: currentEggType.rotationInterval
    }));
  }, [currentEggType]);

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setConfig(prev => ({
        ...prev,
        [field]: numValue
      }));
      validateConfig();
    }
  };

  const validateConfig = () => {
    const valid = 
      config.minTemp < config.maxTemp &&
      config.minHumidity < config.maxHumidity &&
      config.rotationInterval > 0 &&
      config.fanRunTime > 0 &&
      config.heaterPower >= 0 && config.heaterPower <= 100;
    
    setIsValid(valid);
    return valid;
  };

  const handleSendConfig = () => {
    if (validateConfig()) {
      // Update the current egg type with new configuration values
      updateCurrentEggType({
        temperature: config.maxTemp, // Use max temp as target temperature
        humidity: config.maxHumidity, // Use max humidity as target humidity
        rotationInterval: config.rotationInterval
      });
      
      // Simulate sending config via serial port
      toast.success("Configuration sent successfully to incubator and egg type updated!");
      console.log("Sending config:", config);
      console.log("Updated egg type:", getCurrentEggType());
    } else {
      toast.error("Please check your configuration values");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Configuration</h1>
        <div className="flex items-center space-x-2">
          {isValid ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
          <span className={`text-sm font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? 'Configuration Valid' : 'Check Values'}
          </span>
        </div>
      </div>

      {/* Current Egg Type Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Current Egg Type: {currentEggType.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="eggTemp">Target Temperature (°C)</Label>
              <Input
                id="eggTemp"
                type="number"
                step="0.1"
                value={currentEggType.temperature}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    updateCurrentEggType({ temperature: value });
                  }
                }}
                className="text-lg"
              />
            </div>
            <div>
              <Label htmlFor="eggHumidity">Target Humidity (%)</Label>
              <Input
                id="eggHumidity"
                type="number"
                step="1"
                value={currentEggType.humidity}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    updateCurrentEggType({ humidity: value });
                  }
                }}
                className="text-lg"
              />
            </div>
            <div>
              <Label htmlFor="eggRotation">Rotation Interval (min)</Label>
              <Input
                id="eggRotation"
                type="number"
                min="1"
                value={currentEggType.rotationInterval}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    updateCurrentEggType({ rotationInterval: value });
                  }
                }}
                className="text-lg"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {currentEggType.description}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Reset to default values based on egg type
                const defaultValues = {
                  chicken: { temperature: 37.5, humidity: 60, rotationInterval: 120 },
                  quail: { temperature: 37.8, humidity: 65, rotationInterval: 60 },
                  duck: { temperature: 37.2, humidity: 70, rotationInterval: 180 },
                  turkey: { temperature: 37.5, humidity: 65, rotationInterval: 120 }
                };
                const defaults = defaultValues[currentEggType.id as keyof typeof defaultValues];
                if (defaults) {
                  updateCurrentEggType(defaults);
                  toast.success(`Reset ${currentEggType.name} to default values`);
                }
              }}
            >
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Temperature Control</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minTemp">Minimum Temperature (°C)</Label>
                <Input
                  id="minTemp"
                  type="number"
                  step="0.1"
                  value={config.minTemp}
                  onChange={(e) => handleInputChange('minTemp', e.target.value)}
                  className="text-lg"
                />
              </div>
              <div>
                <Label htmlFor="maxTemp">Maximum Temperature (°C)</Label>
                <Input
                  id="maxTemp"
                  type="number"
                  step="0.1"
                  value={config.maxTemp}
                  onChange={(e) => handleInputChange('maxTemp', e.target.value)}
                  className="text-lg"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="heaterPower">Heater Power (%)</Label>
              <Input
                id="heaterPower"
                type="number"
                min="0"
                max="100"
                value={config.heaterPower}
                onChange={(e) => handleInputChange('heaterPower', e.target.value)}
                className="text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Humidity Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Humidity Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minHumidity">Minimum Humidity (%)</Label>
                <Input
                  id="minHumidity"
                  type="number"
                  step="1"
                  value={config.minHumidity}
                  onChange={(e) => handleInputChange('minHumidity', e.target.value)}
                  className="text-lg"
                />
              </div>
              <div>
                <Label htmlFor="maxHumidity">Maximum Humidity (%)</Label>
                <Input
                  id="maxHumidity"
                  type="number"
                  step="1"
                  value={config.maxHumidity}
                  onChange={(e) => handleInputChange('maxHumidity', e.target.value)}
                  className="text-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rotation Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Rotation Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="rotationInterval">Rotation Interval (minutes)</Label>
              <Input
                id="rotationInterval"
                type="number"
                min="1"
                value={config.rotationInterval}
                onChange={(e) => handleInputChange('rotationInterval', e.target.value)}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground mt-1">
                How often to rotate the eggs
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Fan Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Ventilation Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fanRunTime">Fan Run Time (seconds)</Label>
              <Input
                id="fanRunTime"
                type="number"
                min="1"
                value={config.fanRunTime}
                onChange={(e) => handleInputChange('fanRunTime', e.target.value)}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Duration for each fan cycle
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Send Configuration */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Send Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Apply these settings to the incubator controller
              </p>
            </div>
            <Button
              onClick={handleSendConfig}
              disabled={!isValid}
              size="lg"
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Config</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuration;
