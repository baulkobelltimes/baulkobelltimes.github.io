import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '' 
}) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  const handleClose = useCallback(() => {
    if (modalRef.current && overlayRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.in'
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        onComplete: onClose
      });
    } else {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current && overlayRef.current) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );
      gsap.fromTo(modalRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  return createPortal(
    <div 
      ref={overlayRef}
      className="modal-overlay" 
      onClick={handleOverlayClick}
    >
      <div ref={modalRef} className={`modal ${className}`}>
        <Button
          variant="ghost"
          icon={X}
          className="modal-close"
          onClick={handleClose}
          aria-label="Close"
        />
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
