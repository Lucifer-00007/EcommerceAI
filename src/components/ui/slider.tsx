import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: number[];
  value?: number[];
  onValueChange?: (value: number[]) => void;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, defaultValue, value, onValueChange, max = 100, step = 1, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || [0]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value);
      setInternalValue([newValue]);
      if (onValueChange) {
        onValueChange([newValue]);
      }
    };

    return (
      <div className={cn('flex items-center space-x-4', className)}>
        <input
          type="range"
          ref={ref}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          min={0}
          max={max}
          step={step}
          value={value ? value[0] : internalValue[0]}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };
