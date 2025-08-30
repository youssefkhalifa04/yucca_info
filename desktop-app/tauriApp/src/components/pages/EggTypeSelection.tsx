
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Egg, Download, Upload, CheckCircle, Thermometer, Droplets, RotateCcw } from 'lucide-react';
import { useEggType, EggType } from '@/contexts/EggTypeContext';

const EggTypeSelection = () => {
  const { selectedEggType, setSelectedEggType, eggTypes, getCurrentEggType } = useEggType();

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
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Egg Type Selection</h1>
          <div className="hidden md:inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5">
            <Egg className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Selected: {currentEggType.name}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Egg Type Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Select Egg Type</CardTitle>
            <CardDescription>Choose a profile. You can fine-tune values in Configuration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            

            {/* Egg Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eggTypes.map((eggType) => (
                <Card
                  key={eggType.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedEggType === eggType.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => handleEggTypeChange(eggType.id)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Egg className="h-4 w-4" />
                        <span>{eggType.name}</span>
                      </h3>
                      {selectedEggType === eggType.id && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          <CheckCircle className="h-3.5 w-3.5" /> Selected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {eggType.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                        <Thermometer className="h-3.5 w-3.5 text-red-500" />
                        <span className="font-medium">{eggType.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                        <Droplets className="h-3.5 w-3.5 text-blue-500" />
                        <span className="font-medium">{eggType.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                        <span className="font-medium">Days:</span>
                        <span>{eggType.incubationDays}</span>
                      </div>
                      <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                        <RotateCcw className="h-3.5 w-3.5 text-green-600" />
                        <span className="font-medium">{eggType.rotationInterval} min</span>
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
            <CardDescription>Active profile applied when you click Apply</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <Egg className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-lg">{currentEggType.name} Eggs</h3>
              <p className="text-sm text-muted-foreground">
                {currentEggType.description}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Temperature:</span>
                <span className="text-primary font-semibold">{currentEggType.temperature}°C</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Humidity:</span>
                <span className="text-primary font-semibold">{currentEggType.humidity}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Incubation Days:</span>
                <span className="text-primary font-semibold">{currentEggType.incubationDays}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Rotation Interval:</span>
                <span className="text-primary font-semibold">{currentEggType.rotationInterval} min</span>
              </div>
            </div>

            <Button onClick={handleApplySettings} className="w-full inline-flex items-center gap-2" size="lg">
              <CheckCircle className="h-4 w-4" /> Apply Settings
            </Button>
          </CardContent>
        </Card>
      </div>


    </div>
  );
};

export default EggTypeSelection;
