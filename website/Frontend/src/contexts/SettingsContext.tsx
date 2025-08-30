import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Settings {
  serialPort: string;
  baudRate: string;
  refreshRate: string;
  passwordProtection: boolean;
  autoBackup: boolean;
  soundAlerts: boolean;
  dataLogging: boolean;
  tempUnit: string;
  connectionType: string;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  connectionStatus: string;
  testConnection: () => Promise<void>;
}

const defaultSettings: Settings = {
  serialPort: 'COM3',
  baudRate: '9600',
  refreshRate: '5',
  passwordProtection: false,
  autoBackup: true,
  connectionType: 'HTTP',
  soundAlerts: true,
  dataLogging: true,
  tempUnit: 'celsius',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  const testConnection = useCallback(async () => {
    try {
      await fetch('http://localhost:3000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const response = await fetch('http://localhost:3000/api/status');
      const data = await response.json();
      setConnectionStatus(data.status);
    } catch (error) {
      setConnectionStatus('Disconnected');
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, connectionStatus, testConnection }}>
      {children}
    </SettingsContext.Provider>
  );
};
export const getCurrentSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('getCurrentSettings must be used within a SettingsProvider');
    return context.settings;
}
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context.settings;
};
