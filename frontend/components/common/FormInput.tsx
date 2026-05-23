import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || props.name;
    
    return (
      <div className="space-y-2 w-full">
        <Label htmlFor={inputId} className={cn(error && "text-destructive")}>
          {label}
        </Label>
        <Input
          id={inputId}
          ref={ref}
          className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
          {...props}
        />
        {error && (
          <p className="text-sm font-medium text-destructive animate-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)
FormInput.displayName = "FormInput"
