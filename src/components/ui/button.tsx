import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-orange-400 focus-visible:ring-[3px] border-0",
  {
    variants: {
      variant: {
        default:
          "text-white shadow-xs",
        destructive:
          "text-white shadow-xs focus-visible:ring-orange-400",
        outline:
          "shadow-xs text-white",
        secondary:
          "shadow-xs text-white",
        ghost:
          "text-white",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  style,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  // Default styling for Board Iraq theme based on variant
  const getDefaultStyle = () => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          color: '#141413',
          borderColor: '#D97757',
          border: '1px solid #D97757',
          ...style
        }
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#D97757',
          ...style
        }
      case 'secondary':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#141413',
          ...style
        }
      case 'link':
        return {
          color: '#D97757',
          backgroundColor: 'transparent',
          ...style
        }
      default:
        return {
          backgroundColor: '#D97757',
          color: 'white',
          ...style
        }
    }
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      style={getDefaultStyle()}
      {...props}
    />
  )
}

export { Button, buttonVariants }