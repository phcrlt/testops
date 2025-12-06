import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiUpload, FiFileText, FiCode, FiDownload } from 'react-icons/fi';
import Button from '@ui/Button/Button';
import Card from '@ui/Card/Card';
import Input from '@ui/Input/Input';
import CodeEditor from '@ui/CodeEditor/CodeEditor';
import Tabs from '@ui/Tabs/Tabs';
import Loader from '@ui/Loader/Loader';
import Modal from '@ui/Modal/Modal';
import { addNotification } from '@store/slices/uiSlice';
import styles from './StandardsChecker.module.css';

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
}

interface ValidationIssue {
  id: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  rule: string;
  suggestion: string;
}

const StandardsChecker: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'upload' | 'code' | 'gitlab'>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationIssue[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [gitlabUrl, setGitlabUrl] = useState('');

  const validationRules: ValidationRule[] = [
    { id: '1', name: 'AAA Pattern', description: 'Тест должен следовать паттерну Arrange-Act-Assert', severity: 'error' },
    { id: '2', name: 'Allure Decorators', description: 'Наличие обязательных декораторов Allure', severity: 'error' },
    { id: '3', name: 'Test Description', description: 'Тест должен иметь описание', severity: 'warning' },
    { id: '4', name: 'Steps Definition', description: 'Шаги теста должны быть описаны с with allure.step', severity: 'error' },
    { id: '5', name: 'Assertions', description: 'Тест должен содержать проверки (assert)', severity: 'error' },
    { id: '6', name: 'Priority Labels', description: 'Наличие меток приоритета', severity: 'warning' },
    { id: '7', name: 'Owner Label', description: 'Наличие метки владельца теста', severity: 'info' },
    { id: '8', name: 'Feature/Story', description: 'Наличие меток feature и story', severity: 'info' },
  ];

  const mockValidationResults: ValidationIssue[] = [
    { id: '1', line: 12, column: 1, message: 'Отсутствует декоратор @allure.title', severity: 'error', rule: 'Allure Decorators', suggestion: 'Добавьте @allure.title("Название теста")' },
    { id: '2', line: 15, column: 5, message: 'Отсутствует with allure.step для шага теста', severity: 'error', rule: 'Steps Definition', suggestion: 'Оберните код в with allure.step("Описание шага")' },
    { id: '3', line: 20, column: 9, message: 'Отсутствует проверка (assert)', severity: 'error', rule: 'Assertions', suggestion: 'Добавьте assert statement для проверки результата' },
    { id: '4', line: 1, column: 1, message: 'Отсутствует метка приоритета', severity: 'warning', rule: 'Priority Labels', suggestion: 'Добавьте @allure.tag("CRITICAL|NORMAL|LOW")' },
    { id: '5', line: 3, column: 1, message: 'Отсутствует метка владельца', severity: 'info', rule: 'Owner Label', suggestion: 'Добавьте @allure.label("owner", "ваше_имя")' },
  ];

  const tabs = [
    { id: 'upload', label: 'Загрузить файл', icon: <FiUpload /> },
    { id: 'code', label: 'Вставить код', icon: <FiCode /> },
    { id: 'gitlab', label: 'GitLab URL', icon: <FiFileText /> },
  ];

  const exampleCode = `import allure
import pytest

class TestCalculatorUI:
    def test_add_service_button(self):
        # Отсутствует with allure.step
        page.goto("https://cloud.ru/calculator")
        
        # Отсутствует проверка
        button = page.locator("button:has-text('Добавить сервис')")
        
        # Отсутствует assert
        button.click()`;

  const validCode = `import allure
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
            assert button.is_enabled(), "Кнопка не активна"
        
        with allure.step("Кликнуть по кнопке"):
            button.click()
            assert True`;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type === 'text/x-python' || file.name.endsWith('.py')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCode(e.target?.result as string);
        };
        reader.readAsText(file);
      }
    }
  };

  const handleValidate = () => {
    setIsLoading(true);
    
    // Имитация API-запроса
    setTimeout(() => {
      setValidationResults(mockValidationResults);
      setShowResults(true);
      setIsLoading(false);
      
      const errorCount = mockValidationResults.filter(r => r.severity === 'error').length;
      const warningCount = mockValidationResults.filter(r => r.severity === 'warning').length;
      
      dispatch(addNotification({
        type: errorCount > 0 ? 'warning' : 'success',
        message: `Проверка завершена. Найдено: ${errorCount} ошибок, ${warningCount} предупреждений`,
      }));
    }, 1500);
  };

  const handleFixAll = () => {
    setCode(validCode);
    setValidationResults([]);
    dispatch(addNotification({
      type: 'success',
      message: 'Все ошибки исправлены автоматически',
    }));
  };

  const handleDownloadReport = () => {
    // TODO: Реализовать скачивание отчета
    dispatch(addNotification({
      type: 'info',
      message: 'Отчет будет скачан в формате PDF',
    }));
  };

  const handleApplySuggestion = (_suggestion: string) => {
    // TODO: Реализовать применение исправления
    dispatch(addNotification({
      type: 'info',
      message: 'Исправление применено',
    }));
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <FiXCircle className={styles.severityIconError} />;
      case 'warning': return <FiAlertCircle className={styles.severityIconWarning} />;
      case 'info': return <FiAlertCircle className={styles.severityIconInfo} />;
      default: return <FiCheckCircle className={styles.severityIconSuccess} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'var(--color-error)';
      case 'warning': return 'var(--color-warning)';
      case 'info': return 'var(--color-info)';
      default: return 'var(--color-secondary)';
    }
  };

  const errorCount = validationResults.filter(r => r.severity === 'error').length;
  const warningCount = validationResults.filter(r => r.severity === 'warning').length;
  const infoCount = validationResults.filter(r => r.severity === 'info').length;

  return (
    <div className={styles.standardsChecker}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Проверка стандартов</h1>
          <p className={styles.subtitle}>
            Валидация тест-кейсов на соответствие стандартам Allure TestOps и паттерну AAA
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <Button
            variant="outline"
            leftIcon={<FiDownload />}
            onClick={handleDownloadReport}
          >
            Экспорт отчета
          </Button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <Card variant="elevated" className={styles.inputCard}>
            <div className={styles.inputHeader}>
              <h2 className={styles.inputTitle}>Проверяемый код</h2>
              <Tabs
                items={tabs}
                value={activeTab}
                onChange={(tabId) => setActiveTab(tabId as any)}
                variant="pills"
              />
            </div>

            <div className={styles.inputContent}>
              {activeTab === 'upload' && (
                <div className={styles.uploadSection}>
                  <div className={styles.uploadArea}>
                    <input
                      type="file"
                      accept=".py,.txt"
                      onChange={handleFileUpload}
                      className={styles.fileInput}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className={styles.uploadLabel}>
                      <FiUpload className={styles.uploadIcon} />
                      <div className={styles.uploadText}>
                        {selectedFile ? (
                          <>
                            <div className={styles.fileName}>{selectedFile.name}</div>
                            <div className={styles.fileSize}>
                              {(selectedFile.size / 1024).toFixed(1)} KB
                            </div>
                          </>
                        ) : (
                          <>
                            <div>Перетащите файл или нажмите для загрузки</div>
                            <div className={styles.uploadHint}>
                              Поддерживаются .py файлы до 10MB
                            </div>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                  
                  {selectedFile && (
                    <div className={styles.filePreview}>
                      <h4>Предпросмотр:</h4>
                      <CodeEditor
                        value={code || exampleCode}
                        language="python"
                        readOnly
                        height="200px"
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'code' && (
                <div className={styles.codeSection}>
                  <CodeEditor
                    value={code || exampleCode}
                    onChange={setCode}
                    language="python"
                    height="400px"
                    placeholder="Вставьте код Python тест-кейса здесь..."
                  />
                </div>
              )}

              {activeTab === 'gitlab' && (
                <div className={styles.gitlabSection}>
                  <Input
                    value={gitlabUrl}
                    onChange={(e) => setGitlabUrl(e.target.value)}
                    placeholder="https://gitlab.cloud.ru/project/path/to/test.py"
                    label="URL файла в GitLab"
                    helperText="Укажите прямой URL до .py файла в GitLab"
                  />
                  <div className={styles.gitlabActions}>
                    <Button
                      variant="outline"
                      onClick={() => setGitlabUrl('https://gitlab.cloud.ru/testops/test-cases/blob/main/test_calculator.py')}
                    >
                      Пример
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        dispatch(addNotification({
                          type: 'info',
                          message: 'Загрузка из GitLab в разработке',
                        }));
                      }}
                    >
                      Загрузить
                    </Button>
                  </div>
                </div>
              )}

              <div className={styles.validationActions}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleValidate}
                  loading={isLoading}
                  disabled={!code && !selectedFile && !gitlabUrl}
                  fullWidth
                >
                  Проверить стандарты
                </Button>
                
                {validationResults.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleFixAll}
                    fullWidth
                  >
                    Исправить все автоматически
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card variant="elevated" className={styles.rulesCard}>
            <h3 className={styles.rulesTitle}>Проверяемые стандарты</h3>
            <div className={styles.rulesList}>
              {validationRules.map((rule) => (
                <div key={rule.id} className={styles.ruleItem}>
                  <div className={styles.ruleHeader}>
                    {getSeverityIcon(rule.severity)}
                    <span className={styles.ruleName}>{rule.name}</span>
                    <span className={`${styles.ruleSeverity} ${styles[`severity-${rule.severity}`]}`}>
                      {rule.severity === 'error' ? 'Ошибка' : 
                       rule.severity === 'warning' ? 'Предупреждение' : 'Рекомендация'}
                    </span>
                  </div>
                  <p className={styles.ruleDescription}>{rule.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className={styles.rightPanel}>
          {showResults ? (
            <Card variant="elevated" className={styles.resultsCard}>
              <div className={styles.resultsHeader}>
                <h2 className={styles.resultsTitle}>Результаты проверки</h2>
                <div className={styles.resultsStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Ошибки:</span>
                    <span className={styles.statValueError}>{errorCount}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Предупреждения:</span>
                    <span className={styles.statValueWarning}>{warningCount}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Рекомендации:</span>
                    <span className={styles.statValueInfo}>{infoCount}</span>
                  </div>
                </div>
              </div>

              {validationResults.length > 0 ? (
                <div className={styles.issuesList}>
                  {validationResults.map((issue) => (
                    <div key={issue.id} className={styles.issueItem}>
                      <div className={styles.issueHeader}>
                        <div className={styles.issueMeta}>
                          {getSeverityIcon(issue.severity)}
                          <span 
                            className={styles.issueMessage}
                            style={{ color: getSeverityColor(issue.severity) }}
                          >
                            {issue.message}
                          </span>
                        </div>
                        <span className={styles.issueLocation}>
                          Строка {issue.line}, колонка {issue.column}
                        </span>
                      </div>
                      
                      <div className={styles.issueDetails}>
                        <div className={styles.issueRule}>
                          <strong>Правило:</strong> {issue.rule}
                        </div>
                        <div className={styles.issueSuggestion}>
                          <strong>Рекомендация:</strong> {issue.suggestion}
                        </div>
                      </div>
                      
                      <div className={styles.issueActions}>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleApplySuggestion(issue.suggestion)}
                        >
                          Применить исправление
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => {
                            // TODO: Реализовать игнорирование
                            dispatch(addNotification({
                              type: 'info',
                              message: 'Ошибка проигнорирована',
                            }));
                          }}
                        >
                          Игнорировать
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noIssues}>
                  <FiCheckCircle className={styles.successIcon} />
                  <h3 className={styles.noIssuesTitle}>Все стандарты соблюдены!</h3>
                  <p className={styles.noIssuesText}>
                    Тест-кейс соответствует всем требованиям Allure TestOps и паттерну AAA.
                  </p>
                </div>
              )}

              <div className={styles.resultsSummary}>
                <h4 className={styles.summaryTitle}>Сводка по стандартам</h4>
                <div className={styles.standardsGrid}>
                  {validationRules.map((rule) => {
                    const ruleIssues = validationResults.filter(r => r.rule === rule.name);
                    const passed = ruleIssues.length === 0;
                    
                    return (
                      <div key={rule.id} className={styles.standardItem}>
                        <div className={styles.standardStatus}>
                          {passed ? (
                            <FiCheckCircle className={styles.statusIconPassed} />
                          ) : (
                            <FiXCircle className={styles.statusIconFailed} />
                          )}
                        </div>
                        <div className={styles.standardInfo}>
                          <div className={styles.standardName}>{rule.name}</div>
                          <div className={styles.standardDescription}>{rule.description}</div>
                        </div>
                        <div className={styles.standardResult}>
                          {passed ? (
                            <span className={styles.resultPassed}>Соблюден</span>
                          ) : (
                            <span className={styles.resultFailed}>
                              {ruleIssues.length} нарушений
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          ) : (
            <Card variant="elevated" className={styles.placeholderCard}>
              <div className={styles.placeholderContent}>
                <FiFileText className={styles.placeholderIcon} />
                <h3 className={styles.placeholderTitle}>Результаты проверки</h3>
                <p className={styles.placeholderText}>
                  Загрузите тест-кейс и нажмите "Проверить стандарты" для получения отчета
                </p>
                <div className={styles.exampleToggle}>
                  <Button
                    variant="outline"
                    onClick={() => setCode(exampleCode)}
                  >
                    Загрузить пример с ошибками
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCode(validCode)}
                  >
                    Загрузить корректный пример
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Modal
        isOpen={isLoading}
        onClose={() => {}}
        showCloseButton={false}
        closeOnBackdropClick={false}
        closeOnEsc={false}
      >
        <div className={styles.loadingModal}>
          <Loader size="large" variant="dots" text="Проверка стандартов..." showText />
          <p className={styles.loadingText}>
            Анализ кода, проверка паттерна AAA и декораторов Allure...
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default StandardsChecker;