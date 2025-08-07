
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Settings as SettingsIcon, Usb, Shield, Clock, Save } from 'lucide-react';
import { send } from 'process';

const Settings = () => {
  const [settings, setSettings] = useState({
    serialPort: 'COM3',
    baudRate: '9600',
    refreshRate: '5',
    passwordProtection: false,
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
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(settings)
        });
        
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
  await sendSettingsToServer(); // this function already handles success and failure toasts
};


  const handleTestConnection = async () => {
    
    try {
        await sendSettingsToServer();
        const response = await fetch('/api/status');
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
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <div className="flex items-center space-x-2">
          <SettingsIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">System Configuration</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Serial Communication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Usb className="h-5 w-5 text-blue-600" />
              <span>Serial Communication</span>
            </CardTitle>
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
            </div>

            <Button onClick={handleTestConnection} variant="outline" className="w-full">
              Test Connection
            </Button>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span>System Settings</span>
            </CardTitle>
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
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <span>Security & Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="passwordProtection">Password Protection</Label>
                <p className="text-sm text-muted-foreground">Require password to access settings</p>
              </div>
              <Switch
                id="passwordProtection"
                checked={settings.passwordProtection}
                onCheckedChange={(checked) => handleSettingChange('passwordProtection', checked)}
              />
            </div>

            {settings.passwordProtection && (
              <div>
                <Label htmlFor="password">Set Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Application Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoBackup">Automatic Backup</Label>
                <p className="text-sm text-muted-foreground">Automatically backup logs and settings</p>
              </div>
              <Switch
                id="autoBackup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="soundAlerts">Sound Alerts</Label>
                <p className="text-sm text-muted-foreground">Play sounds for alerts and notifications</p>
              </div>
              <Switch
                id="soundAlerts"
                checked={settings.soundAlerts}
                onCheckedChange={(checked) => handleSettingChange('soundAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dataLogging">Data Logging</Label>
                <p className="text-sm text-muted-foreground">Log sensor data and system events</p>
              </div>
              <Switch
                id="dataLogging"
                checked={settings.dataLogging}
                onCheckedChange={(checked) => handleSettingChange('dataLogging', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSaveSettings} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </Button>
            <Button onClick={handleResetSettings} variant="outline">
              Reset to Defaults
            </Button>
            <Button 
              onClick={() => toast.info("Backup created successfully")} 
              variant="outline"
            >
              Create Backup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
