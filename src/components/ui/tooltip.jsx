import React from 'react';

export function TooltipProvider({children}) { return <>{children}</>; }
export function Tooltip({children}) { return <>{children}</>; }
export function TooltipTrigger({children, asChild}) { return <span className="tooltip-trigger">{children}</span>; }
export function TooltipContent({children, className}) { return <div className={className}>{children}</div>; }
