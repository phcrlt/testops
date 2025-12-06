import React from 'react';
import { FiFileText, FiCode, FiCheckSquare, FiClock, FiTrendingUp } from 'react-icons/fi';
import styles from './StatsCards.module.css';

interface StatsCardsProps {
  stats: {
    totalTests: number;
    uiTests: number;
    apiTests: number;
    coveragePercentage: number;
    pendingReviews: number;
    averageGenerationTime: string;
  };
  isLoading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const cards = [
    {
      id: 'total',
      title: 'Всего тестов',
      value: stats.totalTests,
      icon: <FiFileText size={24} />,
      color: 'var(--color-primary)',
      change: '+12%',
    },
    {
      id: 'ui',
      title: 'UI тесты',
      value: stats.uiTests,
      icon: <FiCode size={24} />,
      color: 'var(--color-secondary)',
      change: '+8%',
    },
    {
      id: 'api',
      title: 'API тесты',
      value: stats.apiTests,
      icon: <FiCheckSquare size={24} />,
      color: 'var(--color-warning)',
      change: '+15%',
    },
    {
      id: 'coverage',
      title: 'Покрытие',
      value: `${Math.round(stats.coveragePercentage)}%`,
      icon: <FiTrendingUp size={24} />,
      color: 'var(--color-info)',
      change: '+5%',
    },
    {
      id: 'pending',
      title: 'На проверке',
      value: stats.pendingReviews,
      icon: <FiClock size={24} />,
      color: 'var(--color-error)',
      change: '-3%',
    },
    {
      id: 'time',
      title: 'Среднее время',
      value: stats.averageGenerationTime,
      icon: <FiClock size={24} />,
      color: 'var(--color-primary-dark)',
      change: '-0.4s',
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.statsGrid}>
        {cards.map((card) => (
          <div key={card.id} className={styles.statsCard}>
            <div className={styles.skeletonLoader} style={{ height: '60px' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.statsGrid}>
      {cards.map((card) => (
        <div key={card.id} className={styles.statsCard}>
          <div className={styles.statsCardHeader}>
            <div className={styles.statsIcon} style={{ backgroundColor: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
            <span className={styles.statsChange} style={{ color: card.change.startsWith('+') ? 'var(--color-secondary)' : 'var(--color-error)' }}>
              {card.change}
            </span>
          </div>
          
          <div className={styles.statsValue}>{card.value}</div>
          <div className={styles.statsTitle}>{card.title}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;