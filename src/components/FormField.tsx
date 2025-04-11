
import React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
}

const FormField = ({ 
  label, 
  required = false, 
  description, 
  error, 
  children, 
  className, 
  ...props 
}: FormFieldProps) => {
  return (
    <div className={cn("form-group", className)} {...props}>
      <label className="form-label">
        {label}
        {required && <span className="text-form-red ml-1">*</span>}
      </label>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
      )}
      
      {children}
      
      {error && (
        <p className="mt-1 text-sm text-form-red">{error}</p>
      )}
    </div>
  );
};

export default FormField;
