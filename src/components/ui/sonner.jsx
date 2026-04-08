import React from 'react';

export const Sonner = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={className} ref={ref} {...props}>
    {children}
  </div>
));
Sonner.displayName = 'Sonner';
