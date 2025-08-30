import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Egg, Thermometer, Droplets, Clock, RotateCcw } from 'lucide-react';
import { useEggType } from '@/contexts/EggTypeContext';

const EggTypeDisplay = () => {
  const { getCurrentEggType } = useEggType();
  const currentEggType = getCurrentEggType();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Egg className="h-5 w-5 text-orange-500" />
          <span>Current Egg Type</span>
          <Badge variant="secondary">{currentEggType.name}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <span className="text-sm">Temperature</span>
          </div>
          <span className="font-semibold">{currentEggType.temperature}°C</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-sm">Humidity</span>
          </div>
          <span className="font-semibold">{currentEggType.humidity}%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-500" />
            <span className="text-sm">Incubation</span>
          </div>
          <span className="font-semibold">{currentEggType.incubationDays} days</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RotateCcw className="h-4 w-4 text-purple-500" />
            <span className="text-sm">Rotation</span>
          </div>
          <span className="font-semibold">{currentEggType.rotationInterval} min</span>
        </div>
        
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
          {currentEggType.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default EggTypeDisplay; 