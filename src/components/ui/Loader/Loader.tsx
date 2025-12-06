import React from 'react';
import classNames from 'classnames';
import styles from './Loader.module.css';

export type LoaderSize = 'small' | 'medium' | 'large';
export type LoaderVariant = 'spinner' | 'dots' | 'progress';

interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  color?: string;
  className?: string;
  text?: string;
  showText?: boolean;
  progress?: number; // Для variant='progress'
}

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  variant = 'spinner',
  color,
  className,
  text = 'Загрузка...',
  showText = false,
  progress,
}) => {
  const containerClasses = classNames(
    styles.container,
    className
  );

  const loaderClasses = classNames(
    styles.loader,
    styles[variant],
    styles[size],
    {
      [styles.withText]: showText,
    }
  );

  const loaderStyle = color ? { color } : undefined;

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={loaderClasses} style={loaderStyle}>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
          </div>
        );
      
      case 'progress':
        return (
          <div className={loaderClasses} style={loaderStyle}>
            <div className={styles.progressTrack}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${Math.min(100, Math.max(0, progress || 0))}%` }}
              />
            </div>
            {showText && progress !== undefined && (
              <span className={styles.progressText}>{Math.round(progress)}%</span>
            )}
          </div>
        );
      
      case 'spinner':
      default:
        return <div className={loaderClasses} style={loaderStyle} />;
    }
  };

  return (
    <div className={containerClasses}>
      {renderLoader()}
      {showText && variant !== 'progress' && (
        <span className={styles.text}>{text}</span>
      )}
    </div>
  );
};

export default Loader;