import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import classNames from 'classnames';
import Button from '../Button/Button';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  showCloseButton?: boolean;
  showBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  showBackdrop = true,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  footer,
  className,
}) => {
  useEffect(() => {
    if (!closeOnEsc || !isOpen) return;

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [closeOnEsc, isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalClasses = classNames(
    styles.modal,
    styles[size],
    className
  );

  const modalContent = (
    <div className={styles.modalContainer}>
      {showBackdrop && (
        <div
          className={styles.backdrop}
          onClick={handleBackdropClick}
          data-testid="modal-backdrop"
        />
      )}
      
      <div className={styles.modalWrapper}>
        <div
          className={modalClasses}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {title && (
            <div className={styles.header}>
              <h2 id="modal-title" className={styles.title}>
                {title}
              </h2>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="small"
                  onClick={onClose}
                  className={styles.closeButton}
                  aria-label="Закрыть модальное окно"
                >
                  <FiX size={20} />
                </Button>
              )}
            </div>
          )}
          
          {!title && showCloseButton && (
            <Button
              variant="ghost"
              size="small"
              onClick={onClose}
              className={styles.closeButtonFloating}
              aria-label="Закрыть модальное окно"
            >
              <FiX size={20} />
            </Button>
          )}
          
          <div className={styles.content}>{children}</div>
          
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;