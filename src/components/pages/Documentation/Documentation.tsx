import React, { useState } from 'react';
import { FiBook, FiCode, FiFileText, FiVideo, FiDownload, FiSearch, FiChevronRight, FiExternalLink } from 'react-icons/fi';
import Button from '@ui/Button/Button';
import Card from '@ui/Card/Card';
import Input from '@ui/Input/Input';
import Tabs from '@ui/Tabs/Tabs';
import CodeEditor from '@ui/CodeEditor/CodeEditor';
import styles from './Documentation.module.css';
import { FiCheckCircle } from 'react-icons/fi';

interface DocumentationSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const documentationSections: DocumentationSection[] = [
    {
      id: 'getting-started',
      title: 'Начало работы',
      description: 'Быстрый старт с TestOps Copilot',
      icon: <FiBook />,
      content: (
        <div className={styles.sectionContent}>
          <h2>Добро пожаловать в TestOps Copilot!</h2>
          <p>
            TestOps Copilot — это AI-ассистент для автоматизации работы QA-инженера, 
            разработанный на базе Cloud.ru Evolution Foundation Model.
          </p>
          
          <h3>Быстрый старт</h3>
          <ol className={styles.stepsList}>
            <li>
              <strong>Авторизуйтесь</strong> в системе используя ваши учетные данные Cloud.ru
            </li>
            <li>
              <strong>Создайте тест-кейсы</strong> с помощью генератора тестов
            </li>
            <li>
              <strong>Проанализируйте покрытие</strong> с помощью инструментов анализа
            </li>
            <li>
              <strong>Интегрируйте</strong> с вашими CI/CD pipeline
            </li>
          </ol>
          
          <h3>Системные требования</h3>
          <ul className={styles.requirementsList}>
            <li>Доступ к Cloud.ru Evolution Foundation Model API</li>
            <li>Python 3.10+ для запуска сгенерированных тестов</li>
            <li>GitLab/GitHub для интеграции</li>
            <li>Allure TestOps для отчетности (опционально)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'generator',
      title: 'Генератор тестов',
      description: 'Создание тест-кейсов и автотестов',
      icon: <FiCode />,
      content: (
        <div className={styles.sectionContent}>
          <h2>Генератор тестов</h2>
          <p>
            Генератор тестов позволяет автоматически создавать тест-кейсы и автотесты 
            на основе описания требований и спецификаций.
          </p>
          
          <h3>Поддерживаемые форматы</h3>
          <div className={styles.featuresGrid}>
            <Card variant="outlined" className={styles.featureCard}>
              <FiCode className={styles.featureIcon} />
              <h4>UI Тестирование</h4>
              <p>Генерация тестов для веб-интерфейсов (Playwright)</p>
            </Card>
            <Card variant="outlined" className={styles.featureCard}>
              <FiFileText className={styles.featureIcon} />
              <h4>API Тестирование</h4>
              <p>Генерация тестов для REST API (pytest + requests)</p>
            </Card>
            <Card variant="outlined" className={styles.featureCard}>
              <FiBook className={styles.featureIcon} />
              <h4>Allure TestOps</h4>
              <p>Формат Allure TestOps as Code (Python)</p>
            </Card>
          </div>
          
          <h3>Пример генерации</h3>
          <CodeEditor
            value={`# Пример сгенерированного тест-кейса
import allure
import pytest

@allure.feature("calculator-ui")
@allure.label("owner", "qa-team")
class TestCalculatorUI:
    @allure.title("Проверка кнопки 'Добавить сервис'")
    @allure.tag("CRITICAL")
    def test_add_service_button(self):
        """Тест проверяет доступность кнопки добавления сервиса"""
        
        with allure.step("Открыть главную страницу калькулятора"):
            page.goto("https://cloud.ru/calculator")
        
        with allure.step("Найти кнопку 'Добавить сервис'"):
            button = page.locator("button:has-text('Добавить сервис')")
            assert button.is_visible(), "Кнопка не найдена"
            assert button.is_enabled(), "Кнопка не активна"`}
            language="python"
            readOnly
            height="300px"
          />
        </div>
      ),
    },
    {
      id: 'standards',
      title: 'Стандарты тестирования',
      description: 'Правила и стандарты для тест-кейсов',
      icon: <FiFileText />,
      content: (
        <div className={styles.sectionContent}>
          <h2>Стандарты тестирования</h2>
          <p>
            Все тест-кейсы, генерируемые TestOps Copilot, соответствуют стандартам 
            Allure TestOps и паттерну AAA (Arrange-Act-Assert).
          </p>
          
          <h3>Обязательные требования</h3>
          <div className={styles.standardsList}>
            <div className={styles.standardItem}>
              <div className={styles.standardHeader}>
                <FiCheckCircle className={styles.standardIcon} />
                <h4>Паттерн AAA</h4>
              </div>
              <p>
                Каждый тест должен следовать паттерну Arrange-Act-Assert:
                подготовка данных → выполнение действия → проверка результата.
              </p>
            </div>
            
            <div className={styles.standardItem}>
              <div className={styles.standardHeader}>
                <FiCheckCircle className={styles.standardIcon} />
                <h4>Allure Decorators</h4>
              </div>
              <p>
                Обязательные декораторы Allure: @allure.feature, @allure.story, 
                @allure.title, @allure.tag, with allure.step.
              </p>
            </div>
            
            <div className={styles.standardItem}>
              <div className={styles.standardHeader}>
                <FiCheckCircle className={styles.standardIcon} />
                <h4>Описания и шаги</h4>
              </div>
              <p>
                Каждый тест должен иметь описание (docstring), а сложные действия 
                должны быть разбиты на шаги с with allure.step.
              </p>
            </div>
          </div>
          
          <h3>Рекомендации</h3>
          <ul className={styles.recommendationsList}>
            <li>Используйте конкретные и осмысленные названия тестов</li>
            <li>Добавляйте метки приоритета (CRITICAL, NORMAL, LOW)</li>
            <li>Указывайте владельца теста (@allure.label("owner", "..."))</li>
            <li>Добавляйте скриншоты для UI тестов (allure.attach)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'integrations',
      title: 'Интеграции',
      description: 'Интеграция с внешними системами',
      icon: <FiExternalLink />,
      content: (
        <div className={styles.sectionContent}>
          <h2>Интеграции</h2>
          <p>
            TestOps Copilot интегрируется с популярными инструментами для 
            автоматизации процесса тестирования.
          </p>
          
          <h3>Поддерживаемые интеграции</h3>
          <div className={styles.integrationsGrid}>
            <Card variant="outlined" className={styles.integrationCard}>
              <div className={styles.integrationHeader}>
                <FiBook className={styles.integrationIcon} />
                <h4>GitLab CI/CD</h4>
              </div>
              <p>Автоматический коммит тестов, запуск в pipeline</p>
              <Button
                variant="outline"
                size="small"
                className={styles.integrationButton}
              >
                Документация
              </Button>
            </Card>
            
            <Card variant="outlined" className={styles.integrationCard}>
              <div className={styles.integrationHeader}>
                <FiBook className={styles.integrationIcon} />
                <h4>Cloud.ru Evolution API</h4>
              </div>
              <p>Доступ к AI-моделям для генерации тестов</p>
              <Button
                variant="outline"
                size="small"
                className={styles.integrationButton}
              >
                Документация
              </Button>
            </Card>
            
            <Card variant="outlined" className={styles.integrationCard}>
              <div className={styles.integrationHeader}>
                <FiBook className={styles.integrationIcon} />
                <h4>Allure TestOps</h4>
              </div>
              <p>Экспорт тест-кейсов и результатов</p>
              <Button
                variant="outline"
                size="small"
                className={styles.integrationButton}
              >
                Документация
              </Button>
            </Card>
          </div>
          
          <h3>API документация</h3>
          <p>
            Для интеграции с вашими системами используйте REST API TestOps Copilot.
            Полная документация доступна по адресу:
          </p>
          <Card variant="filled" className={styles.apiCard}>
            <code className={styles.apiUrl}>
              https://api.testops-copilot.cloud.ru/docs
            </code>
            <Button
              variant="ghost"
              size="small"
              leftIcon={<FiExternalLink />}
              className={styles.apiButton}
            >
              Открыть Swagger
            </Button>
          </Card>
        </div>
      ),
    },
    {
      id: 'tutorials',
      title: 'Видео-уроки',
      description: 'Обучающие материалы и примеры',
      icon: <FiVideo />,
      content: (
        <div className={styles.sectionContent}>
          <h2>Обучающие материалы</h2>
          <p>
            Видео-уроки и практические примеры использования TestOps Copilot.
          </p>
          
          <div className={styles.videoGrid}>
            <Card variant="elevated" className={styles.videoCard}>
              <div className={styles.videoThumbnail}>
                <FiVideo className={styles.videoIcon} />
                <div className={styles.videoDuration}>15:23</div>
              </div>
              <div className={styles.videoContent}>
                <h4>Быстрый старт с TestOps Copilot</h4>
                <p>Как начать работу за 15 минут</p>
                <Button
                  variant="ghost"
                  size="small"
                  leftIcon={<FiVideo />}
                >
                  Смотреть
                </Button>
              </div>
            </Card>
            
            <Card variant="elevated" className={styles.videoCard}>
              <div className={styles.videoThumbnail}>
                <FiVideo className={styles.videoIcon} />
                <div className={styles.videoDuration}>22:41</div>
              </div>
              <div className={styles.videoContent}>
                <h4>Генерация UI тестов для калькулятора</h4>
                <p>Полный процесс от требований до автотестов</p>
                <Button
                  variant="ghost"
                  size="small"
                  leftIcon={<FiVideo />}
                >
                  Смотреть
                </Button>
              </div>
            </Card>
            
            <Card variant="elevated" className={styles.videoCard}>
              <div className={styles.videoThumbnail}>
                <FiVideo className={styles.videoIcon} />
                <div className={styles.videoDuration}>18:15</div>
              </div>
              <div className={styles.videoContent}>
                <h4>Интеграция с GitLab CI/CD</h4>
                <p>Настройка автоматического запуска тестов</p>
                <Button
                  variant="ghost"
                  size="small"
                  leftIcon={<FiVideo />}
                >
                  Смотреть
                </Button>
              </div>
            </Card>
          </div>
          
          <h3>Дополнительные ресурсы</h3>
          <div className={styles.resourcesList}>
            <Button
              variant="outline"
              leftIcon={<FiDownload />}
              className={styles.resourceButton}
            >
              Скачать PDF-документацию
            </Button>
            <Button
              variant="outline"
              leftIcon={<FiBook />}
              className={styles.resourceButton}
            >
              Примеры тест-кейсов
            </Button>
            <Button
              variant="outline"
              leftIcon={<FiCode />}
              className={styles.resourceButton}
            >
              API клиенты (Python, JS)
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = documentationSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeContent = documentationSections.find(
    section => section.id === activeSection
  )?.content;

  return (
    <div className={styles.documentation}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Документация</h1>
          <p className={styles.subtitle}>
            Полное руководство по использованию TestOps Copilot
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <Button
            variant="outline"
            leftIcon={<FiDownload />}
            onClick={() => {
              // TODO: Реализовать скачивание документации
            }}
          >
            Скачать PDF
          </Button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <Card variant="elevated" className={styles.searchCard}>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по документации..."
              leftIcon={<FiSearch />}
            />
          </Card>
          
          <Card variant="elevated" className={styles.sectionsCard}>
            <h3 className={styles.sectionsTitle}>Разделы документации</h3>
            <div className={styles.sectionsList}>
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  className={`${styles.sectionButton} ${
                    activeSection === section.id ? styles.sectionButtonActive : ''
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className={styles.sectionButtonContent}>
                    <div className={styles.sectionButtonIcon}>{section.icon}</div>
                    <div className={styles.sectionButtonText}>
                      <div className={styles.sectionButtonTitle}>{section.title}</div>
                      <div className={styles.sectionButtonDescription}>
                        {section.description}
                      </div>
                    </div>
                  </div>
                  <FiChevronRight className={styles.sectionButtonArrow} />
                </button>
              ))}
            </div>
          </Card>
          
          <Card variant="elevated" className={styles.quickLinksCard}>
            <h3 className={styles.quickLinksTitle}>Быстрые ссылки</h3>
            <div className={styles.quickLinksList}>
              <a href="#" className={styles.quickLink}>
                <FiExternalLink />
                <span>API документация (Swagger)</span>
              </a>
              <a href="#" className={styles.quickLink}>
                <FiExternalLink />
                <span>Cloud.ru Evolution Model API</span>
              </a>
              <a href="#" className={styles.quickLink}>
                <FiExternalLink />
                <span>Allure TestOps документация</span>
              </a>
              <a href="#" className={styles.quickLink}>
                <FiExternalLink />
                <span>GitLab CI/CD примеры</span>
              </a>
            </div>
          </Card>
        </div>
        
        <div className={styles.mainContent}>
          <Card variant="elevated" className={styles.contentCard}>
            <div className={styles.contentHeader}>
              <Tabs
                items={documentationSections.map(section => ({
                  id: section.id,
                  label: section.title,
                }))}
                value={activeSection}
                onChange={setActiveSection}
                variant="underline"
                fullWidth
              />
            </div>
            
            <div className={styles.contentBody}>
              {activeContent}
            </div>
            
            <div className={styles.contentFooter}>
              <div className={styles.feedbackSection}>
                <h4>Эта статья была полезной?</h4>
                <div className={styles.feedbackButtons}>
                  <Button variant="outline" size="small">Да</Button>
                  <Button variant="outline" size="small">Нет</Button>
                </div>
              </div>
              
              <div className={styles.navigationSection}>
                <Button variant="ghost" size="small">
                  ← Предыдущий раздел
                </Button>
                <Button variant="ghost" size="small">
                  Следующий раздел →
                </Button>
              </div>
            </div>
          </Card>
          
          <div className={styles.relatedContent}>
            <Card variant="elevated" className={styles.relatedCard}>
              <h3 className={styles.relatedTitle}>Связанные статьи</h3>
              <div className={styles.relatedList}>
                <a href="#" className={styles.relatedLink}>
                  <FiBook />
                  <span>Как писать хорошие требования для AI</span>
                </a>
                <a href="#" className={styles.relatedLink}>
                  <FiBook />
                  <span>Оптимизация тестового покрытия</span>
                </a>
                <a href="#" className={styles.relatedLink}>
                  <FiBook />
                  <span>Интеграция с Jenkins</span>
                </a>
                <a href="#" className={styles.relatedLink}>
                  <FiBook />
                  <span>Миграция с ручных тестов</span>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;