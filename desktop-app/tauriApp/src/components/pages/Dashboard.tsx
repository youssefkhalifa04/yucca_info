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
import { Thermometer, Droplets, Fan, RotateCcw, Egg, ArrowUpRight, ArrowDownRight } from "lucide-react";
import StatusIndicator from "@/components/StatusIndicator";
import { supabase } from "../../integration/supabase/supabase";
import { useEggType } from "@/contexts/EggTypeContext";
import { Button } from "@/components/ui/button";
import useApi from '../../hooks/use-api.js'
const Dashboard = () => {
  const { getCurrentEggType } = useEggType();
  const currentEggType = getCurrentEggType();
  const {getAnalytics} = useApi();
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

  const [chartRange, setChartRange] = useState<"24h" | "7d" | "30d">("24h");
  // Mock historical data generation for visualization
  const generateInitialData = (range: "24h" | "7d" | "30d") => {
    const points = range === "24h" ? 24 : range === "7d" ? 7 * 8 : 30; // 24 hourly, 7d at 3h steps, 30 daily
    const labels = Array.from({ length: points }, (_, idx) => {
      if (range === "24h") return `${idx}:00`;
      if (range === "7d") return `D${Math.floor(idx / 8) + 1}`;
      return `Day ${idx + 1}`;
    });
    return labels.map((label) => ({
      time: label,
      temperature: 37.5 + Math.random() * 2 - 1,
      humidity: 60 + Math.random() * 10 - 5,
    }));
  };
  const [chartData, setChartData] = useState(() => generateInitialData("24h"));

  useEffect(() => {
    const fetchData = async () => {
      const data  = await getAnalytics();
      if (data && data.length > 0) {
        const latest = data[0] as { temperature: number; humidity: number };
        setSensorData((prev) => ({
          ...prev,
          temperature: latest.temperature,
          humidity: latest.humidity,
        }));
        // Push latest reading into chart for 24h range for a subtle live feel
        setChartData((prev) => {
          if (prev.length === 0) return prev;
          const label = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const nextPoint = {
            time: label,
            temperature: latest.temperature + (Math.random() * 0.4 - 0.2),
            humidity: latest.humidity + (Math.random() * 1.5 - 0.75),
          };
          const next = [...prev];
          next.shift();
          next.push(nextPoint);
          return next;
        });
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update chart when range changes
  useEffect(() => {
    setChartData(generateInitialData(chartRange));
  }, [chartRange]);

  // Simple trend helpers
  const computeBaseline = (values: number[]) => {
    if (values.length < 3) return values[values.length - 1] ?? 0;
    const slice = values.slice(-7, -1);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    return avg;
  };
  const tempValues = chartData.map((d) => d.temperature);
  const humValues = chartData.map((d) => d.humidity);
  const tempCurrent = tempValues[tempValues.length - 1] ?? 0;
  const humCurrent = humValues[humValues.length - 1] ?? 0;
  const tempBaseline = computeBaseline(tempValues);
  const humBaseline = computeBaseline(humValues);
  const tempDelta = Number((tempCurrent - tempBaseline).toFixed(1));
  const humDelta = Number((humCurrent - humBaseline).toFixed(1));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>
          <div className="hidden md:flex items-center gap-2 rounded-md border px-2.5 py-1.5">
            <Egg className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">{currentEggType.name}</span>
            <span className="text-xs text-muted-foreground">
              {currentEggType.incubationDays} days • {currentEggType.rotationInterval} min rotation
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Live monitoring</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{sensorData.temperature.toFixed(1)}°C</div>
                <p className="text-xs text-muted-foreground">Target: {sensorData.targetTemp}°C</p>
              </div>
              <div className={`inline-flex items-center rounded-md px-2 py-1 text-xs ${tempDelta >= 0 ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"}`}>
                {tempDelta >= 0 ? <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-1" />}
                {Math.abs(tempDelta)}
              </div>
            </div>
            <div className="mt-3 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.slice(-12)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip formatter={(v: number) => `${v.toFixed(1)}°C`} labelFormatter={() => ""} />
                  <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{sensorData.humidity.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Target: {sensorData.targetHumidity}%</p>
              </div>
              <div className={`inline-flex items-center rounded-md px-2 py-1 text-xs ${humDelta >= 0 ? "text-blue-600 bg-blue-50" : "text-amber-600 bg-amber-50"}`}>
                {humDelta >= 0 ? <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-1" />}
                {Math.abs(humDelta)}
              </div>
            </div>
            <div className="mt-3 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.slice(-12)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} labelFormatter={() => ""} />
                  <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egg Type</CardTitle>
            <Egg className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{currentEggType.name}</div>
            <p className="text-xs text-muted-foreground">{currentEggType.incubationDays} days total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rotation Interval</CardTitle>
            <RotateCcw className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentEggType.rotationInterval} min</div>
            <p className="text-xs text-muted-foreground">Automatic rotation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Temperature & Humidity Trends</CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant={chartRange === "24h" ? "default" : "ghost"} onClick={() => setChartRange("24h")}>24h</Button>
              <Button size="sm" variant={chartRange === "7d" ? "default" : "ghost"} onClick={() => setChartRange("7d")}>7d</Button>
              <Button size="sm" variant={chartRange === "30d" ? "default" : "ghost"} onClick={() => setChartRange("30d")}>30d</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={false} name="Temperature (°C)" />
                  <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} dot={false} name="Humidity (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusIndicator label="Circulation Fan" icon={<Fan className="h-5 w-5" />} status={actuatorStates.fan} />
            <StatusIndicator label="Water Valve" icon={<Droplets className="h-5 w-5" />} status={actuatorStates.waterValve} />
            <StatusIndicator label="Rotation Motor" icon={<RotateCcw className="h-5 w-5" />} status={actuatorStates.rotationMotor} />
            <StatusIndicator label="Heater Element" icon={<Thermometer className="h-5 w-5" />} status={actuatorStates.heater} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
