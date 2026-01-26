import { forwardRef } from 'react';
import './Button.css';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const iconOnly = !children && Icon;

  return (
    <button 
      ref={ref}
      className={`btn btn-${variant} ${sizeClass} ${iconOnly ? 'btn-icon' : ''} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon />}
      {children}
      {Icon && iconPosition === 'right' && <Icon />}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
