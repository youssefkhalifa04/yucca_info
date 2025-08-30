
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Settings as SettingsIcon, Usb, Shield, Clock, Save } from 'lucide-react';


const Settings = () => {
  const [settings, setSettings] = useState({
    serialPort: 'COM3',
    baudRate: '9600',
    refreshRate: '5',
    passwordProtection: false,
    connectionType: 'serial',
    autoBackup: true,
    soundAlerts: true,
    dataLogging: true,
    tempUnit: 'celsius'
  });
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
      
    }));
    
    toast.success(`Setting ${key} updated to ${value}`);
  };
 

  async function sendSettingsToServer() {
      try {
        const response = await fetch('http://localhost:3000/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(settings)
        });
        console.log('Sending settings to server:', settings);
        
        if (!response.ok) {
          throw new Error('Failed to save settings');
        }
        
        const data = await response.json();
        console.log('Settings saved successfully:', data);
      } catch (error) {
        console.error('Error saving settings:', error);
        toast.error('Failed to save settings');
      }
    }
    
  

  const handleSaveSettings = async () => {
  console.log('Saving settings:', settings);
  await sendSettingsToServer();
  try {
    const json = JSON.stringify(settings, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `incubator-settings-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success('Settings downloaded as JSON');
  } catch (err) {
    console.error('Failed to download settings:', err);
    toast.error('Failed to download settings');
  }
};


  const handleTestConnection = async () => {
    
    try {
        await sendSettingsToServer();
        const response = await fetch('http://localhost:3000/api/status');
        const data = await response.json();
        setConnectionStatus(data.status);
      } catch (error) {
        console.error('Error checking connection status:', error);
      }
    if (connectionStatus === 'Connected') {
      toast.success('Connection successful');
    }
    else {
      toast.error('Connection failed');
    }
    
  };

  const handleResetSettings = () => {
    setSettings({
      serialPort: 'COM3',
      baudRate: '9600',
      refreshRate: '5',
      passwordProtection: false,
      connectionType: 'serial',
      autoBackup: true,
      soundAlerts: true,
      dataLogging: true,
      tempUnit: 'celsius'
    });
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Settings</h1>
          <div className="hidden md:inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5">
            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">System Configuration</span>
          </div>
        </div>
        <div className={`hidden md:inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 ${connectionStatus === 'Connected' ? 'bg-green-50 text-green-700 border' : 'bg-amber-50 text-amber-700 border'}`}>
          <div className={`w-2 h-2 rounded-full ${connectionStatus === 'Connected' ? 'bg-green-500' : 'bg-amber-500'}`} />
          <span className="text-sm font-medium">{connectionStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Serial Communication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Usb className="h-5 w-5 text-primary" /> Serial Communication
            </CardTitle>
            <CardDescription>Configure port and baud rate. Test to verify connectivity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="serialPort">Serial Port</Label>
              <Select value={settings.serialPort} onValueChange={(value) => handleSettingChange('serialPort', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COM1">COM1</SelectItem>
                  <SelectItem value="COM2">COM2</SelectItem>
                  <SelectItem value="COM3">COM3</SelectItem>
                  <SelectItem value="COM4">COM4</SelectItem>
                  <SelectItem value="COM5">COM5</SelectItem>
                  <SelectItem value="COM6">COM6</SelectItem>
                  <SelectItem value="COM7">COM7</SelectItem>
                  <SelectItem value="COM8">COM8</SelectItem>
                  <SelectItem value="COM9">COM9</SelectItem>
                  <SelectItem value="COM10">COM10</SelectItem>
                  <SelectItem value="COM11">COM11</SelectItem>
                  <SelectItem value="COM12">COM12</SelectItem>
                  <SelectItem value="/dev/ttyUSB0">/dev/ttyUSB0</SelectItem>
                  <SelectItem value="/dev/ttyUSB1">/dev/ttyUSB1</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">Select the port your controller is connected to.</p>
            </div>

            <div>
              <Label htmlFor="baudRate">Baud Rate</Label>
              <Select value={settings.baudRate} onValueChange={(value) => handleSettingChange('baudRate', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9600">9600</SelectItem>
                  <SelectItem value="19200">19200</SelectItem>
                  <SelectItem value="38400">38400</SelectItem>
                  <SelectItem value="57600">57600</SelectItem>
                  <SelectItem value="115200">115200</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">Must match the device firmware configuration.</p>
            </div>
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button onClick={handleTestConnection} variant="outline" className="inline-flex items-center gap-2">
                <Usb className="h-4 w-4" /> Test Connection
              </Button>
              <div className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs border ${connectionStatus === 'Connected' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                <div className={`w-2 h-2 rounded-full ${connectionStatus === 'Connected' ? 'bg-green-500' : 'bg-amber-500'}`} />
                <span>Status: {connectionStatus}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" /> System Settings
            </CardTitle>
            <CardDescription>General update intervals and display units</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="refreshRate">Data Refresh Rate (seconds)</Label>
              <Select value={settings.refreshRate} disabled onValueChange={(value) => handleSettingChange('refreshRate', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 second</SelectItem>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">Fixed by system policy.</p>
            </div>

            <div>
              <Label htmlFor="tempUnit">Temperature Unit</Label>
              <Select disabled value={settings.tempUnit} onValueChange={(value) => handleSettingChange('tempUnit', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">Celsius (°C)</SelectItem>
                  <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">Currently only Celsius supported.</p>
            </div>
          </CardContent>
        </Card>

        
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSaveSettings} className="inline-flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </Button>
            <Button onClick={handleResetSettings} variant="outline" className="inline-flex items-center gap-2">
              Reset to Defaults
            </Button>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
