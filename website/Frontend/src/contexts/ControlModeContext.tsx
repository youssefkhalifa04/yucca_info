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
    try {
      const stored = localStorage.getItem('controlMode');
      console.log('Loading control mode from localStorage:', stored);
      if (stored && (stored === 'manual' || stored === 'automatic')) {
        setModeState(stored as ControlMode);
        console.log('Control mode set to:', stored);
      } else {
        console.log('No valid stored mode found, using default: automatic');
      }
    } catch (error) {
      // Fallback to default mode if localStorage is not available
      console.warn('Failed to load control mode from localStorage:', error);
    }
  }, []);

  const setMode = (newMode: ControlMode) => {
    console.log('Changing control mode from:', mode, 'to:', newMode);
    try {
      localStorage.setItem('controlMode', newMode);
      setModeState(newMode);
      console.log('Control mode successfully changed to:', newMode);
    } catch (error) {
      // Still update state even if localStorage fails
      console.warn('Failed to save control mode to localStorage:', error);
      setModeState(newMode);
      console.log('Control mode changed to:', newMode, '(localStorage failed)');
    }
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
  console.log('Current control mode:', context.mode);
  return context;
};
