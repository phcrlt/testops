import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectSidebarCollapsed } from '@store/slices/uiSlice';
import { 
  FiHome, 
  FiFileText, 
  FiBarChart2, 
  FiCheckSquare, 
  FiFolder, 
  FiSettings,
  FiGitBranch,
  FiBook,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import MenuItem from './MenuItem';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  const collapsed = useSelector(selectSidebarCollapsed);
  const location = useLocation();
  console.log(location.pathname);
  
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Дашборд',
      icon: <FiHome size={20} />,
      path: '/',
      exact: true,
    },
    {
      id: 'generator',
      label: 'Генератор тестов',
      icon: <FiFileText size={20} />,
      path: '/generator',
      children: [
        { id: 'ui', label: 'UI Тесты', icon: '', path: '/generator/ui' },
        { id: 'api', label: 'API Тесты', icon: '', path: '/generator/api' },
      ],
    },
    {
      id: 'coverage',
      label: 'Анализ покрытия',
      icon: <FiBarChart2 size={20} />,
      path: '/coverage',
    },
    {
      id: 'standards',
      label: 'Проверка стандартов',
      icon: <FiCheckSquare size={20} />,
      path: '/standards',
    },
    {
      id: 'testplans',
      label: 'Тест-планы',
      icon: <FiFolder size={20} />,
      path: '/testplans',
    },
    {
      id: 'integrations',
      label: 'Интеграции',
      icon: <FiGitBranch size={20} />,
      path: '/integrations',
    },
    {
      id: 'documentation',
      label: 'Документация',
      icon: <FiBook size={20} />,
      path: '/documentation',
    },
    {
      id: 'settings',
      label: 'Настройки',
      icon: <FiSettings size={20} />,
      path: '/settings',
    },
  ];

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        {!collapsed && <div className={styles.sidebarTitle}>Навигация</div>}
        <button className={styles.collapseButton} aria-label={collapsed ? 'Развернуть' : 'Свернуть'}>
          {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className={styles.nav}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              <MenuItem item={item} collapsed={collapsed} />
            </li>
          ))}
        </ul>
      </nav>
      
      <div className={styles.sidebarFooter}>
        {!collapsed && (
          <div className={styles.quickStats}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Тест-кейсов</div>
              <div className={styles.statValue}>156</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Покрытие</div>
              <div className={`${styles.statValue} ${styles.coverageGood}`}>85%</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;