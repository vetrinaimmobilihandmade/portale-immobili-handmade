import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 bg-white border rounded-lg text-text-primary
            placeholder:text-text-disabled resize-vertical
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

Textarea.displayName = 'Textarea';

export default Textarea;
