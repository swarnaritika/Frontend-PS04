import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  let baseClass = "inline-flex items-center justify-center font-bold transition-all outline-none border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none ";
  
  const variants = {
    default: "bg-[#FFCC00] text-black",
    destructive: "bg-red-500 text-white",
    outline: "bg-white text-black",
    secondary: "bg-[#00CCCC] text-black",
    ghost: "bg-transparent text-black border-transparent shadow-none hover:shadow-none hover:bg-gray-100 hover:border-transparent active:translate-x-0 active:translate-y-0",
    link: "bg-transparent underline-offset-4 hover:underline text-primary border-transparent shadow-none hover:shadow-none active:translate-x-0 active:translate-y-0"
  };
  
  const sizes = {
    default: "h-12 px-6 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-14 px-8 text-lg",
    icon: "h-12 w-12"
  };

  return (
    <button
      ref={ref}
      className={cn(baseClass, variants[variant], sizes[size], className)}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
