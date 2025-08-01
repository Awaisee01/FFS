import React from 'react';
import { Check } from 'lucide-react';

interface SquareCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
  className?: string;
}

const SquareCheckbox = React.forwardRef<HTMLInputElement, SquareCheckboxProps>(
  ({ checked, onCheckedChange, required, className = "" }, ref) => {
    return (
      <div className="relative inline-block">
        <input
          ref={ref}
          type="checkbox"
          required={required}
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="sr-only"
        />
        <div
          onClick={() => onCheckedChange(!checked)}
          className={`
            cursor-pointer
            border-2
            transition-all
            duration-200
            flex
            items-center
            justify-center
            ${className}
          `}
          style={{
            width: '20px',
            height: '20px',
            minWidth: '20px',
            minHeight: '20px',
            maxWidth: '20px',
            maxHeight: '20px',
            aspectRatio: '1 / 1',
            borderRadius: '4px',
            borderColor: 'white',
            backgroundColor: checked ? 'white' : 'transparent',
          }}
        >
          {checked && (
            <Check 
              className="text-gray-900"
              style={{
                width: '14px',
                height: '14px',
                strokeWidth: 2.5
              }}
            />
          )}
        </div>
      </div>
    );
  }
);

SquareCheckbox.displayName = "SquareCheckbox";

export { SquareCheckbox };