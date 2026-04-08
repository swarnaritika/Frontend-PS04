import React from 'react';

export const Badge = React.forwardRef(({ className, variant="default", children, ...props }, ref) => {
  let variantClasses = "bg-[#FFCC00] text-black";
  if (variant === "secondary") variantClasses = "bg-[#00CCCC] text-black";
  if (variant === "destructive") variantClasses = "bg-red-500 text-white";
  if (variant === "outline") variantClasses = "bg-white text-black";
  
  return (
  <div className={"inline-flex items-center rounded-none border-2 border-black px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-black " + variantClasses + " " + (className||'')} ref={ref} {...props}>
    {children}
  </div>
)});
Badge.displayName = 'Badge';
