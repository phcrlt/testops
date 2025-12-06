import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '@store/store';
import { logout } from '@store/slices/authSlice';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    const baseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    this.baseURL = baseUrl;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = store.getState().auth.token;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Добавляем заголовки для Cloud.ru API
        if (config.url?.includes('cloud.ru')) {
          config.headers['X-Cloudru-Client'] = 'testops-copilot';
          config.headers['X-API-Version'] = 'v1';
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;

        if (response?.status === 401) {
          // Токен истек или невалиден
          store.dispatch(logout());
          window.location.href = '/login';
        }

        if (response?.status === 403) {
          // Нет доступа
          console.error('Access denied:', response.data);
        }

        if (response?.status === 429) {
          // Слишком много запросов
          console.error('Rate limit exceeded:', response.data);
        }

        return Promise.reject(error);
      }
    );
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client(config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw {
        code: 'NETWORK_ERROR',
        message: 'Network error occurred. Please check your connection.',
      } as ApiError;
    }
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Специальные методы для работы с файлами
  async uploadFile(url: string, file: File, fieldName = 'file'): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append(fieldName, file);

    return this.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Метод для стриминга (если нужно)
  async stream(url: string, config?: AxiosRequestConfig) {
    return this.client.get(url, {
      ...config,
      responseType: 'stream',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;