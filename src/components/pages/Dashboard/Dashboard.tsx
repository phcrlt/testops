import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCoverage, selectTestCases, selectTestsLoading } from '@store/slices/testsSlice';
import { addNotification } from '@store/slices/uiSlice';
import { FiActivity, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const coverage = useSelector(selectCoverage);
  const testCases = useSelector(selectTestCases);
  const isLoading = useSelector(selectTestsLoading);

  useEffect(() => {
    // Загрузка данных для дашборда
    dispatch(addNotification({
      type: 'info',
      message: 'Добро пожаловать в TestOps Copilot! Начните работу с генерации тестов.',
    }));
  }, [dispatch]);

  const stats = {
    totalTests: testCases.length,
    uiTests: testCases.filter(tc => tc.type === 'ui').length,
    apiTests: testCases.filter(tc => tc.type === 'api').length,
    coveragePercentage: coverage.percentage,
    pendingReviews: 12,
    averageGenerationTime: '2.4s',
  };

  const quickActions = [
    {
      id: 1,
      title: 'Сгенерировать UI тесты',
      description: 'Для калькулятора цен Cloud.ru',
      icon: <FiActivity />,
      path: '/generator/ui',
      color: 'var(--color-primary)',
    },
    {
      id: 2,
      title: 'Проанализировать покрытие',
      description: 'Проверить API Evolution Compute',
      icon: <FiTrendingUp />,
      path: '/coverage',
      color: 'var(--color-secondary)',
    },
    {
      id: 3,
      title: 'Проверить стандарты',
      description: 'Валидация тест-кейсов',
      icon: <FiCheckCircle />,
      path: '/standards',
      color: 'var(--color-warning)',
    },
    {
      id: 4,
      title: 'Создать тест-план',
      description: 'Для нового релиза',
      icon: <FiClock />,
      path: '/testplans',
      color: 'var(--color-info)',
    },
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Дашборд</h1>
        <p className={styles.dashboardSubtitle}>
          Обзор производительности и быстрый доступ к функциям TestOps Copilot
        </p>
      </header>

      <div className={styles.dashboardGrid}>
        <div className={styles.mainSection}>
          <StatsCards stats={stats} isLoading={isLoading} />
          
          <section className={styles.quickActionsSection}>
            <h2 className={styles.sectionTitle}>Быстрые действия</h2>
            <div className={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <a
                  key={action.id}
                  href={action.path}
                  className={styles.quickActionCard}
                  style={{ '--action-color': action.color } as React.CSSProperties}
                >
                  <div className={styles.quickActionIcon} style={{ color: action.color }}>
                    {action.icon}
                  </div>
                  <div className={styles.quickActionContent}>
                    <h3 className={styles.quickActionTitle}>{action.title}</h3>
                    <p className={styles.quickActionDescription}>{action.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <RecentActivity />
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.coverageCard}>
            <div className={styles.coverageHeader}>
              <h3 className={styles.coverageTitle}>Покрытие тестами</h3>
              <span className={styles.coveragePercentage}>
                {Math.round(coverage.percentage)}%
              </span>
            </div>
            
            <div className={styles.coverageProgress}>
              <div 
                className={styles.coverageBar} 
                style={{ width: `${coverage.percentage}%` }}
              />
            </div>
            
            <div className={styles.coverageStats}>
              <div className={styles.coverageStat}>
                <span className={styles.coverageStatLabel}>Покрыто:</span>
                <span className={styles.coverageStatValue}>{coverage.covered}</span>
              </div>
              <div className={styles.coverageStat}>
                <span className={styles.coverageStatLabel}>Всего:</span>
                <span className={styles.coverageStatValue}>{coverage.total}</span>
              </div>
            </div>
            
            <button className={styles.coverageButton}>
              Подробный анализ
            </button>
          </div>

          <div className={styles.tipsCard}>
            <h3 className={styles.tipsTitle}>💡 Советы по использованию</h3>
            <ul className={styles.tipsList}>
              <li className={styles.tipItem}>
                Используйте конкретные формулировки в требованиях для лучшей генерации
              </li>
              <li className={styles.tipItem}>
                Регулярно проверяйте покрытие для выявления пробелов
              </li>
              <li className={styles.tipItem}>
                Интегрируйте с GitLab для автоматического коммита тестов
              </li>
              <li className={styles.tipItem}>
                Настройте приоритеты тестов для оптимизации тест-планов
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;