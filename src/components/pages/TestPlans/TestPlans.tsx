import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiPlus, FiCalendar, FiUsers, FiCheckCircle, FiClock, FiDownload, FiEdit2, FiTrash2, FiPlay, FiBarChart2 } from 'react-icons/fi';
import Button from '@ui/Button/Button';
import Card from '@ui/Card/Card';
import Input from '@ui/Input/Input';
import Table, { Column } from '@ui/Table/Table';
import Modal from '@ui/Modal/Modal';
import Tabs from '@ui/Tabs/Tabs';
import { addNotification } from '@store/slices/uiSlice';
import styles from './TestPlans.module.css';

interface TestPlan {
  id: string;
  name: string;
  description: string;
  product: string;
  testCases: number;
  coverage: number;
  priority: 'high' | 'medium' | 'low';
  status: 'draft' | 'active' | 'completed';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const TestPlans: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'active' | 'completed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TestPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const mockTestPlans: TestPlan[] = [
    { id: '1', name: 'Q1 2024 Релиз', description: 'Тестирование основного функционала для релиза Q1', product: 'Калькулятор цен', testCases: 156, coverage: 85, priority: 'high', status: 'active', createdBy: 'Иван Петров', createdAt: '2024-01-15', updatedAt: '2024-01-20' },
    { id: '2', name: 'Evolution Compute API', description: 'Полное покрытие API тестами', product: 'Evolution Compute', testCases: 89, coverage: 92, priority: 'high', status: 'active', createdBy: 'Анна Сидорова', createdAt: '2024-01-10', updatedAt: '2024-01-18' },
    { id: '3', name: 'Мобильная адаптация', description: 'Тестирование на мобильных устройствах', product: 'Калькулятор цен', testCases: 45, coverage: 65, priority: 'medium', status: 'draft', createdBy: 'Иван Петров', createdAt: '2024-01-05', updatedAt: '2024-01-05' },
    { id: '4', name: 'Интеграционные тесты', description: 'Тестирование интеграций между сервисами', product: 'Все продукты', testCases: 78, coverage: 78, priority: 'medium', status: 'active', createdBy: 'Петр Иванов', createdAt: '2024-01-12', updatedAt: '2024-01-19' },
    { id: '5', name: 'Регрессионное тестирование', description: 'Проверка критического функционала', product: 'Калькулятор цен', testCases: 120, coverage: 95, priority: 'high', status: 'completed', createdBy: 'Анна Сидорова', createdAt: '2023-12-20', updatedAt: '2024-01-10' },
    { id: '6', name: 'Security Testing', description: 'Проверка безопасности API', product: 'Evolution Compute', testCases: 34, coverage: 45, priority: 'low', status: 'draft', createdBy: 'Петр Иванов', createdAt: '2024-01-08', updatedAt: '2024-01-08' },
  ];

  const tabs = [
    { id: 'all', label: 'Все планы', badge: mockTestPlans.length },
    { id: 'draft', label: 'Черновики', badge: mockTestPlans.filter(p => p.status === 'draft').length },
    { id: 'active', label: 'Активные', badge: mockTestPlans.filter(p => p.status === 'active').length },
    { id: 'completed', label: 'Завершенные', badge: mockTestPlans.filter(p => p.status === 'completed').length },
  ];

  const filteredPlans = mockTestPlans.filter(plan => {
    const matchesTab = activeTab === 'all' || plan.status === activeTab;
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const columns: Column<TestPlan>[] = [
    {
      key: 'name',
      title: 'Название плана',
      width: '25%',
      render: (value, row) => (
        <div className={styles.planCell}>
          <div className={styles.planName}>{value}</div>
          <div className={styles.planDescription}>{row.description}</div>
          <div className={styles.planMeta}>
            <span className={styles.planProduct}>{row.product}</span>
            <span className={`${styles.statusBadge} ${styles[`status-${row.status}`]}`}>
              {row.status === 'draft' ? 'Черновик' : 
               row.status === 'active' ? 'Активный' : 'Завершен'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'coverage',
      title: 'Покрытие',
      width: '15%',
      render: (value) => (
        <div className={styles.coverageCell}>
          <div className={styles.coverageValue}>{value}%</div>
          <div className={styles.coverageBar}>
            <div 
              className={styles.coverageFill} 
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'testCases',
      title: 'Тест-кейсы',
      width: '15%',
      render: (value) => (
        <div className={styles.testCasesCell}>
          <FiCheckCircle className={styles.testCasesIcon} />
          <span className={styles.testCasesValue}>{value}</span>
          <span className={styles.testCasesLabel}>тестов</span>
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
    {
      key: 'actions',
      title: 'Действия',
      width: '30%',
      align: 'right',
      render: (_, row) => (
        <div className={styles.actionsCell}>
          <Button
            variant="ghost"
            size="small"
            leftIcon={<FiPlay />}
            className={styles.actionButton}
            onClick={() => handleRunPlan(row)}
          >
            Запустить
          </Button>
          <Button
            variant="ghost"
            size="small"
            leftIcon={<FiEdit2 />}
            className={styles.actionButton}
            onClick={() => handleEditPlan(row)}
          >
            Редактировать
          </Button>
          <Button
            variant="ghost"
            size="small"
            leftIcon={<FiTrash2 />}
            className={styles.actionButton}
            onClick={() => handleDeleteClick(row)}
          >
            Удалить
          </Button>
        </div>
      ),
    },
  ];

  const handleCreatePlan = () => {
    // TODO: Реализовать создание тест-плана
    setShowCreateModal(false);
    dispatch(addNotification({
      type: 'success',
      message: 'Новый тест-план создан',
    }));
  };

  const handleRunPlan = (plan: TestPlan) => {
    dispatch(addNotification({
      type: 'info',
      message: `Запуск тест-плана "${plan.name}"`,
    }));
  };

  const handleEditPlan = (plan: TestPlan) => {
    setSelectedPlan(plan);
    dispatch(addNotification({
      type: 'info',
      message: `Редактирование тест-плана "${plan.name}"`,
    }));
  };

  const handleDeleteClick = (plan: TestPlan) => {
    setSelectedPlan(plan);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPlan) {
      dispatch(addNotification({
        type: 'success',
        message: `Тест-план "${selectedPlan.name}" удален`,
      }));
      setShowDeleteModal(false);
      setSelectedPlan(null);
    }
  };

  const stats = {
    totalPlans: mockTestPlans.length,
    activePlans: mockTestPlans.filter(p => p.status === 'active').length,
    totalTestCases: mockTestPlans.reduce((sum, plan) => sum + plan.testCases, 0),
    avgCoverage: Math.round(mockTestPlans.reduce((sum, plan) => sum + plan.coverage, 0) / mockTestPlans.length),
  };

  return (
    <div className={styles.testPlans}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Тест-планы</h1>
          <p className={styles.subtitle}>
            Управление тестовыми планами, распределение ресурсов и отслеживание прогресса
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <Button
            variant="primary"
            leftIcon={<FiPlus />}
            onClick={() => setShowCreateModal(true)}
          >
            Создать план
          </Button>
          <Button
            variant="outline"
            leftIcon={<FiDownload />}
            onClick={() => dispatch(addNotification({
              type: 'info',
              message: 'Экспорт всех планов в разработке',
            }))}
          >
            Экспорт всех
          </Button>
        </div>
      </header>

      <div className={styles.statsOverview}>
        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statHeader}>
            <FiCalendar className={styles.statIcon} />
            <span className={styles.statLabel}>Всего планов</span>
          </div>
          <div className={styles.statValue}>{stats.totalPlans}</div>
          <div className={styles.statSubtext}>
            {stats.activePlans} активных
          </div>
        </Card>
        
        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statHeader}>
            <FiCheckCircle className={styles.statIcon} />
            <span className={styles.statLabel}>Тест-кейсов</span>
          </div>
          <div className={styles.statValue}>{stats.totalTestCases}</div>
          <div className={styles.statSubtext}>
            во всех планах
          </div>
        </Card>
        
        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statHeader}>
            <FiBarChart2 className={styles.statIcon} />
            <span className={styles.statLabel}>Среднее покрытие</span>
          </div>
          <div className={styles.statValue}>{stats.avgCoverage}%</div>
          <div className={styles.statSubtext}>
            по всем планам
          </div>
        </Card>
        
        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statHeader}>
            <FiUsers className={styles.statIcon} />
            <span className={styles.statLabel}>Участники</span>
          </div>
          <div className={styles.statValue}>12</div>
          <div className={styles.statSubtext}>
            QA инженеров
          </div>
        </Card>
      </div>

      <div className={styles.mainContent}>
        <Card variant="elevated" className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.tableControls}>
              <Tabs
                items={tabs}
                value={activeTab}
                onChange={(tabId) => setActiveTab(tabId as any)}
                variant="underline"
              />
              
              <div className={styles.searchContainer}>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по названию или описанию..."
                  leftIcon={<FiClock />}
                />
              </div>
            </div>
            
            <div className={styles.tableInfo}>
              <span className={styles.tableCount}>
                Найдено: {filteredPlans.length} планов
              </span>
            </div>
          </div>
          
          <Table
            data={filteredPlans}
            columns={columns}
            keyExtractor={(item) => item.id}
            striped
            hoverable
            emptyText="Тест-планы не найдены"
          />
        </Card>
      </div>

      {/* Модальное окно создания тест-плана */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Создать новый тест-план"
        size="medium"
      >
        <div className={styles.createModal}>
          <div className={styles.modalForm}>
            <Input
              label="Название плана"
              placeholder="Q1 2024 Релиз"
              required
            />
            
            <Input
              label="Описание"
              placeholder="Тестирование основного функционала для релиза Q1"
              required
            />
            
            <div className={styles.formRow}>
              <Input
                label="Продукт"
                placeholder="Калькулятор цен"
                required
              />
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Приоритет</label>
                <div className={styles.priorityOptions}>
                  {(['high', 'medium', 'low'] as const).map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      className={`${styles.priorityOption} ${styles[`priority-${priority}`]}`}
                    >
                      {priority === 'high' ? 'Высокий' : 
                       priority === 'medium' ? 'Средний' : 'Низкий'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <Input
                label="Количество тест-кейсов"
                type="number"
                placeholder="100"
                required
              />
              
              <Input
                label="Целевое покрытие (%)"
                type="number"
                placeholder="85"
                required
              />
            </div>
          </div>
          
          <div className={styles.modalActions}>
            <Button
              variant="ghost"
              onClick={() => setShowCreateModal(false)}
            >
              Отмена
            </Button>
            <Button
              variant="primary"
              onClick={handleCreatePlan}
            >
              Создать план
            </Button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно подтверждения удаления */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Подтверждение удаления"
        size="small"
      >
        <div className={styles.deleteModal}>
          <p className={styles.deleteText}>
            Вы уверены, что хотите удалить тест-план 
            <strong> "{selectedPlan?.name}"</strong>?
          </p>
          <p className={styles.deleteWarning}>
            Это действие нельзя отменить. Все связанные данные будут удалены.
          </p>
          
          <div className={styles.modalActions}>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
            >
              Отмена
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
            >
              Удалить
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TestPlans;