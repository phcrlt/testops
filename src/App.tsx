import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from '@routes/AppRoutes';
import Header from '@components/layout/Header/Header';
import Sidebar from '@components/layout/Sidebar/Sidebar';
import Footer from '@components/layout/Footer/Footer';
import { selectTheme, toggleTheme } from '@store/slices/uiSlice';
import styles from './App.module.css';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  // Устанавливаем тему при загрузке
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Обработчик переключения темы (можно вызвать из Header)
  // @ts-ignore
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.mainLayout}>
        <Sidebar />
        <main className={styles.mainContent}>
          <AppRoutes />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;