import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'password' | 'email' | 'number';
  showClearButton?: boolean;
  showPasswordToggle?: boolean;
  className?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({
    value = '',
    onChange,
    label,
    placeholder,
    helperText,
    errorMessage,
    disabled = false,
    invalid = false,
    loading = false,
    variant = 'outlined',
    size = 'md',
    type = 'text',
    showClearButton = false,
    showPasswordToggle = false,
    className,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalType, setInternalType] = useState(type);

    React.useEffect(() => {
      if (type === 'password') {
        setInternalType(showPassword ? 'text' : 'password');
      } else {
        setInternalType(type);
      }
    }, [type, showPassword]);

    const handleClear = () => {
      if (onChange) {
        const event = {
          target: { value: '' }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const hasError = invalid || !!errorMessage;
    const hasContent = value && value.length > 0;

    // Size variants
    const sizeClasses = {
      sm: {
        input: 'h-8 px-3 text-sm',
        label: 'text-sm',
        icon: 'h-4 w-4'
      },
      md: {
        input: 'h-10 px-3 text-sm',
        label: 'text-sm',
        icon: 'h-4 w-4'
      },
      lg: {
        input: 'h-12 px-4 text-base',
        label: 'text-base',
        icon: 'h-5 w-5'
      }
    };

    // Variant styles
    const variantClasses = {
      filled: cn(
        'bg-input border border-transparent',
        'hover:border-input-border',
        'focus:border-primary focus:bg-background',
        hasError && 'border-destructive bg-destructive-light focus:border-destructive',
        disabled && 'bg-muted border-border cursor-not-allowed opacity-60'
      ),
      outlined: cn(
        'bg-background border border-input-border',
        'hover:border-border-hover',
        'focus:border-primary focus:ring-1 focus:ring-primary/20',
        hasError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
        disabled && 'bg-muted border-border cursor-not-allowed opacity-60'
      ),
      ghost: cn(
        'bg-transparent border border-transparent',
        'hover:bg-input hover:border-input-border',
        'focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary/20',
        hasError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
        disabled && 'cursor-not-allowed opacity-60'
      )
    };

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <label 
            className={cn(
              'block font-medium text-foreground',
              sizeClasses[size].label,
              disabled && 'opacity-60'
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            type={internalType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled || loading}
            className={cn(
              'w-full rounded-md transition-colors',
              'placeholder:text-muted-foreground',
              'focus:outline-none',
              sizeClasses[size].input,
              variantClasses[variant],
              // Add padding for icons
              (showClearButton && hasContent) || 
              (showPasswordToggle && type === 'password') || 
              loading ? 'pr-10' : '',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              helperText || errorMessage ? `${props.id || 'input'}-description` : undefined
            }
            {...props}
          />
          
          {/* Icons container */}
          {((showClearButton && hasContent) || 
            (showPasswordToggle && type === 'password') || 
            loading) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              {loading && (
                <Loader2 className={cn('animate-spin text-muted-foreground', sizeClasses[size].icon)} />
              )}
              
              {!loading && showClearButton && hasContent && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={disabled}
                  className={cn(
                    'text-muted-foreground hover:text-foreground transition-colors',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                    sizeClasses[size].icon
                  )}
                  aria-label="Clear input"
                >
                  <X className={sizeClasses[size].icon} />
                </button>
              )}
              
              {!loading && showPasswordToggle && type === 'password' && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={disabled}
                  className={cn(
                    'text-muted-foreground hover:text-foreground transition-colors',
                    'disabled:cursor-not-allowed disabled:opacity-60'
                  )}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className={sizeClasses[size].icon} />
                  ) : (
                    <Eye className={sizeClasses[size].icon} />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Helper text or error message */}
        {(helperText || errorMessage) && (
          <p 
            id={`${props.id || 'input'}-description`}
            className={cn(
              'text-sm',
              hasError ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export { InputField };
export type { InputFieldProps };