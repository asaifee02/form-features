
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import FormField from '@/components/FormField';
import { cn } from '@/lib/utils';

interface BooleanFieldProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
  variant?: 'switch' | 'checkbox';
}

const BooleanField = ({
  label,
  value,
  onChange,
  required = false,
  description,
  error,
  className,
  variant = 'switch'
}: BooleanFieldProps) => {
  return (
    <FormField
      label={label}
      required={required}
      description={description}
      error={error}
      className={className}
    >
      <div className="flex items-center gap-2">
        {variant === 'switch' ? (
          <Switch
            checked={value}
            onCheckedChange={onChange}
            className="data-[state=checked]:bg-form-purple"
          />
        ) : (
          <Checkbox
            checked={value}
            onCheckedChange={onChange}
            className="data-[state=checked]:bg-form-purple data-[state=checked]:border-form-purple"
          />
        )}
        <span className="text-sm text-muted-foreground">
          {value ? 'Enabled' : 'Disabled'}
        </span>
      </div>
    </FormField>
  );
};

export default BooleanField;
