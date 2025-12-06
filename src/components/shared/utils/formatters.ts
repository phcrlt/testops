/**
 * Утилиты для форматирования данных
 */

// Форматирование даты
export const formatDate = (date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string => {
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  // Относительное время
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return 'только что';
  if (diffMin < 60) return `${diffMin} мин. назад`;
  if (diffHour < 24) return `${diffHour} ч. назад`;
  if (diffDay === 1) return 'вчера';
  if (diffDay < 7) return `${diffDay} дн. назад`;
  
  return formatDate(d, 'short');
};

// Форматирование числа
export const formatNumber = (num: number, decimals = 0): string => {
  return num.toLocaleString('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Форматирование процентов
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Форматирование размера файла
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Форматирование кода Python (подсветка Allure)
export const formatPythonCode = (code: string): string => {
  // Добавляем импорт Allure если его нет
  if (!code.includes('import allure') && code.includes('@allure')) {
    code = 'import allure\n' + code;
  }
  
  // Добавляем импорт pytest если его нет и есть @pytest
  if (!code.includes('import pytest') && code.includes('@pytest')) {
    code = 'import pytest\n' + code;
  }
  
  return code;
};

// Форматирование имени тест-кейса
export const formatTestCaseName = (name: string): string => {
  // Убираем лишние пробелы, добавляем префикс если нужно
  const cleanName = name.trim().replace(/\s+/g, ' ');
  
  if (!cleanName.toLowerCase().startsWith('test_')) {
    return `test_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  }
  
  return cleanName;
};

// Форматирование приоритета для Allure
export const formatPriority = (priority: 'critical' | 'normal' | 'low'): string => {
  switch (priority) {
    case 'critical': return 'CRITICAL';
    case 'normal': return 'NORMAL';
    case 'low': return 'LOW';
    default: return 'NORMAL';
  }
};

// Форматирование времени выполнения
export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}мс`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}сек`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}мин`;
  return `${(ms / 3600000).toFixed(1)}ч`;
};

// Транслитерация кириллицы для Python имен
export const transliterate = (text: string): string => {
  const cyrillic = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
    'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
    'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
    'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
    'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch',
    'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '', 'Ы': 'Y', 'Ь': '',
    'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  };
  
  return text.split('').map(char => cyrillic[char as keyof typeof cyrillic] || char).join('');
};

// Создание уникального ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Форматирование JSON для отображения
export const formatJson = (obj: any, indent = 2): string => {
  return JSON.stringify(obj, null, indent);
};

// Обрезание длинного текста
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};