
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Egg, Download, Upload, CheckCircle } from 'lucide-react';

interface EggType {
  id: string;
  name: string;
  temperature: number;
  humidity: number;
  incubationDays: number;
  rotationInterval: number;
  description: string;
}

const EggTypeSelection = () => {
  const [selectedEggType, setSelectedEggType] = useState<string>('chicken');
  
  const eggTypes: EggType[] = [
    {
      id: 'chicken',
      name: 'Chicken',
      temperature: 37.5,
      humidity: 60,
      incubationDays: 21,
      rotationInterval: 120,
      description: 'Standard chicken eggs with 21-day incubation period'
    },
    {
      id: 'quail',
      name: 'Quail',
      temperature: 37.8,
      humidity: 65,
      incubationDays: 18,
      rotationInterval: 60,
      description: 'Small quail eggs requiring higher humidity'
    },
    {
      id: 'duck',
      name: 'Duck',
      temperature: 37.2,
      humidity: 70,
      incubationDays: 28,
      rotationInterval: 180,
      description: 'Duck eggs with extended incubation period'
    },
    {
      id: 'turkey',
      name: 'Turkey',
      temperature: 37.5,
      humidity: 65,
      incubationDays: 28,
      rotationInterval: 120,
      description: 'Large turkey eggs requiring careful temperature control'
    }
  ];

  const getCurrentEggType = () => {
    return eggTypes.find(type => type.id === selectedEggType) || eggTypes[0];
  };

  const handleEggTypeChange = (eggTypeId: string) => {
    setSelectedEggType(eggTypeId);
  };

  const handleApplySettings = () => {
    const eggType = getCurrentEggType();
    toast.success(`Applied ${eggType.name} egg settings to incubator`);
    console.log("Applying egg type settings:", eggType);
  };

  const handleLoadFromFile = () => {
    toast.info("File browser would open here to load custom egg type configurations");
  };

  const handleExportSettings = () => {
    const settings = {
      eggTypes,
      currentSelection: selectedEggType,
      exportDate: new Date().toISOString()
    };
    console.log("Exporting settings:", settings);
    toast.success("Settings exported successfully");
  };

  const currentEggType = getCurrentEggType();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Egg Type Selection</h1>
        <div className="flex items-center space-x-2">
          <Egg className="h-5 w-5 text-orange-500" />
          <Badge variant="secondary">{currentEggType.name} Selected</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Egg Type Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Select Egg Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedEggType} onValueChange={handleEggTypeChange}>
              <SelectTrigger className="w-full text-lg">
                <SelectValue placeholder="Select egg type" />
              </SelectTrigger>
              <SelectContent>
                {eggTypes.map((eggType) => (
                  <SelectItem key={eggType.id} value={eggType.id}>
                    <div className="flex items-center space-x-2">
                      <Egg className="h-4 w-4" />
                      <span>{eggType.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Egg Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eggTypes.map((eggType) => (
                <Card
                  key={eggType.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedEggType === eggType.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleEggTypeChange(eggType.id)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold flex items-center space-x-2">
                        <Egg className="h-4 w-4" />
                        <span>{eggType.name}</span>
                      </h3>
                      {selectedEggType === eggType.id && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {eggType.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium">Temp:</span> {eggType.temperature}°C
                      </div>
                      <div>
                        <span className="font-medium">Humidity:</span> {eggType.humidity}%
                      </div>
                      <div>
                        <span className="font-medium">Days:</span> {eggType.incubationDays}
                      </div>
                      <div>
                        <span className="font-medium">Rotation:</span> {eggType.rotationInterval}min
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Current Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Egg className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold text-lg">{currentEggType.name} Eggs</h3>
              <p className="text-sm text-muted-foreground">
                {currentEggType.description}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Temperature:</span>
                <span className="text-blue-600 font-semibold">{currentEggType.temperature}°C</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Humidity:</span>
                <span className="text-blue-600 font-semibold">{currentEggType.humidity}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Incubation Days:</span>
                <span className="text-blue-600 font-semibold">{currentEggType.incubationDays}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Rotation Interval:</span>
                <span className="text-blue-600 font-semibold">{currentEggType.rotationInterval} min</span>
              </div>
            </div>

            <Button onClick={handleApplySettings} className="w-full" size="lg">
              Apply Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* File Management */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleLoadFromFile} className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Load from File</span>
            </Button>
            <Button variant="outline" onClick={handleExportSettings} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Settings</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Load custom egg type configurations from JSON files or export current settings for backup.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EggTypeSelection;
