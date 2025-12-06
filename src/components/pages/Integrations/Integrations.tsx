import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiGitlab, FiCloud, FiCheckCircle, FiXCircle, FiSettings, FiRefreshCw, FiKey, FiLink } from 'react-icons/fi';
import Button from '@ui/Button/Button';
import Card from '@ui/Card/Card';
import Input from '@ui/Input/Input';
import Tabs from '@ui/Tabs/Tabs';
import { addNotification } from '@store/slices/uiSlice';
import styles from './Integrations.module.css';
import Modal from '@ui/Modal/Modal';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
  config: Record<string, any>;
}

const Integrations: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'all' | 'connected' | 'available'>('all');
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'gitlab',
      name: 'GitLab',
      description: 'Интеграция с GitLab для автоматического коммита тестов и работы с CI/CD',
      icon: <FiGitlab />,
      connected: true,
      status: 'connected',
      lastSync: '2024-01-20 14:30',
      config: {
        url: 'https://gitlab.cloud.ru',
        projectId: '12345',
        token: '••••••••',
        branch: 'main',
      },
    },
    {
      id: 'cloud-ru-api',
      name: 'Cloud.ru Evolution API',
      description: 'Доступ к Cloud.ru Evolution Foundation Model для генерации тестов',
      icon: <FiCloud />,
      connected: true,
      status: 'connected',
      lastSync: '2024-01-20 14:25',
      config: {
        endpoint: 'https://api.cloud.ru/evolution',
        token: '••••••••',
        model: 'foundation-v1',
      },
    },
    {
      id: 'allure-testops',
      name: 'Allure TestOps',
      description: 'Экспорт тест-кейсов и результатов в Allure TestOps',
      icon: <FiCheckCircle />,
      connected: false,
      status: 'disconnected',
      lastSync: null,
      config: {},
    },
    {
      id: 'jira',
      name: 'Jira',
      description: 'Синхронизация тест-кейсов с задачами Jira',
      icon: <FiLink />,
      connected: false,
      status: 'disconnected',
      lastSync: null,
      config: {},
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Уведомления о результатах тестирования в Slack',
      icon: <FiSettings />,
      connected: false,
      status: 'disconnected',
      lastSync: null,
      config: {},
    },
  ]);

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [gitlabToken, setGitlabToken] = useState('');
  const [cloudToken, setCloudToken] = useState('');

  const tabs = [
    { id: 'all', label: 'Все интеграции' },
    { id: 'connected', label: 'Подключенные' },
    { id: 'available', label: 'Доступные' },
  ];

  const filteredIntegrations = integrations.filter(integration => {
    if (activeTab === 'connected') return integration.connected;
    if (activeTab === 'available') return !integration.connected;
    return true;
  });

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowConfigModal(true);
  };

  const handleDisconnect = (integration: Integration) => {
    setIntegrations(prev => prev.map(item => 
      item.id === integration.id 
        ? { ...item, connected: false, status: 'disconnected', lastSync: null }
        : item
    ));
    
    dispatch(addNotification({
      type: 'success',
      message: `Интеграция ${integration.name} отключена`,
    }));
  };

  const handleSync = (integration: Integration) => {
    setIntegrations(prev => prev.map(item => 
      item.id === integration.id 
        ? { ...item, lastSync: new Date().toISOString().replace('T', ' ').substring(0, 16) }
        : item
    ));
    
    dispatch(addNotification({
      type: 'success',
      message: `Синхронизация ${integration.name} выполнена`,
    }));
  };

  const handleSaveConfig = () => {
    if (selectedIntegration) {
      setIntegrations(prev => prev.map(item => 
        item.id === selectedIntegration.id 
          ? { 
              ...item, 
              connected: true, 
              status: 'connected',
              lastSync: new Date().toISOString().replace('T', ' ').substring(0, 16),
              config: {
                ...item.config,
                token: selectedIntegration.id === 'gitlab' ? gitlabToken : cloudToken,
              }
            }
          : item
      ));
      
      setShowConfigModal(false);
      setSelectedIntegration(null);
      setGitlabToken('');
      setCloudToken('');
      
      dispatch(addNotification({
        type: 'success',
        message: `Интеграция ${selectedIntegration.name} подключена`,
      }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <FiCheckCircle className={styles.statusIconConnected} />;
      case 'disconnected': return <FiXCircle className={styles.statusIconDisconnected} />;
      case 'error': return <FiXCircle className={styles.statusIconError} />;
      default: return <FiXCircle className={styles.statusIconDisconnected} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Подключено';
      case 'disconnected': return 'Не подключено';
      case 'error': return 'Ошибка';
      default: return 'Неизвестно';
    }
  };

  const stats = {
    total: integrations.length,
    connected: integrations.filter(i => i.connected).length,
    lastSync: integrations.filter(i => i.lastSync).length,
  };

  return (
    <div className={styles.integrations}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Интеграции</h1>
          <p className={styles.subtitle}>
            Настройка подключений к внешним системам и сервисам
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <Button
            variant="outline"
            leftIcon={<FiRefreshCw />}
            onClick={() => {
              dispatch(addNotification({
                type: 'info',
                message: 'Проверка статуса всех интеграций',
              }));
            }}
          >
            Проверить все
          </Button>
        </div>
      </header>

      <div className={styles.statsOverview}>
        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statHeader}>
            <FiLink className={styles.statIcon} />
            <span className={styles.statLabel}>Всего интеграций</span>
          </div>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statSubtext}>
            внешних систем
          </div>
        </Card>
        
        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statHeader}>
            <FiCheckCircle className={styles.statIcon} />
            <span className={styles.statLabel}>Подключено</span>
          </div>
          <div className={styles.statValue}>{stats.connected}</div>
          <div className={styles.statSubtext}>
            из {stats.total}
          </div>
        </Card>
        
        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statHeader}>
            <FiRefreshCw className={styles.statIcon} />
            <span className={styles.statLabel}>Синхронизировано</span>
          </div>
          <div className={styles.statValue}>{stats.lastSync}</div>
          <div className={styles.statSubtext}>
            за последние 24ч
          </div>
        </Card>
        
        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statHeader}>
            <FiSettings className={styles.statIcon} />
            <span className={styles.statLabel}>Доступно</span>
          </div>
          <div className={styles.statValue}>{stats.total - stats.connected}</div>
          <div className={styles.statSubtext}>
            для подключения
          </div>
        </Card>
      </div>

      <div className={styles.mainContent}>
        <Card variant="elevated" className={styles.integrationsCard}>
          <div className={styles.cardHeader}>
            <Tabs
              items={tabs}
              value={activeTab}
              onChange={(tabId) => {
                if (tabId === "connected" || tabId === "all" || tabId === "available") {
                  setActiveTab(tabId);
                }
              }}
              variant="underline"
              fullWidth
            />
          </div>
          
          <div className={styles.integrationsList}>
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id} variant="outlined" className={styles.integrationItem}>
                <div className={styles.integrationHeader}>
                  <div className={styles.integrationInfo}>
                    <div className={styles.integrationIcon}>
                      {integration.icon}
                    </div>
                    <div className={styles.integrationContent}>
                      <div className={styles.integrationTitle}>
                        <h3 className={styles.integrationName}>{integration.name}</h3>
                        <div className={styles.integrationStatus}>
                          {getStatusIcon(integration.status)}
                          <span className={`${styles.statusText} ${styles[`status-${integration.status}`]}`}>
                            {getStatusText(integration.status)}
                          </span>
                        </div>
                      </div>
                      <p className={styles.integrationDescription}>
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className={styles.integrationActions}>
                    {integration.connected ? (
                      <>
                        {integration.lastSync && (
                          <div className={styles.lastSync}>
                            <span className={styles.syncLabel}>Последняя синхронизация:</span>
                            <span className={styles.syncTime}>{integration.lastSync}</span>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="small"
                          leftIcon={<FiRefreshCw />}
                          onClick={() => handleSync(integration)}
                        >
                          Синхронизировать
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          leftIcon={<FiSettings />}
                          onClick={() => handleConnect(integration)}
                        >
                          Настроить
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          leftIcon={<FiXCircle />}
                          onClick={() => handleDisconnect(integration)}
                        >
                          Отключить
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="primary"
                        size="small"
                        leftIcon={<FiLink />}
                        onClick={() => handleConnect(integration)}
                      >
                        Подключить
                      </Button>
                    )}
                  </div>
                </div>
                
                {integration.connected && integration.config && (
                  <div className={styles.integrationConfig}>
                    <h4 className={styles.configTitle}>Конфигурация:</h4>
                    <div className={styles.configGrid}>
                      {Object.entries(integration.config).map(([key, value]) => (
                        <div key={key} className={styles.configItem}>
                          <span className={styles.configKey}>{key}:</span>
                          <span className={styles.configValue}>
                            {typeof value === 'string' && value.includes('••') ? value : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Модальное окно настройки интеграции */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => {
          setShowConfigModal(false);
          setSelectedIntegration(null);
          setGitlabToken('');
          setCloudToken('');
        }}
        title={`Настройка ${selectedIntegration?.name}`}
        size="medium"
      >
        <div className={styles.configModal}>
          {selectedIntegration?.id === 'gitlab' && (
            <div className={styles.configForm}>
              <Input
                label="URL GitLab"
                value={selectedIntegration.config.url || ''}
                placeholder="https://gitlab.example.com"
                required
                readOnly={selectedIntegration.connected}
              />
              
              <Input
                label="Project ID"
                value={selectedIntegration.config.projectId || ''}
                placeholder="12345"
                required
                readOnly={selectedIntegration.connected}
              />
              
              <Input
                label="Personal Access Token"
                type="password"
                value={gitlabToken || selectedIntegration.config.token || ''}
                onChange={(e) => setGitlabToken(e.target.value)}
                placeholder="glpat-xxxxxxxxxxxxxxxx"
                required
                leftIcon={<FiKey />}
              />
              
              <Input
                label="Ветка по умолчанию"
                value={selectedIntegration.config.branch || ''}
                placeholder="main"
                required
                readOnly={selectedIntegration.connected}
              />
            </div>
          )}
          
          {selectedIntegration?.id === 'cloud-ru-api' && (
            <div className={styles.configForm}>
              <Input
                label="API Endpoint"
                value={selectedIntegration.config.endpoint || ''}
                placeholder="https://api.cloud.ru/evolution"
                required
                readOnly={selectedIntegration.connected}
              />
              
              <Input
                label="API Token"
                type="password"
                value={cloudToken || selectedIntegration.config.token || ''}
                onChange={(e) => setCloudToken(e.target.value)}
                placeholder="Введите токен API"
                required
                leftIcon={<FiKey />}
              />
              
              <Input
                label="Модель"
                value={selectedIntegration.config.model || ''}
                placeholder="foundation-v1"
                required
                readOnly={selectedIntegration.connected}
              />
            </div>
          )}
          
          {!['gitlab', 'cloud-ru-api'].includes(selectedIntegration?.id || '') && (
            <div className={styles.placeholderConfig}>
              <FiSettings className={styles.placeholderIcon} />
              <p className={styles.placeholderText}>
                Настройки для {selectedIntegration?.name} будут доступны после подключения
              </p>
            </div>
          )}
          
          <div className={styles.modalActions}>
            <Button
              variant="ghost"
              onClick={() => {
                setShowConfigModal(false);
                setSelectedIntegration(null);
              }}
            >
              Отмена
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveConfig}
              disabled={!gitlabToken && !cloudToken && !selectedIntegration?.connected}
            >
              {selectedIntegration?.connected ? 'Обновить' : 'Подключить'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Integrations;