/**
 * Константы приложения
 */

// Цвета для статусов
export const STATUS_COLORS = {
  SUCCESS: '#34a853',
  ERROR: '#ea4335',
  WARNING: '#fbbc04',
  INFO: '#4285f4',
  DISABLED: '#9aa0a6',
};

// Приоритеты тестов
export const PRIORITIES = {
  CRITICAL: {
    value: 'critical',
    label: 'Критический',
    color: STATUS_COLORS.ERROR,
    order: 0,
  },
  NORMAL: {
    value: 'normal',
    label: 'Обычный',
    color: STATUS_COLORS.WARNING,
    order: 1,
  },
  LOW: {
    value: 'low',
    label: 'Низкий',
    color: STATUS_COLORS.SUCCESS,
    order: 2,
  },
} as const;

// Статусы тест-кейсов
export const TEST_CASE_STATUSES = {
  DRAFT: {
    value: 'draft',
    label: 'Черновик',
    color: STATUS_COLORS.WARNING,
  },
  READY: {
    value: 'ready',
    label: 'Готов',
    color: STATUS_COLORS.INFO,
  },
  PUBLISHED: {
    value: 'published',
    label: 'Опубликован',
    color: STATUS_COLORS.SUCCESS,
  },
  ARCHIVED: {
    value: 'archived',
    label: 'Архивирован',
    color: STATUS_COLORS.DISABLED,
  },
} as const;

// Типы тестов
export const TEST_TYPES = {
  UI: {
    value: 'ui',
    label: 'UI Тестирование',
    icon: '🖥️',
    framework: 'Playwright',
  },
  API: {
    value: 'api',
    label: 'API Тестирование',
    icon: '🔌',
    framework: 'pytest + requests',
  },
  UNIT: {
    value: 'unit',
    label: 'Unit Тестирование',
    icon: '🧪',
    framework: 'pytest',
  },
  INTEGRATION: {
    value: 'integration',
    label: 'Интеграционное тестирование',
    icon: '🔄',
    framework: 'pytest',
  },
} as const;

// Продукты для тестирования
export const PRODUCTS = {
  CALCULATOR: {
    value: 'calculator',
    label: 'Калькулятор цен Cloud.ru',
    description: 'UI тестирование калькулятора стоимости облачных услуг',
    endpoints: ['UI', 'API калькулятора'],
  },
  EVOLUTION_COMPUTE: {
    value: 'evolution-compute',
    label: 'Evolution Compute',
    description: 'API тестирование виртуальных машин, дисков, конфигураций',
    endpoints: ['VMs', 'Disks', 'Flavors'],
  },
  EVOLUTION_STORAGE: {
    value: 'evolution-storage',
    label: 'Evolution Storage',
    description: 'API тестирование объектного и блочного хранилища',
    endpoints: ['Buckets', 'Volumes', 'Snapshots'],
  },
  EVOLUTION_NETWORK: {
    value: 'evolution-network',
    label: 'Evolution Network',
    description: 'API тестирование сетей и балансировщиков',
    endpoints: ['Networks', 'Load Balancers', 'Firewalls'],
  },
} as const;

// Интеграции
export const INTEGRATIONS = {
  GITLAB: {
    id: 'gitlab',
    name: 'GitLab',
    description: 'Интеграция с GitLab для CI/CD',
    icon: 'gitlab',
    docsUrl: 'https://docs.gitlab.com/',
  },
  CLOUDRU_API: {
    id: 'cloudru-api',
    name: 'Cloud.ru Evolution API',
    description: 'Доступ к AI моделям Cloud.ru',
    icon: 'cloud',
    docsUrl: 'https://cloud.ru/docs/api',
  },
  ALLURE_TESTOPS: {
    id: 'allure-testops',
    name: 'Allure TestOps',
    description: 'Экспорт тест-кейсов и отчетов',
    icon: 'allure',
    docsUrl: 'https://docs.qameta.io/allure/',
  },
  JIRA: {
    id: 'jira',
    name: 'Jira',
    description: 'Синхронизация с задачами Jira',
    icon: 'jira',
    docsUrl: 'https://developer.atlassian.com/cloud/jira/',
  },
  SLACK: {
    id: 'slack',
    name: 'Slack',
    description: 'Уведомления о результатах тестирования',
    icon: 'slack',
    docsUrl: 'https://api.slack.com/',
  },
} as const;

// Лимиты и ограничения
export const LIMITS = {
  MAX_FILE_SIZE_MB: 10,
  MAX_TEST_CASES_PER_GENERATION: 50,
  MAX_REQUIREMENT_LENGTH: 10000,
  MAX_CODE_LENGTH: 100000,
  MAX_SEARCH_RESULTS: 100,
  API_TIMEOUT_MS: 30000,
  GENERATION_TIMEOUT_MS: 60000,
} as const;

// Коды ошибок API
export const ERROR_CODES = {
  // Общие ошибки
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT',
  
  // Ошибки генерации
  GENERATION_FAILED: 'GENERATION_FAILED',
  MODEL_UNAVAILABLE: 'MODEL_UNAVAILABLE',
  INVALID_SPEC: 'INVALID_SPEC',
  
  // Ошибки интеграций
  INTEGRATION_ERROR: 'INTEGRATION_ERROR',
  GITLAB_ERROR: 'GITLAB_ERROR',
  CLOUDRU_API_ERROR: 'CLOUDRU_API_ERROR',
  
  // Ошибки файлов
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
} as const;

// Сообщения об ошибках
export const ERROR_MESSAGES = {
  [ERROR_CODES.VALIDATION_ERROR]: 'Ошибка валидации данных',
  [ERROR_CODES.AUTH_ERROR]: 'Ошибка аутентификации',
  [ERROR_CODES.PERMISSION_ERROR]: 'Недостаточно прав',
  [ERROR_CODES.NOT_FOUND]: 'Ресурс не найден',
  [ERROR_CODES.RATE_LIMIT]: 'Превышен лимит запросов',
  [ERROR_CODES.GENERATION_FAILED]: 'Ошибка генерации тестов',
  [ERROR_CODES.MODEL_UNAVAILABLE]: 'Модель AI временно недоступна',
  [ERROR_CODES.INVALID_SPEC]: 'Некорректная спецификация',
  [ERROR_CODES.INTEGRATION_ERROR]: 'Ошибка интеграции',
  [ERROR_CODES.GITLAB_ERROR]: 'Ошибка подключения к GitLab',
  [ERROR_CODES.CLOUDRU_API_ERROR]: 'Ошибка Cloud.ru API',
  [ERROR_CODES.FILE_TOO_LARGE]: 'Файл слишком большой',
  [ERROR_CODES.INVALID_FILE_TYPE]: 'Неподдерживаемый формат файла',
  [ERROR_CODES.UPLOAD_FAILED]: 'Ошибка загрузки файла',
  
  DEFAULT: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
} as const;

// Пути для роутинга
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  GENERATOR: '/generator',
  GENERATOR_UI: '/generator/ui',
  GENERATOR_API: '/generator/api',
  COVERAGE: '/coverage',
  STANDARDS: '/standards',
  TEST_PLANS: '/testplans',
  INTEGRATIONS: '/integrations',
  DOCUMENTATION: '/documentation',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  LOGIN: '/login',
} as const;

// Ключи для localStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'testops_token',
  THEME: 'testops_theme',
  USER_PREFERENCES: 'testops_preferences',
  RECENT_PROJECTS: 'testops_recent_projects',
  CODE_TEMPLATES: 'testops_code_templates',
} as const;

// Версия приложения
export const APP_VERSION = '1.0.0-alpha';

// URL документации
export const DOCS_URLS = {
  MAIN: 'https://docs.testops-copilot.cloud.ru',
  API: 'https://api.testops-copilot.cloud.ru/docs',
  EXAMPLES: 'https://github.com/cloud-ru/testops-copilot-examples',
  SUPPORT: 'https://support.cloud.ru/testops',
} as const;

// Конфигурация по умолчанию
export const DEFAULT_CONFIG = {
  THEME: 'light',
  LANGUAGE: 'ru',
  TIMEZONE: 'Europe/Moscow',
  ITEMS_PER_PAGE: 20,
  AUTO_SAVE: true,
  NOTIFICATIONS: true,
  ANALYTICS: true,
} as const;