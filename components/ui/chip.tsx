// components/ui/chip.tsx

import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center w-fit px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-default text-muted-foreground",
        outline: "border border-input bg-transparent text-foreground",
        destructive: "bg-destructive/50 text-destructive",
        success: "bg-green-800/50 text-green-100",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      radius: "full",
    },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  onClose?: () => void;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, radius, onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(chipVariants({ variant, radius }), className)}
        {...props}
      >
        <span className="truncate">{children}</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-foreground/10"
          >
            <span className="sr-only">Remove</span>
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }
);

Chip.displayName = "Chip";

export { Chip, chipVariants };
