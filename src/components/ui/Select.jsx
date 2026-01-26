import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import './Select.css';

const Select = forwardRef(({ 
  options = [], 
  value, 
  onChange, 
  className = '',
  ...props 
}, ref) => {
  return (
    <div className={`select-wrapper ${className}`}>
      <select 
        ref={ref}
        className="select"
        value={value}
        onChange={onChange}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="select-icon" size={18} />
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
