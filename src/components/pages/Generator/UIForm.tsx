import React, { useState } from 'react';
import { FiAlertCircle, FiInfo } from 'react-icons/fi';
import Button from '@ui/Button/Button';
import Card from '@ui/Card/Card';
import styles from './UIForm.module.css';

interface UIFormProps {
  onGenerate: (data: any) => void;
  isLoading: boolean;
}

const UIForm: React.FC<UIFormProps> = ({ onGenerate, isLoading }) => {
  const [formData, setFormData] = useState({
    product: 'calculator',
    requirements: `1. Проверить кнопку "Добавить сервис" на главной странице калькулятора
2. Убедиться, что цена обновляется при изменении конфигурации Compute
3. Проверить работу каталога продуктов (фильтрация, поиск)
4. Тестирование мобильной адаптации интерфейса
5. Проверка скачивания расчета в PDF формате`,
    priority: 'normal' as const,
  });

  const products = [
    { value: 'calculator', label: 'Калькулятор цен Cloud.ru' },
    { value: 'dashboard', label: 'Панель управления Cloud.ru' },
    { value: 'marketplace', label: 'Cloud.ru Marketplace' },
  ];

  const priorities = [
    { value: 'critical', label: 'Критический', color: 'var(--color-error)' },
    { value: 'normal', label: 'Обычный', color: 'var(--color-warning)' },
    { value: 'low', label: 'Низкий', color: 'var(--color-secondary)' },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const examples = [
    'Проверить валидацию полей ввода в калькуляторе',
    'Тестирование адаптивности на разных разрешениях',
    'Проверка работы модальных окон и тултипов',
    'Тестирование навигации между разделами',
  ];

  const handleExampleClick = (example: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements + '\n' + example,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formSection}>
        <label className={styles.sectionLabel}>Продукт для тестирования</label>
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
                <div className={styles.productName}>{product.label}</div>
                <div className={styles.productDescription}>
                  {product.value === 'calculator' && 'UI тестирование калькулятора цен'}
                  {product.value === 'dashboard' && 'Тестирование панели управления'}
                  {product.value === 'marketplace' && 'Тестирование маркетплейса'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formSection}>
        <label className={styles.sectionLabel}>
          Требования для тестирования
          <span className={styles.required}>*</span>
        </label>
        <p className={styles.sectionDescription}>
          Опишите сценарии тестирования по одному в строке. Используйте конкретные формулировки.
        </p>
        
        <div className={styles.requirementsContainer}>
          <textarea
            value={formData.requirements}
            onChange={(e) => handleChange('requirements', e.target.value)}
            className={styles.requirementsInput}
            placeholder="1. Проверить кнопку 'Войти' на главной странице
2. Тестирование формы регистрации
3. Проверка валидации email..."
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
            <span>Примеры формулировок:</span>
          </div>
          <div className={styles.examplesGrid}>
            {examples.map((example, index) => (
              <button
                key={index}
                type="button"
                className={styles.exampleChip}
                onClick={() => handleExampleClick(example)}
              >
                {example}
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
                  {priority.value === 'critical' && 'Тесты для критического функционала'}
                  {priority.value === 'normal' && 'Стандартные тесты'}
                  {priority.value === 'low' && 'Тесты для второстепенных функций'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card variant="filled" className={styles.tipsCard}>
        <div className={styles.tipsHeader}>
          <FiAlertCircle className={styles.tipsIcon} />
          <h3 className={styles.tipsTitle}>Советы по генерации</h3>
        </div>
        <ul className={styles.tipsList}>
          <li>Используйте конкретные формулировки (например, "Проверить кнопку X на странице Y")</li>
          <li>Описывайте по одному сценарию в строке</li>
          <li>Указывайте ожидаемые результаты при необходимости</li>
          <li>Для сложных сценариев используйте нумерацию шагов</li>
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
        Сгенерировать тесты (15+ кейсов)
      </Button>
    </form>
  );
};

export default UIForm;