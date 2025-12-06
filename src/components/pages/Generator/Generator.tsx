import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateTests, selectGeneratedCode, selectTestsLoading } from '@store/slices/testsSlice';
import { addNotification } from '@store/slices/uiSlice';
import Tabs from '@ui/Tabs/Tabs';
import Card from '@ui/Card/Card';
import Button from '@ui/Button/Button';
import Loader from '@ui/Loader/Loader';
import {FiDownload, FiCopy, FiSave } from 'react-icons/fi';
import UIForm from './UIForm';
import APIForm from './APIForm';
import CodePreview from './CodePreview';
import styles from './Generator.module.css';

const Generator: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const generatedCode = useSelector(selectGeneratedCode);
  const isLoading = useSelector(selectTestsLoading);
  
  const [activeTab, setActiveTab] = useState<'ui' | 'api'>(
    location.pathname.includes('/api') ? 'api' : 'ui'
  );
  
  const tabs = [
    { id: 'ui', label: 'UI Тестирование', badge: 15 },
    { id: 'api', label: 'API Тестирование', badge: 12 },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as 'ui' | 'api');
    navigate(`/generator/${tabId}`);
  };

  const handleGenerate = async (data: any) => {
    const request = {
      product: data.product,
      type: activeTab,
      requirements: data.requirements,
      priority: data.priority,
      owner: 'current-user',
    };

    const result = await dispatch(generateTests(request) as any);
    
    if (generateTests.fulfilled.match(result)) {
      dispatch(addNotification({
        type: 'success',
        message: `Тесты успешно сгенерированы! Создано ${result.payload.testCases.length} тест-кейсов.`,
      }));
    }
  };

  const handleSaveToGitLab = () => {
    // TODO: Реализовать сохранение в GitLab
    dispatch(addNotification({
      type: 'info',
      message: 'Функция сохранения в GitLab скоро будет доступна',
    }));
  };

  const handleDownload = () => {
    // TODO: Реализовать скачивание файла
    dispatch(addNotification({
      type: 'success',
      message: 'Код тестов скачан',
    }));
  };

  const handleCopy = async () => {
    if (!generatedCode) return;
    
    try {
      await navigator.clipboard.writeText(generatedCode);
      dispatch(addNotification({
        type: 'success',
        message: 'Код скопирован в буфер обмена',
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Не удалось скопировать код',
      }));
    }
  };

  return (
    <div className={styles.generator}>
      <header className={styles.header}>
        <h1 className={styles.title}>Генератор тестов</h1>
        <p className={styles.subtitle}>
          Автоматическая генерация тест-кейсов и автотестов на основе требований
        </p>
      </header>

      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <Card variant="elevated" className={styles.configCard}>
            <div className={styles.configHeader}>
              <h2 className={styles.configTitle}>Конфигурация</h2>
              <Tabs
                items={tabs}
                value={activeTab}
                onChange={handleTabChange}
                variant="pills"
                fullWidth
              />
            </div>

            <div className={styles.configContent}>
              {activeTab === 'ui' ? (
                <UIForm onGenerate={handleGenerate} isLoading={isLoading} />
              ) : (
                <APIForm onGenerate={handleGenerate} isLoading={isLoading} />
              )}
            </div>
          </Card>

          {generatedCode && (
            <Card variant="elevated" className={styles.actionsCard}>
              <h3 className={styles.actionsTitle}>Действия с кодом</h3>
              <div className={styles.actionsGrid}>
                <Button
                  variant="outline"
                  leftIcon={<FiCopy />}
                  onClick={handleCopy}
                  fullWidth
                >
                  Копировать код
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<FiDownload />}
                  onClick={handleDownload}
                  fullWidth
                >
                  Скачать файл
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<FiSave />}
                  onClick={handleSaveToGitLab}
                  fullWidth
                >
                  Сохранить в GitLab
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div className={styles.rightPanel}>
          <Card variant="elevated" className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <h2 className={styles.previewTitle}>
                {activeTab === 'ui' ? 'UI Тесты' : 'API Тесты'}
              </h2>
              <div className={styles.previewBadge}>
                {activeTab === 'ui' ? 'Python + Playwright' : 'Python + Pytest'}
              </div>
            </div>

            <div className={styles.previewContent}>
              {isLoading ? (
                <div className={styles.loadingOverlay}>
                  <Loader size="large" variant="dots" text="Генерация тестов..." showText />
                </div>
              ) : generatedCode ? (
                <CodePreview code={generatedCode} language="python" />
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🤖</div>
                  <h3 className={styles.emptyTitle}>Тесты еще не сгенерированы</h3>
                  <p className={styles.emptyText}>
                    Заполните форму слева и нажмите "Сгенерировать тесты"
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Generator;