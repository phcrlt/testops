import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { analyzeCoverage, selectCoverage, selectDuplicates, selectTestsLoading } from '@store/slices/testsSlice';
import { addNotification } from '@store/slices/uiSlice';
import Card from '@ui/Card/Card';
import Button from '@ui/Button/Button';
import Table, { Column } from '@ui/Table/Table';
import Tabs from '@ui/Tabs/Tabs';
import Loader from '@ui/Loader/Loader';
import { FiBarChart2, FiGrid, FiRefreshCw, FiDownload, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import CoverageChart from './CoverageChart';
import DuplicatesTable from './DuplicatesTable';
import styles from './CoverageAnalyzer.module.css';

interface CoverageItem {
  id: string;
  module: string;
  total: number;
  covered: number;
  percentage: number;
  priority: 'high' | 'medium' | 'low';
}

interface Gap {
  id: string;
  module: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const CoverageAnalyzer: React.FC = () => {
  const dispatch = useDispatch();
  const coverage = useSelector(selectCoverage);
  const duplicates = useSelector(selectDuplicates);
  console.log(duplicates);
  const isLoading = useSelector(selectTestsLoading);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'gaps' | 'duplicates'>('overview');
  const [selectedProduct, setSelectedProduct] = useState('calculator');

  useEffect(() => {
    // Загружаем данные покрытия при монтировании
    handleAnalyzeCoverage();
  }, []);

  const handleAnalyzeCoverage = async () => {
    const result = await dispatch(analyzeCoverage(selectedProduct) as any);
    
    if (analyzeCoverage.fulfilled.match(result)) {
      dispatch(addNotification({
        type: 'success',
        message: 'Анализ покрытия завершен',
      }));
    }
  };

  const handleExportReport = () => {
    // TODO: Реализовать экспорт отчета
    dispatch(addNotification({
      type: 'info',
      message: 'Экспорт отчета в разработке',
    }));
  };

  const mockCoverageData: CoverageItem[] = [
    { id: '1', module: 'Калькулятор цен', total: 50, covered: 45, percentage: 90, priority: 'high' },
    { id: '2', module: 'Каталог продуктов', total: 30, covered: 25, percentage: 83, priority: 'high' },
    { id: '3', module: 'Конфигурация Compute', total: 40, covered: 35, percentage: 88, priority: 'high' },
    { id: '4', module: 'Управление конфигурацией', total: 25, covered: 15, percentage: 60, priority: 'medium' },
    { id: '5', module: 'Мобильная адаптация', total: 20, covered: 10, percentage: 50, priority: 'low' },
    { id: '6', module: 'API: VMs', total: 35, covered: 30, percentage: 86, priority: 'high' },
    { id: '7', module: 'API: Disks', total: 25, covered: 20, percentage: 80, priority: 'medium' },
    { id: '8', module: 'API: Flavors', total: 15, covered: 12, percentage: 80, priority: 'low' },
  ];

  const mockGaps: Gap[] = [
    { id: '1', module: 'Управление конфигурацией', description: 'Нет тестов для сравнительного режима', priority: 'high' },
    { id: '2', module: 'Мобильная адаптация', description: 'Не покрыты тесты для планшетов', priority: 'medium' },
    { id: '3', module: 'API: VMs', description: 'Отсутствуют тесты для статусов ВМ', priority: 'high' },
    { id: '4', module: 'Каталог продуктов', description: 'Нет тестов для фильтрации по цене', priority: 'low' },
    { id: '5', module: 'Калькулятор цен', description: 'Не покрыты edge-cases при расчете', priority: 'medium' },
  ];

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: <FiBarChart2 /> },
    { id: 'gaps', label: 'Пробелы', icon: <FiAlertTriangle />, badge: mockGaps.length },
    { id: 'duplicates', label: 'Дубликаты', icon: <FiGrid />, badge: 3 },
  ];

  const products = [
    { id: 'calculator', label: 'Калькулятор цен' },
    { id: 'evolution-compute', label: 'Evolution Compute' },
    { id: 'all', label: 'Все продукты' },
  ];

  const coverageColumns: Column<CoverageItem>[] = [
    {
      key: 'module',
      title: 'Модуль',
      width: '30%',
    },
    {
      key: 'coverage',
      title: 'Покрытие',
      width: '30%',
      render: (_, row) => (
        <div className={styles.coverageBarContainer}>
          <div className={styles.coverageBarBackground}>
            <div 
              className={styles.coverageBarFill} 
              style={{ 
                width: `${row.percentage}%`,
                backgroundColor: row.percentage >= 80 ? 'var(--color-secondary)' :
                               row.percentage >= 60 ? 'var(--color-warning)' : 
                               'var(--color-error)'
              }}
            />
          </div>
          <span className={styles.coveragePercentage}>{row.percentage}%</span>
        </div>
      ),
    },
    {
      key: 'stats',
      title: 'Статистика',
      width: '25%',
      render: (_, row) => (
        <div className={styles.statsCell}>
          <span className={styles.covered}>{row.covered}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.total}>{row.total}</span>
          <span className={styles.testText}> тестов</span>
        </div>
      ),
    },
    {
      key: 'priority',
      title: 'Приоритет',
      width: '15%',
      render: (value) => (
        <span className={`${styles.priorityBadge} ${styles[`priority-${value}`]}`}>
          {value === 'high' ? 'Высокий' : value === 'medium' ? 'Средний' : 'Низкий'}
        </span>
      ),
    },
  ];

  const gapsColumns: Column<Gap>[] = [
    {
      key: 'module',
      title: 'Модуль',
      width: '25%',
    },
    {
      key: 'description',
      title: 'Описание пробела',
      width: '55%',
    },
    {
      key: 'priority',
      title: 'Приоритет',
      width: '20%',
      render: (value) => (
        <span className={`${styles.priorityBadge} ${styles[`priority-${value}`]}`}>
          {value === 'high' ? 'Высокий' : value === 'medium' ? 'Средний' : 'Низкий'}
        </span>
      ),
    },
  ];

  const getRecommendations = () => {
    const lowCoverage = mockCoverageData.filter(item => item.percentage < 70);
    if (lowCoverage.length === 0) return [];
    
    return lowCoverage.map(item => ({
      id: item.id,
      text: `Добавить тесты для модуля "${item.module}" (текущее покрытие: ${item.percentage}%)`,
      module: item.module,
    }));
  };

  const recommendations = getRecommendations();

  return (
    <div className={styles.coverageAnalyzer}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Анализ покрытия</h1>
          <p className={styles.subtitle}>
            Визуализация и оптимизация тестового покрытия продуктов Cloud.ru
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <div className={styles.productSelector}>
            <span className={styles.selectorLabel}>Продукт:</span>
            <div className={styles.productButtons}>
              {products.map((product) => (
                <button
                  key={product.id}
                  className={`${styles.productButton} ${
                    selectedProduct === product.id ? styles.productButtonActive : ''
                  }`}
                  onClick={() => setSelectedProduct(product.id)}
                >
                  {product.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.actionButtons}>
            <Button
              variant="outline"
              leftIcon={<FiRefreshCw />}
              onClick={handleAnalyzeCoverage}
              loading={isLoading}
            >
              Обновить
            </Button>
            <Button
              variant="primary"
              leftIcon={<FiDownload />}
              onClick={handleExportReport}
            >
              Экспорт отчета
            </Button>
          </div>
        </div>
      </header>

      <div className={styles.statsOverview}>
        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statHeader}>
            <FiBarChart2 className={styles.statIcon} />
            <span className={styles.statLabel}>Общее покрытие</span>
          </div>
          <div className={styles.statValue} style={{ color: 'var(--color-secondary)' }}>
            {Math.round(coverage.percentage)}%
          </div>
          <div className={styles.statSubtext}>
            {coverage.covered} / {coverage.total} тест-кейсов
          </div>
        </Card>
        
        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statHeader}>
            <FiCheckCircle className={styles.statIcon} />
            <span className={styles.statLabel}>Полностью покрыто</span>
          </div>
          <div className={styles.statValue} style={{ color: 'var(--color-secondary)' }}>
            {mockCoverageData.filter(item => item.percentage >= 90).length}
          </div>
          <div className={styles.statSubtext}>
            модулей из {mockCoverageData.length}
          </div>
        </Card>
        
        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statHeader}>
            <FiAlertTriangle className={styles.statIcon} />
            <span className={styles.statLabel}>Критические пробелы</span>
          </div>
          <div className={styles.statValue} style={{ color: 'var(--color-error)' }}>
            {mockGaps.filter(gap => gap.priority === 'high').length}
          </div>
          <div className={styles.statSubtext}>
            требуют внимания
          </div>
        </Card>
        
        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statHeader}>
            <FiGrid className={styles.statIcon} />
            <span className={styles.statLabel}>Дубликаты</span>
          </div>
          <div className={styles.statValue} style={{ color: 'var(--color-warning)' }}>
            3
          </div>
          <div className={styles.statSubtext}>
            тест-кейса
          </div>
        </Card>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <Card variant="elevated" className={styles.tabsCard}>
            <Tabs
              items={tabs}
              value={activeTab}
              onChange={(tabId) => setActiveTab(tabId as any)}
              variant="underline"
              fullWidth
            />
            
            <div className={styles.tabContent}>
              {activeTab === 'overview' && (
                <div className={styles.overviewContent}>
                  <div className={styles.chartSection}>
                    <h3 className={styles.sectionTitle}>Распределение покрытия по модулям</h3>
                    <CoverageChart data={mockCoverageData} />
                  </div>
                  
                  <div className={styles.tableSection}>
                    <h3 className={styles.sectionTitle}>Детализация по модулям</h3>
                    {isLoading ? (
                      <div className={styles.loadingContainer}>
                        <Loader size="large" text="Загрузка данных..." />
                      </div>
                    ) : (
                      <Table
                        data={mockCoverageData}
                        columns={coverageColumns}
                        keyExtractor={(item) => item.id}
                        striped
                        hoverable
                      />
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'gaps' && (
                <div className={styles.gapsContent}>
                  <div className={styles.gapsHeader}>
                    <h3 className={styles.sectionTitle}>Пробелы в покрытии</h3>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => {
                        dispatch(addNotification({
                          type: 'info',
                          message: 'Функция создания тестов для пробелов в разработке',
                        }));
                      }}
                    >
                      Создать тесты
                    </Button>
                  </div>
                  
                  {isLoading ? (
                    <div className={styles.loadingContainer}>
                      <Loader size="large" text="Анализ пробелов..." />
                    </div>
                  ) : (
                    <Table
                      data={mockGaps}
                      columns={gapsColumns}
                      keyExtractor={(item) => item.id}
                      striped
                      hoverable
                    />
                  )}
                </div>
              )}
              
              {activeTab === 'duplicates' && (
                <div className={styles.duplicatesContent}>
                  <DuplicatesTable />
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <div className={styles.rightPanel}>
          <Card variant="elevated" className={styles.recommendationsCard}>
            <h3 className={styles.recommendationsTitle}>Рекомендации AI</h3>
            <p className={styles.recommendationsSubtitle}>
              На основе анализа покрытия и типовых дефектов
            </p>
            
            <div className={styles.recommendationsList}>
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <div key={rec.id} className={styles.recommendationItem}>
                    <div className={styles.recommendationIcon}>💡</div>
                    <div className={styles.recommendationContent}>
                      <p className={styles.recommendationText}>{rec.text}</p>
                      <button
                        className={styles.recommendationButton}
                        onClick={() => {
                          dispatch(addNotification({
                            type: 'info',
                            message: `Переход к генерации тестов для ${rec.module}`,
                          }));
                        }}
                      >
                        Сгенерировать тесты
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noRecommendations}>
                  <FiCheckCircle className={styles.successIcon} />
                  <p className={styles.noRecText}>
                    Отличное покрытие! Все модули покрыты более чем на 70%.
                  </p>
                </div>
              )}
            </div>
            
            <div className={styles.optimizationStats}>
              <h4 className={styles.optimizationTitle}>Оптимизация тестов</h4>
              <div className={styles.optimizationItems}>
                <div className={styles.optimizationItem}>
                  <span className={styles.optimizationLabel}>Можно удалить:</span>
                  <span className={styles.optimizationValue}>8 тестов</span>
                </div>
                <div className={styles.optimizationItem}>
                  <span className={styles.optimizationLabel}>Можно объединить:</span>
                  <span className={styles.optimizationValue}>12 тестов</span>
                </div>
                <div className={styles.optimizationItem}>
                  <span className={styles.optimizationLabel}>Экономия времени:</span>
                  <span className={styles.optimizationValue}>~45 мин</span>
                </div>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className={styles.priorityCard}>
            <h3 className={styles.priorityTitle}>Приоритеты покрытия</h3>
            <div className={styles.priorityList}>
              <div className={styles.priorityItem}>
                <div className={`${styles.priorityIndicator} ${styles['priority-high']}`} />
                <div className={styles.priorityContent}>
                  <div className={styles.priorityLabel}>Высокий приоритет</div>
                  <div className={styles.priorityDescription}>
                    Критический функционал, покрытие менее 80%
                  </div>
                </div>
              </div>
              <div className={styles.priorityItem}>
                <div className={`${styles.priorityIndicator} ${styles['priority-medium']}`} />
                <div className={styles.priorityContent}>
                  <div className={styles.priorityLabel}>Средний приоритет</div>
                  <div className={styles.priorityDescription}>
                    Важный функционал, покрытие 80-90%
                  </div>
                </div>
              </div>
              <div className={styles.priorityItem}>
                <div className={`${styles.priorityIndicator} ${styles['priority-low']}`} />
                <div className={styles.priorityContent}>
                  <div className={styles.priorityLabel}>Низкий приоритет</div>
                  <div className={styles.priorityDescription}>
                    Вспомогательный функционал, покрытие более 90%
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoverageAnalyzer;