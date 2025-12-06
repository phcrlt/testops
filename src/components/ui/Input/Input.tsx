import React, { forwardRef } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './Input.module.css';

export type InputSize = 'small' | 'medium' | 'large';
export type InputVariant = 'default' | 'filled' | 'outline';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  variant?: InputVariant;
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'medium',
      variant = 'default',
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    const containerClasses = classNames(
      styles.container,
      {
        [styles.fullWidth]: fullWidth,
      },
      className
    );

    const inputWrapperClasses = classNames(
      styles.inputWrapper,
      styles[size],
      styles[variant],
      {
        [styles.hasError]: hasError,
        [styles.hasSuccess]: hasSuccess,
        [styles.hasLeftIcon]: leftIcon,
        [styles.hasRightIcon]: rightIcon,
      }
    );

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        
        <div className={inputWrapperClasses}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          
          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : 
              helperText ? `${inputId}-helper` : 
              undefined
            }
            {...props}
          />
          
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
          
          {hasError && (
            <span className={styles.errorIcon}>
              <FiAlertCircle />
            </span>
          )}
        </div>
        
        {(error || success || helperText) && (
          <div className={styles.feedback}>
            {error && (
              <span id={`${inputId}-error`} className={styles.error}>
                {error}
              </span>
            )}
            {success && !error && (
              <span id={`${inputId}-success`} className={styles.success}>
                {success}
              </span>
            )}
            {helperText && !error && !success && (
              <span id={`${inputId}-helper`} className={styles.helper}>
                {helperText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;