/**
 * Валидаторы для форм и данных
 */

// Валидация email
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Валидация пароля
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Пароль должен содержать минимум 8 символов');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну заглавную букву');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну строчную букву');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну цифру');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// Валидация кода Python
export const validatePythonCode = (code: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!code.trim()) {
    errors.push('Код не может быть пустым');
    return { valid: false, errors };
  }
  
  // Проверка на наличие импорта Allure если есть декораторы
  if (code.includes('@allure') && !code.includes('import allure')) {
    errors.push('Добавьте "import allure" для использования декораторов Allure');
  }
  
  // Проверка на наличие класса теста
  if (!code.includes('class Test') && !code.includes('def test_')) {
    errors.push('Код должен содержать тестовый класс или функцию');
  }
  
  // Проверка на наличие assert
  if (!code.includes('assert') && !code.includes('AssertionError')) {
    errors.push('Тест должен содержать проверки (assert)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// Валидация требований для генерации тестов
export const validateRequirements = (requirements: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const lines = requirements.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    errors.push('Требования не могут быть пустыми');
  }
  
  if (lines.length < 3) {
    errors.push('Укажите хотя бы 3 требования для качественной генерации');
  }
  
  // Проверка на слишком короткие требования
  const shortLines = lines.filter(line => line.trim().length < 10);
  if (shortLines.length > 0) {
    errors.push('Требования должны быть более подробными (минимум 10 символов)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// Валидация URL
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Валидация OpenAPI спецификации
export const validateOpenApiSpec = (spec: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!spec) {
    errors.push('Спецификация не может быть пустой');
    return { valid: false, errors };
  }
  
  if (!spec.openapi || !spec.openapi.startsWith('3.')) {
    errors.push('Требуется OpenAPI спецификация версии 3.x');
  }
  
  if (!spec.info || !spec.info.title) {
    errors.push('Отсутствует информация о API (info.title)');
  }
  
  if (!spec.paths || Object.keys(spec.paths).length === 0) {
    errors.push('Нет определенных эндпойнтов (paths)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// Валидация GitLab URL
export const validateGitLabUrl = (url: string): boolean => {
  return validateUrl(url) && (
    url.includes('gitlab') || 
    url.includes('gitlab.') ||
    url.includes('/gitlab/')
  );
};

// Валидация токена API
export const validateApiToken = (token: string): boolean => {
  return token.length >= 20 && token.includes('_');
};

// Валидация имени тест-кейса
export const validateTestCaseName = (name: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!name.trim()) {
    errors.push('Название тест-кейса не может быть пустым');
  }
  
  if (name.length > 100) {
    errors.push('Название должно быть не длиннее 100 символов');
  }
  
  if (!/^[a-zA-Z0-9_\- ]+$/.test(name)) {
    errors.push('Используйте только буквы, цифры, пробелы, дефисы и подчеркивания');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// Валидация приоритета
export const validatePriority = (priority: string): boolean => {
  return ['critical', 'normal', 'low'].includes(priority);
};

// Валидация продукта
export const validateProduct = (product: string): boolean => {
  return ['calculator', 'evolution-compute', 'evolution-storage', 'evolution-network'].includes(product);
};

// Валидация файла
export const validateFile = (file: File, allowedTypes: string[], maxSizeMB: number): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const maxSize = maxSizeMB * 1024 * 1024;
  
  if (!allowedTypes.includes(file.type) && !allowedTypes.some(type => file.name.endsWith(type))) {
    errors.push(`Неподдерживаемый формат файла. Разрешены: ${allowedTypes.join(', ')}`);
  }
  
  if (file.size > maxSize) {
    errors.push(`Файл слишком большой. Максимальный размер: ${maxSizeMB}MB`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// Валидация номера версии
export const validateVersion = (version: string): boolean => {
  return /^\d+\.\d+\.\d+$/.test(version);
};