import * as React from "react"
import { Slot } from "@radix-ui/react-slot" // Need to install if using Slot, but I'll use simple button for now or add dependency later.
// Actually, I'll avoid radix dependency for now to keep it simple unless specified.
// Requirement said: "TailwindCSS + React + TypeScript".
// I'll implement a simple button without radix for now to avoid extra installs unless necessary.

import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
        // Simplified without Slot for now
        const Comp = "button"

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-red-600 text-white hover:bg-red-700": variant === 'default',
                        "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === 'destructive',
                        "border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground": variant === 'outline',
                        "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === 'secondary',
                        "hover:bg-accent hover:text-accent-foreground": variant === 'ghost',
                        "text-primary underline-offset-4 hover:underline": variant === 'link',
                        "h-10 px-4 py-2": size === 'default',
                        "h-9 rounded-md px-3": size === 'sm',
                        "h-11 rounded-md px-8": size === 'lg',
                        "h-10 w-10": size === 'icon',
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
