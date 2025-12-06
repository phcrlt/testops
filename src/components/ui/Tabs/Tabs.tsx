import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: number | string;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultValue,
  value,
  onChange,
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  className,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || items[0]?.id);
  const activeTab = value || internalValue;

  const handleTabClick = (tabId: string) => {
    if (!value) {
      setInternalValue(tabId);
    }
    onChange?.(tabId);
  };

  const containerClasses = classNames(
    styles.container,
    styles[variant],
    styles[size],
    {
      [styles.fullWidth]: fullWidth,
    },
    className
  );

  return (
    <div className={containerClasses} role="tablist">
      {items.map((tab) => {
        const isActive = activeTab === tab.id;
        const tabClasses = classNames(styles.tab, {
          [styles.active]: isActive,
          [styles.disabled]: tab.disabled,
        });

        return (
          <button
            key={tab.id}
            className={tabClasses}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            disabled={tab.disabled}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
            <span className={styles.tabLabel}>{tab.label}</span>
            {tab.badge !== undefined && Number(tab.badge) > 0 && (
              <span className={styles.badge}>{tab.badge}</span>
            )}
          </button>
        );
      })}
      {variant === 'underline' && (
        <div className={styles.indicator} />
      )}
    </div>
  );
};

export default Tabs;