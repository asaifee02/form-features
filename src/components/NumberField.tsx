
import React from 'react';
import { Input } from '@/components/ui/input';
import FormField from '@/components/FormField';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NumberFieldProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  required?: boolean;
  description?: string;
  error?: string;
  pattern?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
}

const NumberField = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  description,
  error,
  pattern,
  className,
  min,
  max,
  step = 1,
  precision = 0
}: NumberFieldProps) => {
  const [isValid, setIsValid] = React.useState<boolean | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (val === '') {
      onChange(null);
      setIsValid(null);
      return;
    }
    
    const numValue = precision === 0 ? parseInt(val) : parseFloat(val);
    
    if (isNaN(numValue)) {
      setIsValid(false);
      return;
    }
    
    let isValueValid = true;
    
    if (min !== undefined && numValue < min) isValueValid = false;
    if (max !== undefined && numValue > max) isValueValid = false;
    
    if (pattern) {
      const regex = new RegExp(pattern);
      isValueValid = isValueValid && regex.test(val);
    }
    
    setIsValid(isValueValid);
    onChange(numValue);
  };
  
  const increment = () => {
    if (value === null) {
      onChange(min !== undefined ? min : 0);
      return;
    }
    
    if (max !== undefined && value >= max) return;
    
    const newValue = precision === 0
      ? value + step
      : parseFloat((value + step).toFixed(precision));
      
    onChange(newValue);
  };
  
  const decrement = () => {
    if (value === null) {
      onChange(min !== undefined ? min : 0);
      return;
    }
    
    if (min !== undefined && value <= min) return;
    
    const newValue = precision === 0
      ? value - step
      : parseFloat((value - step).toFixed(precision));
      
    onChange(newValue);
  };
  
  const valueString = value !== null 
    ? precision === 0 ? value.toString() : value.toFixed(precision) 
    : '';
  
  return (
    <FormField
      label={label}
      required={required}
      description={description}
      error={error}
      className={className}
    >
      <div className="relative flex">
        <Input
          type="text"
          inputMode="numeric"
          value={valueString}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "pr-10 transition-all duration-200",
            isValid === true && "border-form-purple focus-visible:ring-form-purple/50",
            isValid === false && "border-form-red focus-visible:ring-form-red/50"
          )}
          min={min}
          max={max}
          step={step}
        />
        
        <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-center">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={increment}
            className="h-5 w-5 rounded-sm hover:bg-form-purple-light hover:text-form-purple-dark"
            disabled={max !== undefined && value !== null && value >= max}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={decrement} 
            className="h-5 w-5 rounded-sm hover:bg-form-purple-light hover:text-form-purple-dark"
            disabled={min !== undefined && value !== null && value <= min}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
        
        {isValid !== null && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2 transition-opacity duration-200">
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

export default NumberField;
