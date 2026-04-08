import React from 'react';

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={"flex min-h-[80px] w-full rounded-none border-4 border-black bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50 " + (className||'')}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
