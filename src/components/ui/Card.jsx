import { forwardRef } from 'react';
import './Card.css';

const Card = forwardRef(({ 
  children, 
  className = '', 
  title,
  icon: Icon,
  actions,
  ...props 
}, ref) => {
  return (
    <div ref={ref} className={`card ${className}`} {...props}>
      {(title || actions) && (
        <div className="card-header">
          {title && (
            <h3 className="card-title">
              {Icon && <Icon />}
              {title}
            </h3>
          )}
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
