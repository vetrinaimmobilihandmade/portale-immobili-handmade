import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 bg-white border rounded-lg text-text-primary
            placeholder:text-text-disabled
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            disabled:bg-neutral-main disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-neutral-border'}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        />

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-text-secondary">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
