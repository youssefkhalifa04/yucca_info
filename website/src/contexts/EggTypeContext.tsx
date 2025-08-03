import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface EggType {
  id: string;
  name: string;
  temperature: number;
  humidity: number;
  incubationDays: number;
  rotationInterval: number;
  description: string;
}

interface EggTypeContextType {
  selectedEggType: string;
  setSelectedEggType: (eggTypeId: string) => void;
  eggTypes: EggType[];
  getCurrentEggType: () => EggType;
  updateCurrentEggType: (updates: Partial<EggType>) => void;
  updateEggTypeById: (eggTypeId: string, updates: Partial<EggType>) => void;
}

const defaultEggTypes: EggType[] = [
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

const EggTypeContext = createContext<EggTypeContextType | undefined>(undefined);

export const useEggType = () => {
  const context = useContext(EggTypeContext);
  if (context === undefined) {
    throw new Error('useEggType must be used within an EggTypeProvider');
  }
  return context;
};

interface EggTypeProviderProps {
  children: ReactNode;
}

export const EggTypeProvider: React.FC<EggTypeProviderProps> = ({ children }) => {
  const [selectedEggType, setSelectedEggType] = useState<string>('chicken');
  const [eggTypes, setEggTypes] = useState<EggType[]>(defaultEggTypes);

  const getCurrentEggType = () => {
    return eggTypes.find(type => type.id === selectedEggType) || eggTypes[0];
  };

  const updateCurrentEggType = (updates: Partial<EggType>) => {
    setEggTypes(prevEggTypes => 
      prevEggTypes.map(eggType => 
        eggType.id === selectedEggType 
          ? { ...eggType, ...updates }
          : eggType
      )
    );
  };

  const updateEggTypeById = (eggTypeId: string, updates: Partial<EggType>) => {
    setEggTypes(prevEggTypes => 
      prevEggTypes.map(eggType => 
        eggType.id === eggTypeId 
          ? { ...eggType, ...updates }
          : eggType
      )
    );
  };

  const value: EggTypeContextType = {
    selectedEggType,
    setSelectedEggType,
    eggTypes,
    getCurrentEggType,
    updateCurrentEggType,
    updateEggTypeById
  };

  return (
    <EggTypeContext.Provider value={value}>
      {children}
    </EggTypeContext.Provider>
  );
}; 