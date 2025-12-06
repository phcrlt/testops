export const API_ENDPOINTS = {
  // Аутентификация
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // Генерация тестов
  TESTS: {
    GENERATE: '/tests/generate',
    GENERATE_UI: '/tests/generate/ui',
    GENERATE_API: '/tests/generate/api',
    VALIDATE: '/tests/validate',
    OPTIMIZE: '/tests/optimize',
    BATCH_GENERATE: '/tests/generate/batch',
  },

  // Тест-кейсы
  TEST_CASES: {
    BASE: '/test-cases',
    LIST: '/test-cases',
    DETAIL: (id: string) => `/test-cases/${id}`,
    UPDATE: (id: string) => `/test-cases/${id}`,
    DELETE: (id: string) => `/test-cases/${id}`,
    EXPORT: (id: string) => `/test-cases/${id}/export`,
    IMPORT: '/test-cases/import',
    SEARCH: '/test-cases/search',
  },

  // Анализ покрытия
  COVERAGE: {
    ANALYZE: '/coverage/analyze',
    STATS: '/coverage/stats',
    GAPS: '/coverage/gaps',
    DUPLICATES: '/coverage/duplicates',
    RECOMMENDATIONS: '/coverage/recommendations',
    EXPORT_REPORT: '/coverage/export',
  },

  // Проверка стандартов
  STANDARDS: {
    VALIDATE: '/standards/validate',
    RULES: '/standards/rules',
    FIX: '/standards/fix',
    REPORT: '/standards/report',
  },

  // Тест-планы
  TEST_PLANS: {
    BASE: '/test-plans',
    LIST: '/test-plans',
    DETAIL: (id: string) => `/test-plans/${id}`,
    CREATE: '/test-plans',
    UPDATE: (id: string) => `/test-plans/${id}`,
    DELETE: (id: string) => `/test-plans/${id}`,
    RUN: (id: string) => `/test-plans/${id}/run`,
    EXPORT: (id: string) => `/test-plans/${id}/export`,
  },

  // Интеграции
  INTEGRATIONS: {
    GITLAB: {
      BASE: '/integrations/gitlab',
      CONNECT: '/integrations/gitlab/connect',
      DISCONNECT: '/integrations/gitlab/disconnect',
      SYNC: '/integrations/gitlab/sync',
      PROJECTS: '/integrations/gitlab/projects',
      COMMIT: '/integrations/gitlab/commit',
      WEBHOOK: '/integrations/gitlab/webhook',
    },
    CLOUDRU: {
      BASE: '/integrations/cloudru',
      MODELS: '/integrations/cloudru/models',
      STATUS: '/integrations/cloudru/status',
      QUOTA: '/integrations/cloudru/quota',
    },
    ALLURE: {
      BASE: '/integrations/allure',
      CONNECT: '/integrations/allure/connect',
      EXPORT: '/integrations/allure/export',
    },
  },

  // Документация и справка
  DOCS: {
    OPENAPI: '/docs/openapi.json',
    EXAMPLES: '/docs/examples',
    TEMPLATES: '/docs/templates',
    TUTORIALS: '/docs/tutorials',
  },

  // Системные endpoints
  SYSTEM: {
    HEALTH: '/health',
    METRICS: '/metrics',
    CONFIG: '/config',
    LOGS: '/logs',
  },
};

// Cloud.ru Evolution Model API endpoints
export const CLOUDRU_ENDPOINTS = {
  MODELS: {
    FOUNDATION: 'https://api.cloud.ru/evolution/v1/models/foundation',
    COMPUTE: 'https://compute.api.cloud.ru/v3',
    PRICE_CALCULATOR: 'https://calculator.api.cloud.ru/v1',
  },
  GENERATE: {
    COMPLETION: 'https://api.cloud.ru/evolution/v1/completions',
    CHAT: 'https://api.cloud.ru/evolution/v1/chat/completions',
    EMBEDDING: 'https://api.cloud.ru/evolution/v1/embeddings',
  },
};

// GitLab API endpoints (примерные)
export const GITLAB_ENDPOINTS = {
  PROJECTS: (baseUrl: string) => `${baseUrl}/api/v4/projects`,
  FILES: (baseUrl: string, projectId: string, filePath: string) => 
    `${baseUrl}/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`,
  COMMITS: (baseUrl: string, projectId: string) => 
    `${baseUrl}/api/v4/projects/${projectId}/repository/commits`,
  BRANCHES: (baseUrl: string, projectId: string) => 
    `${baseUrl}/api/v4/projects/${projectId}/repository/branches`,
};