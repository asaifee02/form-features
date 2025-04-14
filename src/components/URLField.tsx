
import React from 'react';
import { Input } from '@/components/ui/input';
import FormField from '@/components/FormField';
import { cn } from '@/lib/utils';
import { Check, X, Link } from 'lucide-react';

interface URLFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  description?: string;
  error?: string;
  pattern?: string;
  className?: string;
}

const DEFAULT_URL_PATTERN = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;

const URLField = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  description,
  error,
  pattern,
  className
}: URLFieldProps) => {
  const [isValid, setIsValid] = React.useState<boolean | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (!newValue) {
      setIsValid(null);
      return;
    }
    
    const urlRegex = pattern ? new RegExp(pattern) : DEFAULT_URL_PATTERN;
    setIsValid(urlRegex.test(newValue));
  };
  
  return (
    <FormField
      label={label}
      required={required}
      description={description}
      error={error}
      className={className}
    >
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Link className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="url"
          value={value}
          onChange={handleChange}
          placeholder={placeholder || 'https://example.com'}
          className={cn(
            "pl-10 pr-10 transition-all duration-200",
            isValid === true && "border-form-purple focus-visible:ring-form-purple/50",
            isValid === false && "border-form-red focus-visible:ring-form-red/50"
          )}
        />
        {isValid !== null && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-opacity duration-200">
            {isValid ? (
              <Check className="h-5 w-5 text-form-purple animate-fade-in" />
            ) : (
              <X className="h-5 w-5 text-form-red animate-fade-in" />
            )}
          </div>
        )}
      </div>
    </FormField>
  );
};

export default URLField;
