import React, { useState } from 'react';
import { FiAlertCircle, FiInfo, FiUpload, FiLink } from 'react-icons/fi';
import Input from '@ui/Input/Input';
import Button from '@ui/Button/Button';
import Card from '@ui/Card/Card';
import styles from './APIForm.module.css';

interface APIFormProps {
  onGenerate: (data: any) => void;
  isLoading: boolean;
}

const APIForm: React.FC<APIFormProps> = ({ onGenerate, isLoading }) => {
  const [formData, setFormData] = useState({
    product: 'evolution-compute',
    endpoint: 'https://compute.api-cloud.ru/v3',
    requirements: `Покрыть CRUD операции для:
- Виртуальных машин (VMs)
- Дисков (Disks)
- Конфигураций (Flavors)

Особые условия:
- Аутентификация через Bearer token
- Формат UUIDv4 для идентификаторов
- Обработка ошибок по схемам ExceptionSchema`,
    priority: 'normal' as const,
    openapiFile: null as File | null,
    openapiUrl: '',
  });

  const products = [
    { value: 'evolution-compute', label: 'Evolution Compute API', version: 'v3' },
    { value: 'evolution-storage', label: 'Evolution Storage API', version: 'v2' },
    { value: 'evolution-network', label: 'Evolution Network API', version: 'v1' },
  ];

  const priorities = [
    { value: 'critical', label: 'Критический', color: 'var(--color-error)' },
    { value: 'normal', label: 'Обычный', color: 'var(--color-warning)' },
    { value: 'low', label: 'Низкий', color: 'var(--color-secondary)' },
  ];

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.includes('json') || file?.name.endsWith('.yaml') || file?.name.endsWith('.yml')) {
      handleChange('openapiFile', file);
    } else {
      alert('Пожалуйста, загрузите JSON или YAML файл OpenAPI спецификации');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const endpoints = [
    'GET /vms - Получение списка ВМ',
    'POST /vms - Создание ВМ',
    'GET /vms/{id} - Получение информации о ВМ',
    'PUT /vms/{id} - Обновление ВМ',
    'DELETE /vms/{id} - Удаление ВМ',
    'GET /disks - Получение списка дисков',
    'POST /disks - Создание диска',
  ];

  const handleEndpointClick = (endpoint: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements + '\n' + endpoint,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formSection}>
        <label className={styles.sectionLabel}>API для тестирования</label>
        <div className={styles.productGrid}>
          {products.map((product) => (
            <div
              key={product.value}
              className={`${styles.productCard} ${
                formData.product === product.value ? styles.productCardActive : ''
              }`}
              onClick={() => handleChange('product', product.value)}
            >
              <div className={styles.productRadio}>
                <div className={styles.radioIndicator} />
              </div>
              <div className={styles.productContent}>
                <div className={styles.productHeader}>
                  <div className={styles.productName}>{product.label}</div>
                  <div className={styles.productVersion}>{product.version}</div>
                </div>
                <div className={styles.productDescription}>
                  {product.value === 'evolution-compute' && 'Виртуальные машины, диски, конфигурации'}
                  {product.value === 'evolution-storage' && 'Объектное хранилище, блочное хранилище'}
                  {product.value === 'evolution-network' && 'Сети, балансировщики, файерволы'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formSection}>
        <label className={styles.sectionLabel}>
          Базовый Endpoint
          <span className={styles.required}>*</span>
        </label>
        <Input
          value={formData.endpoint}
          onChange={(e) => handleChange('endpoint', e.target.value)}
          placeholder="https://api.example.com/v1"
          required
          leftIcon={<FiLink />}
        />
      </div>

      <div className={styles.formSection}>
        <label className={styles.sectionLabel}>OpenAPI спецификация</label>
        <p className={styles.sectionDescription}>
          Загрузите файл или укажите URL OpenAPI спецификации для автоматического парсинга
        </p>
        
        <div className={styles.openapiOptions}>
          <div className={styles.uploadSection}>
            <label className={styles.uploadLabel}>
              <input
                type="file"
                accept=".json,.yaml,.yml"
                onChange={handleFileUpload}
                className={styles.fileInput}
              />
              <div className={styles.uploadArea}>
                <FiUpload className={styles.uploadIcon} />
                <div className={styles.uploadText}>
                  {formData.openapiFile ? (
                    <>
                      <div className={styles.fileName}>{formData.openapiFile.name}</div>
                      <div className={styles.fileSize}>
                        {(formData.openapiFile.size / 1024).toFixed(1)} KB
                      </div>
                    </>
                  ) : (
                    <>
                      <div>Загрузить OpenAPI файл</div>
                      <div className={styles.uploadHint}>JSON или YAML до 10MB</div>
                    </>
                  )}
                </div>
              </div>
            </label>
          </div>

          <div className={styles.orDivider}>или</div>

          <div className={styles.urlSection}>
            <Input
              value={formData.openapiUrl}
              onChange={(e) => handleChange('openapiUrl', e.target.value)}
              placeholder="https://example.com/openapi.json"
              leftIcon={<FiLink />}
            />
            <Button
              type="button"
              variant="outline"
              className={styles.fetchButton}
            >
              Загрузить
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <label className={styles.sectionLabel}>
          Требования для тестирования
          <span className={styles.required}>*</span>
        </label>
        <p className={styles.sectionDescription}>
          Опишите эндпойнты для тестирования или используйте примеры ниже
        </p>
        
        <div className={styles.requirementsContainer}>
          <textarea
            value={formData.requirements}
            onChange={(e) => handleChange('requirements', e.target.value)}
            className={styles.requirementsInput}
            placeholder="GET /users - Получение списка пользователей
POST /users - Создание пользователя
PUT /users/{id} - Обновление пользователя..."
            rows={8}
            required
          />
          <div className={styles.textareaFooter}>
            <span className={styles.lineCount}>
              {formData.requirements.split('\n').length} строк
            </span>
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => handleChange('requirements', '')}
            >
              Очистить
            </button>
          </div>
        </div>

        <div className={styles.examplesSection}>
          <div className={styles.examplesHeader}>
            <FiInfo className={styles.examplesIcon} />
            <span>Примеры эндпойнтов:</span>
          </div>
          <div className={styles.examplesGrid}>
            {endpoints.map((endpoint, index) => (
              <button
                key={index}
                type="button"
                className={styles.exampleChip}
                onClick={() => handleEndpointClick(endpoint)}
              >
                {endpoint}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <label className={styles.sectionLabel}>Приоритет тестов</label>
        <div className={styles.priorityGrid}>
          {priorities.map((priority) => (
            <div
              key={priority.value}
              className={`${styles.priorityCard} ${
                formData.priority === priority.value ? styles.priorityCardActive : ''
              }`}
              style={{
                '--priority-color': priority.color,
              } as React.CSSProperties}
              onClick={() => handleChange('priority', priority.value)}
            >
              <div className={styles.priorityRadio}>
                <div className={styles.radioIndicator} />
              </div>
              <div className={styles.priorityContent}>
                <div className={styles.priorityName}>{priority.label}</div>
                <div className={styles.priorityDescription}>
                  {priority.value === 'critical' && 'Тесты для критических API'}
                  {priority.value === 'normal' && 'Стандартные API тесты'}
                  {priority.value === 'low' && 'Тесты для вспомогательных API'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card variant="filled" className={styles.tipsCard}>
        <div className={styles.tipsHeader}>
          <FiAlertCircle className={styles.tipsIcon} />
          <h3 className={styles.tipsTitle}>Советы по генерации API тестов</h3>
        </div>
        <ul className={styles.tipsList}>
          <li>Указывайте HTTP методы и пути эндпойнтов</li>
          <li>Описывайте ожидаемые статус-коды ответов</li>
          <li>Указывайте необходимые заголовки (Authorization, Content-Type)</li>
          <li>Для тестирования ошибок описывайте невалидные сценарии</li>
        </ul>
      </Card>

      <Button
        type="submit"
        variant="primary"
        size="large"
        loading={isLoading}
        fullWidth
        className={styles.generateButton}
      >
        Сгенерировать API тесты (15+ кейсов)
      </Button>
    </form>
  );
};

export default APIForm;