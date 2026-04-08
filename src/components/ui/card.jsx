import React from 'react';

export const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={"border-4 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] " + (className||'')} ref={ref} {...props}>
    {children}
  </div>
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={"flex flex-col space-y-1.5 p-6 " + (className||'')} ref={ref} {...props}>
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3 className={"font-bold leading-none tracking-tight " + (className||'')} ref={ref} {...props}>
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p className={"text-sm text-black/80 font-medium " + (className||'')} ref={ref} {...props}>
    {children}
  </p>
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={"p-6 pt-0 " + (className||'')} ref={ref} {...props}>
    {children}
  </div>
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={"flex items-center p-6 pt-0 " + (className||'')} ref={ref} {...props}>
    {children}
  </div>
));
CardFooter.displayName = 'CardFooter';
