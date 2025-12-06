import React from 'react';
import { FiTrash2, FiGitMerge } from 'react-icons/fi';
import Button from '@ui/Button/Button';
import Table, { Column } from '@ui/Table/Table';
import Card from '@ui/Card/Card';
import styles from './DuplicatesTable.module.css';

interface DuplicateCase {
  id: string;
  title: string;
  duplicateWith: string;
  similarity: number;
  type: 'ui' | 'api';
  created: string;
}

const DuplicatesTable: React.FC = () => {
  const duplicates: DuplicateCase[] = [
    { id: '1', title: 'Проверка кнопки "Добавить сервис"', duplicateWith: 'TC-001', similarity: 95, type: 'ui', created: '2024-01-15' },
    { id: '2', title: 'Тест формы логина', duplicateWith: 'TC-045', similarity: 88, type: 'ui', created: '2024-01-10' },
    { id: '3', title: 'API: GET /vms', duplicateWith: 'TC-102', similarity: 92, type: 'api', created: '2024-01-12' },
    { id: '4', title: 'Проверка мобильной адаптации', duplicateWith: 'TC-023', similarity: 76, type: 'ui', created: '2024-01-05' },
    { id: '5', title: 'API: POST /disks', duplicateWith: 'TC-115', similarity: 81, type: 'api', created: '2024-01-08' },
  ];

  const columns: Column<DuplicateCase>[] = [
    {
      key: 'title',
      title: 'Тест-кейс',
      width: '35%',
      render: (value, row) => (
        <div className={styles.testCaseCell}>
          <div className={styles.testCaseTitle}>{value}</div>
          <div className={styles.testCaseMeta}>
            <span className={`${styles.typeBadge} ${styles[`type-${row.type}`]}`}>
              {row.type.toUpperCase()}
            </span>
            <span className={styles.createdDate}>Создан: {row.created}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'duplicateWith',
      title: 'Дубликат с',
      width: '20%',
      render: (value) => (
        <div className={styles.duplicateWithCell}>
          <span className={styles.testId}>{value}</span>
        </div>
      ),
    },
    {
      key: 'similarity',
      title: 'Сходство',
      width: '15%',
      render: (value) => (
        <div className={styles.similarityCell}>
          <div className={styles.similarityBar}>
            <div 
              className={styles.similarityFill} 
              style={{ width: `${value}%` }}
            />
          </div>
          <span className={styles.similarityValue}>{value}%</span>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Действия',
      width: '30%',
      align: 'right',
      render: (_, row) => (
        <div className={styles.actionsCell}>
          <Button
            variant="outline"
            size="small"
            leftIcon={<FiGitMerge />}
            className={styles.actionButton}
            onClick={() => handleMerge(row.id)}
          >
            Объединить
          </Button>
          <Button
            variant="ghost"
            size="small"
            leftIcon={<FiTrash2 />}
            className={styles.actionButton}
            onClick={() => handleDelete(row.id)}
          >
            Удалить
          </Button>
        </div>
      ),
    },
  ];

  const handleMerge = (id: string) => {
    // TODO: Реализовать объединение тестов
    console.log('Merge test case:', id);
  };

  const handleDelete = (id: string) => {
    // TODO: Реализовать удаление теста
    console.log('Delete test case:', id);
  };

  const handleMergeAll = () => {
    // TODO: Реализовать объединение всех дубликатов
    console.log('Merge all duplicates');
  };

  const handleDeleteAll = () => {
    // TODO: Реализовать удаление всех дубликатов
    console.log('Delete all duplicates');
  };

  return (
    <div className={styles.duplicatesTable}>
      <div className={styles.tableHeader}>
        <h3 className={styles.tableTitle}>Обнаруженные дубликаты тестов</h3>
        <div className={styles.tableActions}>
          <Button
            variant="outline"
            size="small"
            leftIcon={<FiGitMerge />}
            onClick={handleMergeAll}
          >
            Объединить все
          </Button>
          <Button
            variant="ghost"
            size="small"
            leftIcon={<FiTrash2 />}
            onClick={handleDeleteAll}
          >
            Удалить все
          </Button>
        </div>
      </div>
      
      <Card variant="filled" className={styles.infoCard}>
        <div className={styles.infoContent}>
          <strong>AI рекомендует:</strong> Объединить дубликаты со сходством более 85% 
          для оптимизации тестовой базы. Это сократит время выполнения тестов на ~15%.
        </div>
      </Card>
      
      <Table
        data={duplicates}
        columns={columns}
        keyExtractor={(item) => item.id}
        striped
        hoverable
      />
      
      <div className={styles.statsFooter}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Всего дубликатов:</span>
          <span className={styles.statValue}>{duplicates.length}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Среднее сходство:</span>
          <span className={styles.statValue}>
            {Math.round(duplicates.reduce((sum, item) => sum + item.similarity, 0) / duplicates.length)}%
          </span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Экономия времени:</span>
          <span className={styles.statValue}>~45 минут</span>
        </div>
      </div>
    </div>
  );
};

export default DuplicatesTable;