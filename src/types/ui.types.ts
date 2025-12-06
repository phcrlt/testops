export type Theme = 'light' | 'dark';
export type Priority = 'critical' | 'normal' | 'low';
export type TestType = 'ui' | 'api';
export type Product = 'calculator' | 'evolution-compute';
export type Status = 'generated' | 'saved' | 'published';

export interface MenuItem {
  id: string;
  label: string;
  icon: string | JSX.Element; // Разрешаем оба типа
  path: string;
  exact?: boolean; // Добавляем exact
  children?: MenuItem[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'qa' | 'viewer';
  avatar?: string;
}