import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api';
import { ApiError } from '../types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiOptions {
  immediate?: boolean;
  retryOnError?: boolean;
  retryDelay?: number;
  maxRetries?: number;
}

/**
 * Hook personalizado para consumir la API con manejo automático de estados
 */
export function useApiClient<T>(
  url: string,
  options: UseApiOptions = {}
) {
  const {
    immediate = true,
    retryOnError = false,
    retryDelay = 2000,
    maxRetries = 3
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const [retryCount, setRetryCount] = useState(0);

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiClient.get<T>(url);
      setState({
        data,
        loading: false,
        error: null,
      });
      setRetryCount(0);
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }));

      // Retry automático si está habilitado
      if (retryOnError && retryCount < maxRetries && apiError.status >= 500) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          execute();
        }, retryDelay);
      }
    }
  }, [url, retryOnError, retryCount, maxRetries, retryDelay]);

  const refetch = useCallback(() => {
    setRetryCount(0);
    execute();
  }, [execute]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    refetch,
    retryCount,
  };
}

/**
 * Hook para operaciones de mutación (POST, PUT, DELETE)
 */
export function useApiMutation<TData, TVariables = any>() {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (
    method: 'post' | 'put' | 'patch' | 'delete',
    url: string,
    variables?: TVariables
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let data: TData;
      switch (method) {
        case 'post':
          data = await apiClient.post<TData>(url, variables);
          break;
        case 'put':
          data = await apiClient.put<TData>(url, variables);
          break;
        case 'patch':
          data = await apiClient.patch<TData>(url, variables);
          break;
        case 'delete':
          data = await apiClient.delete<TData>(url);
          break;
        default:
          throw new Error(`Método ${method} no soportado`);
      }

      setState({
        data,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }));
      throw apiError;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}

/**
 * Hook específico para subida de archivos
 */
export function useFileUpload<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const [progress, setProgress] = useState(0);

  const upload = useCallback(async (
    url: string,
    file: File,
    fieldName = 'file',
    additionalData?: Record<string, any>
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    setProgress(0);

    try {
      // Simular progreso (en una implementación real, usarías onUploadProgress de Axios)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const data = await apiClient.uploadFile<T>(url, file, fieldName, additionalData);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setState({
        data,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }));
      setProgress(0);
      throw apiError;
    }
  }, []);

  return {
    ...state,
    progress,
    upload,
  };
}