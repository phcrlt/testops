import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, logout } from '@store/slices/authSlice';
import { selectTheme, toggleTheme } from '@store/slices/uiSlice';
import { FiSun, FiMoon, FiBell, FiUser, FiLogOut, FiSearch, FiMenu } from 'react-icons/fi';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const theme = useSelector(selectTheme);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = async () => {
    await dispatch(logout() as any);
    navigate('/login');
    setShowUserMenu(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const notifications = [
    { id: 1, text: 'Тест-кейсы для калькулятора успешно сгенерированы', time: '2 мин назад' },
    { id: 2, text: 'Обнаружены дубликаты тестов в API-покрытии', time: '1 час назад' },
    { id: 3, text: 'Обновлена спецификация Evolution Compute API', time: '2 часа назад' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.menuButton} aria-label="Меню">
          <FiMenu size={20} />
        </button>
        <div className={styles.logo}>
          <img 
            src="/assets/logos/cloud-ru-logo.svg" 
            alt="Cloud.ru" 
            className={styles.logoImage}
          />
          <div className={styles.logoText}>
            <span className={styles.logoMain}>TestOps</span>
            <span className={styles.logoSub}>Copilot</span>
          </div>
        </div>
      </div>

      <div className={styles.headerCenter}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Поиск тест-кейсов, API-эндпойнтов, требований..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className={styles.headerRight}>
        <button
          className={styles.themeToggle}
          onClick={handleThemeToggle}
          aria-label={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
        >
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>

        <div className={styles.notificationsContainer}>
          <button
            className={styles.notificationsButton}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Уведомления"
          >
            <FiBell size={20} />
            <span className={styles.notificationBadge}>3</span>
          </button>

          {showNotifications && (
            <div className={styles.notificationsDropdown}>
              <div className={styles.notificationsHeader}>
                <h3>Уведомления</h3>
                <button 
                  className={styles.markAllRead}
                  onClick={() => setShowNotifications(false)}
                >
                  Прочитать все
                </button>
              </div>
              <div className={styles.notificationsList}>
                {notifications.map((notification) => (
                  <div key={notification.id} className={styles.notificationItem}>
                    <div className={styles.notificationText}>{notification.text}</div>
                    <div className={styles.notificationTime}>{notification.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.userContainer}>
          <button
            className={styles.userButton}
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="Профиль пользователя"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className={styles.userAvatar} />
            ) : (
              <div className={styles.userAvatarFallback}>
                <FiUser size={20} />
              </div>
            )}
            <span className={styles.userName}>{user?.name || 'Гость'}</span>
          </button>

          {showUserMenu && (
            <div className={styles.userDropdown}>
              <div className={styles.userInfo}>
                <div className={styles.userInfoName}>{user?.name || 'Гость'}</div>
                <div className={styles.userInfoEmail}>{user?.email || 'guest@example.com'}</div>
                <div className={styles.userInfoRole}>{user?.role === 'qa' ? 'QA Инженер' : user?.role}</div>
              </div>
              <div className={styles.userMenuItems}>
                <button className={styles.userMenuItem} onClick={() => navigate('/profile')}>
                  <FiUser size={16} />
                  <span>Профиль</span>
                </button>
                <button className={styles.userMenuItem} onClick={handleLogout}>
                  <FiLogOut size={16} />
                  <span>Выйти</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;