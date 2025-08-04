import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ControlMode = 'manual' | 'automatic';

interface ControlModeContextType {
  mode: ControlMode;
  setMode: (mode: ControlMode) => void;
}

const ControlModeContext = createContext<ControlModeContextType | undefined>(undefined);

export const ControlModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ControlMode>('automatic');

  useEffect(() => {
    const stored = localStorage.getItem('controlMode') as ControlMode | null;
    if (stored === 'manual' || stored === 'automatic') {
      setModeState(stored);
    }
  }, []);

  const setMode = (newMode: ControlMode) => {
    localStorage.setItem('controlMode', newMode);
    setModeState(newMode);
  };

  return (
    <ControlModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ControlModeContext.Provider>
  );
};

export const useControlMode = () => {
  const context = useContext(ControlModeContext);
  if (!context) {
    throw new Error('useControlMode must be used within a ControlModeProvider');
  }
  return context;
};
