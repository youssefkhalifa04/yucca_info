
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from "../../integration/supabase/supabase";
import { Send, AlertTriangle, CheckCircle, Thermometer, Droplets, RotateCcw, Egg, RefreshCcw, Loader2 } from 'lucide-react';
import { useEggType, EggType } from '@/contexts/EggTypeContext';

// Interface for the egg_info table structure
interface EggInfo {
  egg_type: string;
  min_temp: number | null;
  max_temp: number | null;
  min_hum: number | null;
  max_hum: number | null;
  target_hum: number | null;
  target_temp: number | null;
  rotation_interval: number | null;
}

const Configuration = () => {
  const { getCurrentEggType, updateCurrentEggType } = useEggType();
  const currentEggType = getCurrentEggType();

  const [eggInfoData, setEggInfoData] = useState<EggInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedEggType, setSelectedEggType] = useState<string>('chicken');

  const [config, setConfig] = useState({
    minTemp: 36.5,
    maxTemp: 38.5,
    minHumidity: 55,
    maxHumidity: 75,
    rotationInterval: 120,
    fanRunTime: 30, // seconds
    heaterPower: 75 // percentage
  });

  const [isValid, setIsValid] = useState(true);

  // Fetch egg info data from Supabase
  const fetchEggInfo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('egg_info')
        .select('*')
        ;

      if (error) {
        console.error('Error fetching egg info:', error);
        toast.error('Failed to load egg configuration data');
        return;
      }

      if (data) {
        setEggInfoData(data);
        console.log('Fetched egg info data:', data);
        // Set initial values from the first egg type
        if (data.length > 0) {
          const firstEgg = data[0];
          setSelectedEggType(firstEgg.egg_type);
          updateConfigFromEggInfo(firstEgg);
        } else {
          // If no data exists, populate with default values
          await populateDefaultEggData();
        }
      }
    } catch (error) {
      console.error('Error fetching egg info:', error);
      toast.error('Failed to load egg configuration data');
    } finally {
      setLoading(false);
    }
  };

  // Populate default egg data if table is empty
  const populateDefaultEggData = async () => {
    try {
      const defaultEggData = [
        {
          egg_type: 'chicken',
          min_temp: 36.5,
          max_temp: 38.5,
          min_hum: 55,
          max_hum: 75,
          target_hum: 60,
          target_temp: 37.5,
          rotation_interval: 120
        },
        {
          egg_type: 'quail',
          min_temp: 37.0,
          max_temp: 38.8,
          min_hum: 60,
          max_hum: 80,
          target_hum: 65,
          target_temp: 37.8,
          rotation_interval: 60
        },
        {
          egg_type: 'duck',
          min_temp: 36.8,
          max_temp: 38.2,
          min_hum: 65,
          max_hum: 85,
          target_hum: 70,
          target_temp: 37.2,
          rotation_interval: 180
        },
        {
          egg_type: 'turkey',
          min_temp: 36.5,
          max_temp: 38.5,
          min_hum: 60,
          max_hum: 75,
          target_hum: 65,
          target_temp: 37.5,
          rotation_interval: 120
        }
      ];

      const { error } = await supabase
        .from('egg_info')
        .insert(defaultEggData);

      if (error) {
        console.error('Error populating default data:', error);
        
        // Check if it's an RLS policy error
        if (error.code === '42501') {
          toast.error('Permission denied. Please disable RLS on the egg_info table or contact your administrator.');
          console.error('RLS Policy Error: The table has Row-Level Security enabled. Run this SQL in Supabase: ALTER TABLE public.egg_info DISABLE ROW LEVEL SECURITY;');
        } else {
          toast.error(`Failed to populate default egg data: ${error.message}`);
        }
        return;
      }

      toast.success('Default egg data populated successfully!');
      // Fetch the data again to update the UI
      await fetchEggInfo();
    } catch (error) {
      console.error('Error populating default data:', error);
      toast.error('Failed to populate default egg data');
    }
  };

  // Update config state from egg info data
  const updateConfigFromEggInfo = (eggInfo: EggInfo) => {
    setConfig({
      minTemp: eggInfo.min_temp || 36.5,
      maxTemp: eggInfo.max_temp || 38.5,
      minHumidity: eggInfo.min_hum || 55,
      maxHumidity: eggInfo.max_hum || 75,
      rotationInterval: eggInfo.rotation_interval || 120,
      fanRunTime: 30,
      heaterPower: 75
    });
  };

  // Load data on component mount
  useEffect(() => {
    fetchEggInfo();
  }, []);

  // Update configuration when selected egg type changes
  useEffect(() => {
    const selectedEgg = eggInfoData.find(egg => egg.egg_type === selectedEggType);
    if (selectedEgg) {
      updateConfigFromEggInfo(selectedEgg);
    }
  }, [selectedEggType, eggInfoData]);

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

  // Save configuration to Supabase
  const saveToSupabase = async () => {
    if (!validateConfig()) {
      toast.error("Please check your configuration values");
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        min_temp: config.minTemp,
        max_temp: config.maxTemp,
        min_hum: config.minHumidity,
        max_hum: config.maxHumidity,
        target_hum: config.maxHumidity, // Use max humidity as target
        target_temp: config.maxTemp, // Use max temp as target
        rotation_interval: config.rotationInterval
      };

      const { error } = await supabase
        .from('egg_info')
        .update(updateData)
        .eq('egg_type', selectedEggType);

      if (error) {
        console.error('Error updating egg info:', error);
        toast.error('Failed to save configuration');
        return;
      }

      toast.success("Configuration saved successfully!");
      
      // Update the current egg type context
      updateCurrentEggType({
        temperature: config.maxTemp,
        humidity: config.maxHumidity,
        rotationInterval: config.rotationInterval
      });

    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
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

  // Get current selected egg info
  const currentEggInfo = eggInfoData.find(egg => egg.egg_type === selectedEggType);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading egg configuration data...</span>
        </div>
      </div>
    );
  }

  // Show empty state if no egg data
  if (eggInfoData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold">Configuration</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Egg className="h-16 w-16 text-gray-400 mx-auto" />
              <h3 className="text-lg font-semibold">No Egg Configuration Data</h3>
              <p className="text-sm text-muted-foreground">
                No egg configuration data found in the database. Click the button below to populate with default values.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={populateDefaultEggData}
                  className="inline-flex items-center gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Populate Default Data
                </Button>
                <div className="text-xs text-muted-foreground">
                  If you get a permission error, you may need to disable RLS on the egg_info table in Supabase.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Configuration</h1>
          <div className={`hidden md:inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 ${isValid ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
            {isValid ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <span className="text-sm font-medium">{isValid ? 'Configuration Valid' : 'Check Values'}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Changes affect target temperature, humidity and rotation schedule
        </div>
      </div>

      {/* Egg Type Selection */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Egg className="h-5 w-5 text-orange-500" />
              <span>Egg Type: {selectedEggType ? selectedEggType.charAt(0).toUpperCase() + selectedEggType.slice(1) : 'Select Egg Type'}</span>
            </CardTitle>
            <CardDescription>Configure parameters for {selectedEggType ? selectedEggType : 'selected'} eggs</CardDescription>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedEggType}
              onChange={(e) => setSelectedEggType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {eggInfoData.map((egg) => (
                <option key={egg.egg_type} value={egg.egg_type}>
                  {egg.egg_type.charAt(0).toUpperCase() + egg.egg_type.slice(1)}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchEggInfo}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentEggInfo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="targetTemp">Target Temperature (°C)</Label>
                <Input
                  id="targetTemp"
                  type="number"
                  step="0.1"
                  value={currentEggInfo.target_temp || config.maxTemp}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      setConfig(prev => ({ ...prev, maxTemp: value }));
                    }
                  }}
                  className="text-lg"
                  aria-label="Target temperature in celsius"
                />
              </div>
              <div>
                <Label htmlFor="targetHumidity">Target Humidity (%)</Label>
                <Input
                  id="targetHumidity"
                  type="number"
                  step="1"
                  value={currentEggInfo.target_hum || config.maxHumidity}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      setConfig(prev => ({ ...prev, maxHumidity: value }));
                    }
                  }}
                  className="text-lg"
                  aria-label="Target humidity in percent"
                />
              </div>
              <div>
                <Label htmlFor="rotationInterval">Rotation Interval (min)</Label>
                <Input
                  id="rotationInterval"
                  type="number"
                  min="1"
                  value={currentEggInfo.rotation_interval || config.rotationInterval}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      setConfig(prev => ({ ...prev, rotationInterval: value }));
                    }
                  }}
                  className="text-lg"
                  aria-label="Rotation interval in minutes"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Thermometer className="h-5 w-5 text-red-500" /> Temperature Control</CardTitle>
            <CardDescription>Define safe operating range and heater power</CardDescription>
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
              <p className="text-sm text-muted-foreground mt-1">Duty cycle limit for heater output</p>
            </div>
          </CardContent>
        </Card>

        {/* Humidity Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Droplets className="h-5 w-5 text-blue-500" /> Humidity Control</CardTitle>
            <CardDescription>Set acceptable humidity range for incubation</CardDescription>
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
            <CardTitle className="flex items-center gap-2"><RotateCcw className="h-5 w-5 text-green-600" /> Rotation Control</CardTitle>
            <CardDescription>Prevent adhesion by rotating at a regular interval</CardDescription>
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

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Configuration Actions</h3>
              <p className="text-sm text-muted-foreground">
                Save to database or send to incubator controller
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={saveToSupabase}
                disabled={!isValid || saving}
                variant="outline"
                size="lg"
                className="inline-flex items-center gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                <span>{saving ? 'Saving...' : 'Save to Database'}</span>
              </Button>
              <Button
                onClick={handleSendConfig}
                disabled={!isValid}
                size="lg"
                className="inline-flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>Send to Incubator</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuration;
