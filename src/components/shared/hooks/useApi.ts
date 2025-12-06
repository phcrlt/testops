import { useState, useCallback } from 'react';
import { apiClient, ApiResponse, ApiError } from '../ApiClient/api';
import { useDispatch } from 'react-redux';
import { addNotification } from '@store/slices/uiSlice';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  showErrorNotification?: boolean;
  showSuccessNotification?: boolean;
  successMessage?: string;
}

export function useApi<T = any>() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<T | null>(null);

  const callApi = useCallback(
    async (
      apiCall: () => Promise<ApiResponse<T>>,
      options: UseApiOptions<T> = {}
    ) => {
      const {
        onSuccess,
        onError,
        showErrorNotification = true,
        showSuccessNotification = false,
        successMessage,
      } = options;

      setLoading(true);
      setError(null);

      try {
        const response = await apiCall();
        
        setData(response.data);
        
        if (showSuccessNotification && successMessage) {
          dispatch(
            addNotification({
              type: 'success',
              message: successMessage,
            })
          );
        }
        
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        return response.data;
      } catch (err: any) {
        const apiError = err as ApiError;
        setError(apiError);
        
        if (showErrorNotification) {
          dispatch(
            addNotification({
              type: 'error',
              message: apiError.message || 'Произошла ошибка',
            })
          );
        }
        
        if (onError) {
          onError(apiError);
        }
        
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const get = useCallback(
    async (
      url: string,
      config?: any,
      options?: UseApiOptions<T>
    ) => {
      return callApi(() => apiClient.get<T>(url, config), options);
    },
    [callApi]
  );

  const post = useCallback(
    async (
      url: string,
      data?: any,
      config?: any,
      options?: UseApiOptions<T>
    ) => {
      return callApi(() => apiClient.post<T>(url, data, config), options);
    },
    [callApi]
  );

  const put = useCallback(
    async (
      url: string,
      data?: any,
      config?: any,
      options?: UseApiOptions<T>
    ) => {
      return callApi(() => apiClient.put<T>(url, data, config), options);
    },
    [callApi]
  );

  const patch = useCallback(
    async (
      url: string,
      data?: any,
      config?: any,
      options?: UseApiOptions<T>
    ) => {
      return callApi(() => apiClient.patch<T>(url, data, config), options);
    },
    [callApi]
  );

  const del = useCallback(
    async (
      url: string,
      config?: any,
      options?: UseApiOptions<T>
    ) => {
      return callApi(() => apiClient.delete<T>(url, config), options);
    },
    [callApi]
  );

  const uploadFile = useCallback(
    async (
      url: string,
      file: File,
      fieldName?: string,
      options?: UseApiOptions<T>
    ) => {
      return callApi(() => apiClient.uploadFile(url, file, fieldName), options);
    },
    [callApi]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    // Методы API
    get,
    post,
    put,
    patch,
    delete: del,
    uploadFile,
    callApi,
    
    // Состояние
    loading,
    error,
    data,
    
    // Утилиты
    reset,
    hasError: error !== null,
    hasData: data !== null,
  };
}

// Хук для оптимистичных обновлений
export function useOptimisticApi<T = any>() {
  const { callApi, ...api } = useApi<T>();
  const [optimisticData, setOptimisticData] = useState<T | null>(null);

  const optimisticUpdate = useCallback(
    async (
      apiCall: () => Promise<ApiResponse<T>>,
      optimisticData: T,
      options?: UseApiOptions<T>
    ) => {
      setOptimisticData(optimisticData);
      
      try {
        const result = await callApi(apiCall, options);
        setOptimisticData(null);
        return result;
      } catch (error) {
        setOptimisticData(null);
        throw error;
      }
    },
    [callApi]
  );

  return {
    ...api,
    optimisticUpdate,
    optimisticData,
    isOptimistic: optimisticData !== null,
    displayData: optimisticData || api.data,
  };
}