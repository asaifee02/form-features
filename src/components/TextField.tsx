
import React from 'react';
import { Input } from '@/components/ui/input';
import FormField from '@/components/FormField';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  description?: string;
  error?: string;
  pattern?: string;
  className?: string;
  maxLength?: number;
}

const TextField = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  description,
  error,
  pattern,
  className,
  maxLength
}: TextFieldProps) => {
  const [isValid, setIsValid] = React.useState<boolean | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (pattern) {
      const regex = new RegExp(pattern);
      setIsValid(regex.test(newValue));
    } else {
      setIsValid(null);
    }
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
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={cn(
            "pr-10 transition-all duration-200",
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

export default TextField;
