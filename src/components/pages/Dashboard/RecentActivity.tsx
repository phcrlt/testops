import React from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiPlusCircle } from 'react-icons/fi';
import styles from './RecentActivity.module.css';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'success',
      title: 'Тесты для калькулятора сгенерированы',
      description: '15 UI тест-кейсов создано',
      time: '2 минуты назад',
      icon: <FiCheckCircle />,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Обнаружены дубликаты тестов',
      description: '3 повторяющихся API теста',
      time: '1 час назад',
      icon: <FiXCircle />,
    },
    {
      id: 3,
      type: 'info',
      title: 'Новые требования добавлены',
      description: 'Evolution Compute API v3.1',
      time: '3 часа назад',
      icon: <FiPlusCircle />,
    },
    {
      id: 4,
      type: 'success',
      title: 'Тест-план утверждён',
      description: 'Релиз Q1 2024',
      time: '1 день назад',
      icon: <FiCheckCircle />,
    },
    {
      id: 5,
      type: 'info',
      title: 'Интеграция с GitLab',
      description: 'Настройка webhooks завершена',
      time: '2 дня назад',
      icon: <FiClock />,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'var(--color-secondary)';
      case 'warning': return 'var(--color-warning)';
      case 'error': return 'var(--color-error)';
      default: return 'var(--color-info)';
    }
  };

  return (
    <section className={styles.recentActivity}>
      <div className={styles.activityHeader}>
        <h2 className={styles.activityTitle}>Недавняя активность</h2>
        <button className={styles.viewAllButton}>Показать всё</button>
      </div>
      
      <div className={styles.activityList}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.activityItem}>
            <div 
              className={styles.activityIcon} 
              style={{ color: getTypeColor(activity.type) }}
            >
              {activity.icon}
            </div>
            
            <div className={styles.activityContent}>
              <div className={styles.activityTitleRow}>
                <h3 className={styles.activityItemTitle}>{activity.title}</h3>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
              <p className={styles.activityDescription}>{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentActivity;