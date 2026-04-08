import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const SelectContext = createContext({});

export function Select({ children, value, onValueChange }) {
  const [open, setOpen] = useState(false);
  
  return (
    <SelectContext.Provider value={{ open, setOpen, value, onValueChange }}>
      <div className="relative w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className }) {
  const { open, setOpen, value } = useContext(SelectContext);
  return (
    <button
      type="button"
      className={"flex h-11 w-full items-center justify-between border-4 border-black bg-white px-3 py-2 text-sm focus:outline-none " + (className || '')}
      onClick={() => setOpen(!open)}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === SelectValue) {
          return React.cloneElement(child, { currentValue: value });
        }
        return child;
      })}
    </button>
  );
}

export function SelectValue({ placeholder, currentValue }) {
  return <span>{currentValue || placeholder || "Select..."}</span>;
}

export function SelectContent({ children, className }) {
  const { open } = useContext(SelectContext);
  if (!open) return null;
  
  return (
    <div className={"absolute top-full left-0 mt-1 z-50 w-full min-w-[8rem] overflow-hidden border-4 border-black bg-white shadow-[4px_4px_0_0_#000] " + (className || '')}>
      <div className="max-h-96 overflow-auto p-1">
        {children}
      </div>
    </div>
  );
}

export function SelectItem({ children, value, className }) {
  const { onValueChange, setOpen } = useContext(SelectContext);
  
  return (
    <div
      className={"relative flex w-full cursor-default select-none items-center py-2 pl-3 pr-2 text-sm font-bold outline-none hover:bg-[#FFCC00] hover:border-2 hover:border-black cursor-pointer " + (className || '')}
      onClick={() => {
        if (onValueChange) onValueChange(value);
        setOpen(false);
      }}
    >
      {children}
    </div>
  );
}
