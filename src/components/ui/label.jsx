import React from 'react';

export const Label = React.forwardRef(({ className, children, ...props }, ref) => (
  <label
    className={"text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 " + (className||'')}
    ref={ref}
    {...props}
  >
    {children}
  </label>
));
Label.displayName = 'Label';
