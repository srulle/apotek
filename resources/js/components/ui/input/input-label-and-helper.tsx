import { useId, forwardRef, InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface InputLabelAndHelperProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: boolean
}

const InputLabelAndHelper = forwardRef<HTMLInputElement, InputLabelAndHelperProps>(
  ({ label, helperText, error = false, className, id: providedId, ...props }, ref) => {
    const generatedId = useId()
    const id = providedId || generatedId

    return (
      <div className={`w-full space-y-2 ${className || ''}`}>
        {label && (
          <Label htmlFor={id} className={error ? 'text-destructive' : ''}>
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          id={id}
          {...props}
          className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {helperText && (
          <p className={`text-xs italic -mt-2 ${error ? 'text-destructive' : 'text-muted-foreground'}`}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

InputLabelAndHelper.displayName = 'InputLabelAndHelper'

export { InputLabelAndHelper }
