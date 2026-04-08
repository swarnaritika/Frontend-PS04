import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext({});

export function Tabs({ children, defaultValue, value: controlledValue, onValueChange, className }) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  
  const setValue = (newValue) => {
    if (onValueChange) onValueChange(newValue);
    if (!isControlled) setUncontrolledValue(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return (
    <div className={"inline-flex h-12 border-4 border-black bg-white p-1 shadow-[4px_4px_0_0_#000] " + (className || '')}>
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, className }) {
  const { value: selectedValue, setValue } = useContext(TabsContext);
  const isSelected = selectedValue === value;
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => setValue(value)}
      className={
        "inline-flex items-center justify-center whitespace-nowrap px-4 py-1.5 text-sm font-bold transition-all " +
        (isSelected ? "bg-[#FFCC00] border-2 border-black " : "bg-transparent hover:bg-gray-100 ") +
        (className || '')
      }
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, className }) {
  const { value: selectedValue } = useContext(TabsContext);
  if (selectedValue !== value) return null;
  
  return (
    <div
      role="tabpanel"
      className={"mt-4 focus-visible:outline-none " + (className || '')}
    >
      {children}
    </div>
  );
}
