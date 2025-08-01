import React, { useState, useEffect } from 'react';
import { parsePhoneNumber, isValidPhoneNumber, AsYouType } from 'libphonenumber-js';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, className, error, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
      setDisplayValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Use AsYouType formatter for real-time formatting
      const asYouType = new AsYouType('GB'); // Default to UK
      const formatted = asYouType.input(inputValue);
      
      setDisplayValue(formatted);
      
      // Validate the phone number
      const valid = inputValue.length === 0 || isValidPhoneNumber(inputValue, 'GB');
      setIsValid(valid);
      
      // Pass the raw input back to parent
      onChange(inputValue);
    };

    const handleBlur = () => {
      // On blur, try to format to international format if valid
      if (value && isValidPhoneNumber(value, 'GB')) {
        try {
          const phoneNumber = parsePhoneNumber(value, 'GB');
          const formatted = phoneNumber.formatInternational();
          setDisplayValue(formatted);
          onChange(phoneNumber.number);
        } catch (e) {
          // If parsing fails, keep the current value
        }
      }
    };

    return (
      <div className="space-y-1">
        <Input
          ref={ref}
          type="tel"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            className,
            !isValid && "border-red-500 border-2 focus:border-red-500"
          )}
          placeholder="07xxx xxx xxx"
          {...props}
        />
        {!isValid && (
          <p className="text-sm text-red-500 font-bold">Please enter a valid UK phone number</p>
        )}
        {error && (
          <p className="text-sm text-red-500 font-bold">{error}</p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
