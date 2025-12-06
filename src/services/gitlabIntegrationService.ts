export interface GitLabProject {
  id: number;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  web_url: string;
  last_activity_at: string;
}

export interface GitLabFile {
  file_path: string;
  content: string;
  encoding: 'base64' | 'text';
}

export interface GitLabCommit {
  id: string;
  title: string;
  message: string;
  author_name: string;
  author_email: string;
  created_at: string;
}

export interface GitLabBranch {
  name: string;
  merged: boolean;
  protected: boolean;
  default: boolean;
}

export interface GitLabConfig {
  url: string;
  token: string;
  projectId: string;
  branch?: string;
  commitMessage?: string;
  authorName?: string;
  authorEmail?: string;
}

class GitLabIntegrationService {
  private config: GitLabConfig | null = null;

  /**
   * Настройка интеграции с GitLab
   */
  configure(config: GitLabConfig): void {
    this.config = {
      ...config,
      branch: config.branch || 'main',
      commitMessage: config.commitMessage || 'Auto-generated tests from TestOps Copilot',
      authorName: config.authorName || 'TestOps Copilot',
      authorEmail: config.authorEmail || 'testops@cloud.ru',
    };
  }

  /**
   * Проверка подключения к GitLab
   */
  async testConnection(): Promise<boolean> {
    if (!this.config) {
      throw new Error('GitLab not configured');
    }

    try {
      const response = await this.makeGitLabRequest('/user');
      return response.status === 200;
    } catch (error) {
      console.error('GitLab connection test failed:', error);
      return false;
    }
  }

  /**
   * Получение списка проектов
   */
  async getProjects(search?: string): Promise<GitLabProject[]> {
    if (!this.config) {
      throw new Error('GitLab not configured');
    }

    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('per_page', '100');

      const response = await this.makeGitLabRequest('/projects', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching GitLab projects:', error);
      throw new Error('Failed to fetch projects from GitLab');
    }
  }

  /**
   * Получение файла из репозитория
   */
  async getFile(filePath: string): Promise<GitLabFile> {
    if (!this.config) {
      throw new Error('GitLab not configured');
    }

    try {
      const encodedPath = encodeURIComponent(filePath);
      const response = await this.makeGitLabRequest(
        `/projects/${this.config.projectId}/repository/files/${encodedPath}`,
        {
          params: { ref: this.config.branch },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching file from GitLab:', error);
      throw new Error(`Failed to fetch file: ${filePath}`);
    }
  }

  /**
   * Сохранение файла в репозиторий
   */
  async saveFile(filePath: string, content: string, commitMessage?: string): Promise<GitLabCommit> {
    if (!this.config) {
      throw new Error('GitLab not configured');
    }

    try {
      const encodedPath = encodeURIComponent(filePath);
      const response = await this.makeGitLabRequest(
        `/projects/${this.config.projectId}/repository/files/${encodedPath}`,
        {
          method: 'PUT',
          data: {
            branch: this.config.branch,
            content: Buffer.from(content).toString('base64'),
            encoding: 'base64',
            commit_message: commitMessage || this.config.commitMessage,
            author_name: this.config.authorName,
            author_email: this.config.authorEmail,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error saving file to GitLab:', error);
      throw new Error(`Failed to save file: ${filePath}`);
    }
  }

  /**
   * Создание нового файла в репозитории
   */
  async createFile(filePath: string, content: string, commitMessage?: string): Promise<GitLabCommit> {
    if (!this.config) {
      throw new Error('GitLab not configured');
    }

    try {
      const encodedPath = encodeURIComponent(filePath);
      const response = await this.makeGitLabRequest(
        `/projects/${this.config.projectId}/repository/files/${encodedPath}`,
        {
          method: 'POST',
          data: {
            branch: this.config.branch,
            content: Buffer.from(content).toString('base64'),
            encoding: 'base64',
            commit_message: commitMessage || this.config.commitMessage,
            author_name: this.config.authorName,
            author_email: this.config.authorEmail,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating file in GitLab:', error);
      throw new Error(`Failed to create file: ${filePath}`);
    }
  }

  /**
   * Получение списка коммитов
   */
  async getCommits(limit = 20): Promise<GitLabCommit[]> {
    if (!this.config) {
      throw new Error('GitLab not configured');
    }

    try {
      const response = await this.makeGitLabRequest(
        `/projects/${this.config.projectId}/repository/commits`,
        {
          params: {
            ref_name: this.config.branch,
            per_page: limit.toString(),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching commits from GitLab:', error);
      return [];
    }
  }

  /**
   * Получение списка веток
   */
  async getBranches(): Promise<GitLabBranch[]> {
    if (!this.config) {
      throw new Error('GitLab not configured');
    }

    try {
      const response = await this.makeGitLabRequest(
        `/projects/${this.config.projectId}/repository/branches`
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching branches from GitLab:', error);
      return [];
    }
  }

  /**
   * Создание merge request
   */
  async createMergeRequest(
    title: string,
    sourceBranch: string,
    targetBranch?: string,
    description?: string
  ): Promise<any> {
    if (!this.config) {
      throw new Error('GitLab not configured');
    }

    try {
      const response = await this.makeGitLabRequest(
        `/projects/${this.config.projectId}/merge_requests`,
        {
          method: 'POST',
          data: {
            source_branch: sourceBranch,
            target_branch: targetBranch || this.config.branch,
            title,
            description: description || 'Auto-generated tests from TestOps Copilot',
            remove_source_branch: true,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating merge request:', error);
      throw new Error('Failed to create merge request');
    }
  }

  /**
   * Создание тестового каталога и структуры файлов
   */
  async createTestStructure(
    basePath: string,
    testCases: Array<{ name: string; content: string; type: 'ui' | 'api' }>
  ): Promise<GitLabCommit[]> {
    if (!this.config) {
      throw new Error('GitLab not configured');
    }

    const commits: GitLabCommit[] = [];

    try {
      // Создание базовой структуры каталогов
      const directories = ['ui', 'api', 'fixtures', 'utils'];
      
      for (const dir of directories) {
        try {
          await this.createFile(
            `${basePath}/${dir}/.gitkeep`,
            '',
            `Create ${dir} directory for tests`
          );
        } catch (error) {
          // Игнорируем ошибки если директория уже существует
          console.log(`Directory ${dir} might already exist`);
        }
      }

      // Создание файлов тестов
      for (const testCase of testCases) {
        const dir = testCase.type === 'ui' ? 'ui' : 'api';
        const fileName = this.formatTestCaseFileName(testCase.name);
        const filePath = `${basePath}/${dir}/${fileName}`;

        const commit = await this.createFile(
          filePath,
          testCase.content,
          `Add ${testCase.type} test: ${testCase.name}`
        );

        commits.push(commit);
      }

      // Создание README файла
      const readmeContent = this.generateReadmeContent(testCases);
      const readmeCommit = await this.createFile(
        `${basePath}/README.md`,
        readmeContent,
        'Add README with test documentation'
      );

      commits.push(readmeCommit);

      // Создание .gitlab-ci.yml если его нет
      const ciCommit = await this.createCIConfig(basePath);
      if (ciCommit) {
        commits.push(ciCommit);
      }

      return commits;
    } catch (error) {
      console.error('Error creating test structure:', error);
      throw new Error('Failed to create test structure');
    }
  }

  /**
   * Синхронизация локальных тестов с GitLab
   */
  async syncTests(
    localTests: Array<{ path: string; content: string }>,
    commitMessage?: string
  ): Promise<GitLabCommit[]> {
    if (!this.config) {
      throw new Error('GitLab not configured');
    }

    const commits: GitLabCommit[] = [];

    try {
      for (const test of localTests) {
        try {
          // Пытаемся получить существующий файл
          await this.getFile(test.path);
          
          // Файл существует, обновляем его
          const commit = await this.saveFile(
            test.path,
            test.content,
            commitMessage || `Update test: ${test.path}`
          );
          commits.push(commit);
        } catch (error: any) {
          if (error.response?.status === 404) {
            // Файл не существует, создаем новый
            const commit = await this.createFile(
              test.path,
              test.content,
              commitMessage || `Add new test: ${test.path}`
            );
            commits.push(commit);
          } else {
            throw error;
          }
        }
      }

      return commits;
    } catch (error) {
      console.error('Error syncing tests with GitLab:', error);
      throw new Error('Failed to sync tests with GitLab');
    }
  }

  /**
   * Получение статистики репозитория
   */
  async getRepositoryStats(): Promise<{
    totalFiles: number;
    testFiles: number;
    lastCommit: string;
    contributors: number;
  }> {
    if (!this.config) {
      throw new Error('GitLab not configured');
    }

    try {
      // В реальном приложении здесь будут API вызовы для получения статистики
      // Это моковые данные для демонстрации
      return {
        totalFiles: 156,
        testFiles: 45,
        lastCommit: new Date().toISOString(),
        contributors: 8,
      };
    } catch (error) {
      console.error('Error getting repository stats:', error);
      return {
        totalFiles: 0,
        testFiles: 0,
        lastCommit: '',
        contributors: 0,
      };
    }
  }

  /**
   * Создание конфигурации CI/CD
   */
  private async createCIConfig(basePath: string): Promise<GitLabCommit | null> {
    try {
      // Проверяем, существует ли уже .gitlab-ci.yml
      await this.getFile('.gitlab-ci.yml');
      return null; // Файл уже существует
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Создаем новый файл CI/CD конфигурации
        const ciConfig = this.generateCIConfig(basePath);
        return await this.createFile(
          '.gitlab-ci.yml',
          ciConfig,
          'Add GitLab CI/CD configuration for automated testing'
        );
      }
      throw error;
    }
  }

  /**
   * Генерация конфигурации GitLab CI/CD
   */
  private generateCIConfig(basePath: string): string {
    return `# GitLab CI/CD Configuration for TestOps Copilot
# Auto-generated by TestOps Copilot

stages:
  - test
  - report
  - deploy

variables:
  PYTHON_VERSION: "3.10"
  ALLURE_VERSION: "2.24.0"

# Кэширование зависимостей
cache:
  key: \${CI_COMMIT_REF_SLUG}
  paths:
    - .cache/pip
    - allure-results

# Установка зависимостей
before_script:
  - python --version
  - pip install --upgrade pip
  - pip install -r requirements.txt
  - pip install pytest allure-pytest pytest-playwright requests

# UI тесты с Playwright
ui-tests:
  stage: test
  image: mcr.microsoft.com/playwright/python:v1.40.0
  script:
    - playwright install chromium
    - cd ${basePath}
    - pytest ui/ -v --alluredir=allure-results
  artifacts:
    when: always
    paths:
      - ${basePath}/allure-results/
    expire_in: 1 week
  only:
    - merge_requests
    - main
    - develop

# API тесты
api-tests:
  stage: test
  image: python:\${PYTHON_VERSION}-slim
  script:
    - cd ${basePath}
    - pytest api/ -v --alluredidr=allure-results
  artifacts:
    when: always
    paths:
      - ${basePath}/allure-results/
    expire_in: 1 week
  only:
    - merge_requests
    - main
    - develop

# Генерация Allure отчетов
generate-report:
  stage: report
  image: frankescobar/allure-docker-service
  script:
    - allure generate allure-results -o allure-report --clean
  artifacts:
    paths:
      - allure-report/
    expire_in: 1 month
  only:
    - main
    - develop

# Публикация отчета на GitLab Pages
pages:
  stage: deploy
  dependencies:
    - generate-report
  script:
    - mv allure-report public
  artifacts:
    paths:
      - public
  only:
    - main
`;
  }

  /**
   * Форматирование имени файла теста
   */
  private formatTestCaseFileName(testName: string): string {
    // Преобразуем имя теста в snake_case и добавляем расширение
    const snakeCase = testName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    
    if (!snakeCase.startsWith('test_')) {
      return `test_${snakeCase}.py`;
    }
    
    return `${snakeCase}.py`;
  }

  /**
   * Генерация содержимого README файла
   */
  private generateReadmeContent(testCases: Array<{ name: string; type: 'ui' | 'api' }>): string {
    const uiTests = testCases.filter(tc => tc.type === 'ui');
    const apiTests = testCases.filter(tc => tc.type === 'api');

    return `# Автоматические тесты

Сгенерировано с помощью TestOps Copilot от Cloud.ru

## Структура проекта

\`\`\`
tests/
├── ui/          # UI тесты (Playwright)
├── api/         # API тесты (pytest + requests)
├── fixtures/    # Тестовые данные
├── utils/       # Вспомогательные утилиты
└── README.md    # Эта документация
\`\`\`

## Статистика тестов

- Всего тестов: ${testCases.length}
- UI тестов: ${uiTests.length}
- API тестов: ${apiTests.length}

## Запуск тестов

### Локальный запуск

\`\`\`bash
# Установка зависимостей
pip install -r requirements.txt

# Запуск UI тестов
pytest ui/ -v

# Запуск API тестов
pytest api/ -v

# Запуск всех тестов с генерацией Allure отчета
pytest --alluredir=allure-results
\`\`\`

### CI/CD запуск

Тесты автоматически запускаются в GitLab CI/CD при:
- Push в ветки main/develop
- Создании merge request

## Генерация отчетов

Для генерации Allure отчетов:

\`\`\`bash
# Установка Allure
pip install allure-pytest

# Запуск тестов с генерацией отчетов
pytest --alluredir=allure-results

# Генерация HTML отчета
allure generate allure-results -o allure-report --clean

# Открытие отчета
allure open allure-report
\`\`\`

## Список тестов

### UI тесты
${uiTests.map(tc => `- ${tc.name}`).join('\n')}

### API тесты
${apiTests.map(tc => `- ${tc.name}`).join('\n')}

---

*Сгенерировано: ${new Date().toISOString().split('T')[0]}*
*Технологии: TestOps Copilot, Cloud.ru Evolution Model*`;
  }

  /**
   * Выполнение запроса к GitLab API
   */
  private async makeGitLabRequest(
    endpoint: string,
    options: any = {}
  ): Promise<any> {
    if (!this.config) {
      throw new Error('GitLab not configured');
    }

    // const _url = `${this.config.url}/api/v4${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Private-Token': this.config.token,
        'Content-Type': 'application/json',
      },
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      // В реальном приложении здесь будет прямой вызов GitLab API
      // Это моковая реализация для демонстрации
      
      // Имитация успешного ответа
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        status: 200,
        data: this.generateMockResponse(endpoint, mergedOptions),
      };
    } catch (error) {
      console.error('GitLab API request failed:', error);
      throw error;
    }
  }

  /**
   * Генерация мокового ответа GitLab API
   */
  private generateMockResponse(endpoint: string, _options: any): any {
    const mockData: Record<string, any> = {
      '/user': {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
      },
      '/projects': [
        {
          id: 12345,
          name: 'testops-tests',
          name_with_namespace: 'Cloud.ru / TestOps Tests',
          path: 'testops-tests',
          path_with_namespace: 'cloud-ru/testops-tests',
          web_url: 'https://gitlab.cloud.ru/cloud-ru/testops-tests',
          last_activity_at: new Date().toISOString(),
        },
      ],
      [`/projects/${this.config?.projectId}/repository/commits`]: [
        {
          id: 'abc123def456',
          title: 'Add UI tests',
          message: 'Add UI tests for calculator',
          author_name: 'TestOps Copilot',
          author_email: 'testops@cloud.ru',
          created_at: new Date().toISOString(),
        },
      ],
      [`/projects/${this.config?.projectId}/repository/branches`]: [
        {
          name: 'main',
          merged: false,
          protected: true,
          default: true,
        },
        {
          name: 'develop',
          merged: false,
          protected: false,
          default: false,
        },
      ],
    };

    return mockData[endpoint] || {};
  }
}

export const gitlabIntegrationService = new GitLabIntegrationService();