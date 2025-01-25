import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "shadow-[inset_0_1px_2px_rgba(0,0,0,0.075)]",
          "transform transition-transform duration-200 ease-in-out",
          "hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.075),0_0_5px_rgba(14,164,233,0.3)]",
          "focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.075),0_0_5px_rgba(14,164,233,0.5)]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }