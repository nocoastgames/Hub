import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-orange-600 text-white hover:bg-black': variant === 'default',
            'border-2 border-[#1A1A1A] bg-transparent hover:bg-black/5 text-[#1A1A1A]': variant === 'outline',
            'hover:bg-black/5 text-black/60 hover:text-black': variant === 'ghost',
            'bg-red-600 text-white hover:bg-black': variant === 'destructive',
            'h-12 px-6 py-2': size === 'default',
            'h-10 px-4 text-[10px]': size === 'sm',
            'h-14 px-8 text-base': size === 'lg',
            'h-12 w-12': size === 'icon',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
