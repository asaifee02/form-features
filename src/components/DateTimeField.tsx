
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import FormField from '@/components/FormField';

interface DateTimeFieldProps {
  label: string;
  value: Date | null;
  onChange: (value: Date | null) => void;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
  showTime?: boolean;
}

const DateTimeField = ({
  label,
  value,
  onChange,
  required = false,
  description,
  error,
  className,
  showTime = true
}: DateTimeFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Set today's date as default value if value is null
  useEffect(() => {
    if (value === null) {
      onChange(new Date());
    }
  }, []);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!value) return;
    
    const timeStr = e.target.value;
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    const newDate = new Date(value);
    newDate.setHours(hours || 0);
    newDate.setMinutes(minutes || 0);
    
    onChange(newDate);
  };

  return (
    <FormField
      label={label}
      required={required}
      description={description}
      error={error}
      className={className}
    >
      <div className="flex flex-col space-y-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !value && "text-muted-foreground",
                "group hover:bg-form-purple-light hover:text-form-purple-dark hover:border-form-purple transition-all"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 group-hover:text-form-purple-dark transition-colors" />
              {value ? format(value, 'PPP') : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              mode="single"
              selected={value || undefined}
              onSelect={(date) => {
                // Preserve time if we had a previous value
                if (date && value) {
                  date.setHours(value.getHours(), value.getMinutes());
                }
                onChange(date);
                // Close the calendar popover after date selection
                if (!showTime) setIsOpen(false);
                else setIsOpen(false); // Close even with time option enabled
              }}
              initialFocus
              className="rounded-md border animate-fade-in"
            />
          </PopoverContent>
        </Popover>

        {showTime && value && (
          <div className="flex items-center animate-fade-in">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              value={value ? format(value, 'HH:mm') : ''}
              onChange={handleTimeChange}
              className="max-w-[150px] focus-visible:ring-form-purple/30"
              onBlur={() => {
                // Optional: If you want to close any parent popover after time selection
                // This can help if the time input is inside another popover
              }}
            />
          </div>
        )}
      </div>
    </FormField>
  );
};

export default DateTimeField;
