import React from 'react';
import { NavLink } from 'react-router-dom';
import type { MenuItem as MenuItemType } from 'src/types/ui.types';
import styles from './MenuItem.module.css';

interface MenuItemProps {
  item: MenuItemType;
  collapsed: boolean;
}


const MenuItem: React.FC<MenuItemProps> = ({ item, collapsed }) => {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <NavLink
      to={item.path}
      end={item.exact || false} // Используем exact из типа
      className={({ isActive }) =>
        `${styles.menuLink} ${isActive ? styles.active : ''}`
      }
    >
      <span className={styles.menuIcon}>{item.icon}</span>
      {!collapsed && <span className={styles.menuLabel}>{item.label}</span>}
      {!collapsed && hasChildren && (
        <span className={styles.expandIcon}>▶</span>
      )}
    </NavLink>
  );
};

export default MenuItem;