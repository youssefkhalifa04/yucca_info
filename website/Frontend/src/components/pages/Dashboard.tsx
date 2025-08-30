import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Thermometer,
  Droplets,
  Fan,
  Gauge,
  RotateCcw,
  Egg,
} from "lucide-react";
import StatusIndicator from "@/components/StatusIndicator";
import { supabase } from "../../integration/supabase/supabase";
import { useEggType } from "@/contexts/EggTypeContext";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";
import { set } from "date-fns";
const Dashboard = () => {
  const { getCurrentEggType } = useEggType();

  const currentEggType = getCurrentEggType();
 


  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    targetTemp: currentEggType.temperature,
    targetHumidity: currentEggType.humidity,
  });

  const [actuatorStates, setActuatorStates] = useState({
    fan: true,
    waterValve: false,
    rotationMotor: true,
    heater: false,
  });

  // Mock real-time data generation
  const [chartData, setChartData] = useState(() => {
    const data = [];
    for (let i = 23; i >= 0; i--) {
      data.push({
        time: `${24 - i}:00`,
        temperature: 37.5 + Math.random() * 2 - 1,
        humidity: 60 + Math.random() * 10 - 5,
      });
    }
    return data;
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("sensor_data")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Data fetched:", data);
      }
      console.log(data);
      setSensorData({
        targetHumidity: sensorData.targetHumidity,
        targetTemp: sensorData.targetTemp,
        temperature: data[0].temperature,
        humidity: data[0].humidity,
      });
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Monitoring Active</span>
        </div>
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Egg Type
            </CardTitle>
            <Egg className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{currentEggType.name}</div>
            <p className="text-xs text-muted-foreground">
              {currentEggType.incubationDays} days •{" "}
              {currentEggType.rotationInterval}min rotation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sensorData.temperature.toFixed(1)}°C
            </div>
            <p className="text-xs text-muted-foreground">
              Target: {sensorData.targetTemp}°C
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sensorData.humidity.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Target: {sensorData.targetHumidity}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Incubation Day
            </CardTitle>
            <Gauge className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Day 12</div>
            <p className="text-xs text-muted-foreground">9 days remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Rotation</CardTitle>
            <RotateCcw className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 min</div>
            <p className="text-xs text-muted-foreground">Every 2 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Temperature & Humidity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Temperature (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Humidity (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Actuator Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatusIndicator
              label="Circulation Fan"
              icon={<Fan className="h-5 w-5" />}
              status={actuatorStates.fan}
            />
            <StatusIndicator
              label="Water Valve"
              icon={<Droplets className="h-5 w-5" />}
              status={actuatorStates.waterValve}
            />
            <StatusIndicator
              label="Rotation Motor"
              icon={<RotateCcw className="h-5 w-5" />}
              status={actuatorStates.rotationMotor}
            />
            <StatusIndicator
              label="Heater Element"
              icon={<Thermometer className="h-5 w-5" />}
              status={actuatorStates.heater}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
