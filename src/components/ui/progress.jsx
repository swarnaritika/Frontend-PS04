import React from 'react';

export const Progress = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={className} ref={ref} {...props}>
    {children}
  </div>
));
Progress.displayName = 'Progress';
