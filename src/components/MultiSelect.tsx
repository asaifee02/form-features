
import React, { useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import FormField from './FormField';
import { Option } from './SingleSelect';

interface MultiSelectProps {
  label: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  required?: boolean;
  description?: string;
  error?: string;
  searchable?: boolean;
  max?: number;
}

const MultiSelect = ({
  label,
  options,
  value = [],
  onChange,
  placeholder = "Select options",
  required = false,
  description,
  error,
  searchable = true,
  max,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const selectedOptions = options.filter(option => value.includes(option.value));
  
  const filteredOptions = searchable && searchValue
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchValue.toLowerCase()))
    : options;
    
  const handleSelect = (option: Option) => {
    if (value.includes(option.value)) {
      onChange(value.filter(v => v !== option.value));
    } else {
      if (max && value.length >= max) {
        // If max selections reached, replace the last selected item
        const newValue = [...value.slice(0, -1), option.value];
        onChange(newValue);
      } else {
        onChange([...value, option.value]);
      }
    }
  };
  
  const handleRemoveTag = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };
  
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setSearchValue('');
  };
  
  return (
    <FormField 
      label={label} 
      required={required}
      description={description}
      error={error}
    >
      <div className="relative">
        <div
          className={cn(
            "flex flex-wrap items-center w-full min-h-[38px] p-1.5 text-sm border rounded-md cursor-pointer",
            isOpen ? "ring-2 ring-form-purple/30 border-form-purple" : "border-input",
            error && "border-form-red"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-1 items-center flex-1 mr-1">
              {selectedOptions.map((option) => (
                <span 
                  key={option.value} 
                  className="flex items-center gap-1 bg-form-purple-light text-form-gray-dark px-2 py-0.5 rounded-md text-xs"
                >
                  <span>{option.label}</span>
                  <X 
                    size={14} 
                    className="cursor-pointer hover:text-form-red" 
                    onClick={(e) => handleRemoveTag(option.value, e)}
                  />
                </span>
              ))}
            </div>
          ) : (
            <span className="ml-2 text-muted-foreground flex-1">{placeholder}</span>
          )}
          
          <div className="flex items-center gap-1 ml-auto mr-1">
            {selectedOptions.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-1 text-form-gray hover:text-form-red rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Clear all"
              >
                <X size={16} />
              </button>
            )}
            <span className="text-muted-foreground">
              <ChevronDown size={18} className={cn(isOpen && "rotate-180 transition-transform")} />
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {searchable && (
              <div className="sticky top-0 z-10 px-3 py-2 bg-white border-b flex items-center">
                <Search size={16} className="text-muted-foreground mr-2" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full focus:outline-none bg-transparent"
                  placeholder="Search..."
                  autoFocus
                />
              </div>
            )}
            
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer flex items-center hover:bg-muted transition-colors",
                    value.includes(option.value) && "bg-form-purple-light text-form-purple-dark font-medium"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                >
                  <div className="flex items-center flex-1 gap-2">
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center",
                      value.includes(option.value) 
                        ? "bg-form-purple border-form-purple" 
                        : "border-gray-300"
                    )}>
                      {value.includes(option.value) && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </div>
              ))
            )}
            
            {max && value.length >= max && (
              <div className="px-3 py-2 text-xs text-muted-foreground border-t">
                Maximum of {max} items can be selected
              </div>
            )}
          </div>
        )}
      </div>
    </FormField>
  );
};

export default MultiSelect;
