# Global Egg Type Context

This document explains how to use the global `selectedEggType` variable across all pages in your React application.

## Overview

The `selectedEggType` is now managed globally using React Context, which means:
- ✅ The selected egg type persists across all pages
- ✅ Any component can access the current egg type
- ✅ Changes to the egg type are reflected everywhere immediately
- ✅ No need to pass props through multiple component levels

## How It Works

### 1. Context Provider Setup

The `EggTypeProvider` is already set up in `src/App.tsx` and wraps your entire application:

```tsx
// src/App.tsx
import { EggTypeProvider } from "./contexts/EggTypeContext";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <EggTypeProvider>
        {/* Your app components */}
      </EggTypeProvider>
    </QueryClientProvider>
  );
};
```

### 2. Using the Context in Any Component

To access the global egg type in any component, use the `useEggType` hook:

```tsx
import { useEggType } from '@/contexts/EggTypeContext';

const MyComponent = () => {
  const { 
    selectedEggType,        // Current selected egg type ID (e.g., 'chicken')
    setSelectedEggType,     // Function to change the selected egg type
    eggTypes,              // Array of all available egg types
    getCurrentEggType,     // Function to get the current egg type object
    updateCurrentEggType,  // Function to update the current egg type settings
    updateEggTypeById      // Function to update any egg type by ID
  } = useEggType();

  const currentEggType = getCurrentEggType();
  
  return (
    <div>
      <h2>Current Egg Type: {currentEggType.name}</h2>
      <p>Temperature: {currentEggType.temperature}°C</p>
      <p>Humidity: {currentEggType.humidity}%</p>
    </div>
  );
};
```

## Available Egg Types

The context includes these predefined egg types:

| Type | Temperature | Humidity | Incubation Days | Rotation Interval |
|------|-------------|----------|-----------------|-------------------|
| Chicken | 37.5°C | 60% | 21 days | 120 min |
| Quail | 37.8°C | 65% | 18 days | 60 min |
| Duck | 37.2°C | 70% | 28 days | 180 min |
| Turkey | 37.5°C | 65% | 28 days | 120 min |

## Examples

### Example 1: Display Current Egg Type
```tsx
import { useEggType } from '@/contexts/EggTypeContext';

const EggTypeInfo = () => {
  const { getCurrentEggType } = useEggType();
  const eggType = getCurrentEggType();
  
  return (
    <div>
      <h3>{eggType.name} Eggs</h3>
      <p>Target Temperature: {eggType.temperature}°C</p>
      <p>Target Humidity: {eggType.humidity}%</p>
    </div>
  );
};
```

### Example 2: Change Egg Type
```tsx
import { useEggType } from '@/contexts/EggTypeContext';

const EggTypeSelector = () => {
  const { selectedEggType, setSelectedEggType, eggTypes } = useEggType();
  
  return (
    <select 
      value={selectedEggType} 
      onChange={(e) => setSelectedEggType(e.target.value)}
    >
      {eggTypes.map(eggType => (
        <option key={eggType.id} value={eggType.id}>
          {eggType.name}
        </option>
      ))}
    </select>
  );
};
```

### Example 3: Update Egg Type Settings
```tsx
import { useEggType } from '@/contexts/EggTypeContext';

const Configuration = () => {
  const { getCurrentEggType, updateCurrentEggType } = useEggType();
  const eggType = getCurrentEggType();
  
  const handleUpdateSettings = () => {
    // Update the current egg type with new settings
    updateCurrentEggType({
      temperature: 38.0,
      humidity: 65,
      rotationInterval: 90
    });
  };
  
  return (
    <div>
      <h2>Configuration for {eggType.name} Eggs</h2>
      <button onClick={handleUpdateSettings}>Update Settings</button>
    </div>
  );
};
```

### Example 4: Update Specific Egg Type by ID
```tsx
import { useEggType } from '@/contexts/EggTypeContext';

const EggTypeManager = () => {
  const { updateEggTypeById } = useEggType();
  
  const updateChickenSettings = () => {
    updateEggTypeById('chicken', {
      temperature: 37.8,
      humidity: 62
    });
  };
  
  return (
    <button onClick={updateChickenSettings}>
      Update Chicken Settings
    </button>
  );
};
```

## Components Already Updated

1. **EggTypeSelection.tsx** - Now uses the global context instead of local state
2. **Dashboard.tsx** - Shows current egg type and uses its settings for target values
3. **EggTypeDisplay.tsx** - A reusable component that shows current egg type info
4. **Configuration.tsx** - Now updates egg type settings when configuration changes are applied

## Benefits

- **Consistency**: All pages show the same selected egg type
- **Real-time Updates**: When you change the egg type, all components update immediately
- **No Prop Drilling**: No need to pass the egg type through multiple component levels
- **Centralized Management**: All egg type logic is in one place
- **Type Safety**: Full TypeScript support with proper interfaces

## Adding New Egg Types

To add new egg types, modify the `defaultEggTypes` array in `src/contexts/EggTypeContext.tsx`:

```tsx
const defaultEggTypes: EggType[] = [
  // ... existing types
  {
    id: 'goose',
    name: 'Goose',
    temperature: 37.0,
    humidity: 75,
    incubationDays: 30,
    rotationInterval: 240,
    description: 'Large goose eggs requiring high humidity'
  }
];
```

## Error Handling

The `useEggType` hook includes error handling:

```tsx
try {
  const { selectedEggType } = useEggType();
} catch (error) {
  // This will happen if you try to use useEggType outside of EggTypeProvider
  console.error('EggType context not available');
}
```

## Best Practices

1. **Always use the hook**: Don't try to access the context directly
2. **Use getCurrentEggType()**: This ensures you always get a valid egg type object
3. **Handle loading states**: The context is available immediately, but you might want to show loading states while data is being fetched
4. **Type safety**: Always use the `EggType` interface for type safety

## Troubleshooting

**Q: I get an error "useEggType must be used within an EggTypeProvider"**
A: Make sure your component is wrapped within the `EggTypeProvider` in `App.tsx`

**Q: The egg type doesn't update when I change it**
A: Make sure you're using `setSelectedEggType` from the context, not local state

**Q: How do I persist the selected egg type?**
A: You can extend the context to save to localStorage or your backend API 