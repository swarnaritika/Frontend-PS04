import React, { createContext, useContext, useState } from 'react';

const DialogContext = createContext({});

export function Dialog({ children, open: controlledOpen, onOpenChange: setControlledOpen, defaultOpen = false }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  
  const setOpen = (value) => {
    if (isControlled) {
      setControlledOpen(value);
    } else {
      setUncontrolledOpen(value);
    }
  };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, asChild }) {
  const { setOpen } = useContext(DialogContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        if (children.props.onClick) children.props.onClick(e);
        setOpen(true);
      }
    });
  }
  return <span onClick={() => setOpen(true)}>{children}</span>;
}

export function DialogContent({ children, className }) {
  const { open, setOpen } = useContext(DialogContext);
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className={"relative z-50 w-full max-w-lg bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] " + (className || '')}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children, className }) {
  return <div className={"flex flex-col space-y-1.5 text-center sm:text-left mb-4 " + (className || '')}>{children}</div>;
}

export function DialogTitle({ children, className }) {
  return <h2 className={"text-2xl font-bold leading-none tracking-tight " + (className || '')}>{children}</h2>;
}

export function DialogDescription({ children, className }) {
  return <p className={"text-sm text-black/80 " + (className || '')}>{children}</p>;
}

export function DialogFooter({ children, className }) {
  return <div className={"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4 " + (className || '')}>{children}</div>;
}

export function DialogClose({ children }) {
  const { setOpen } = useContext(DialogContext);
  return <button className="absolute right-4 top-4 border-2 border-black bg-white p-1" onClick={() => setOpen(false)}>{children || "X"}</button>;
}
