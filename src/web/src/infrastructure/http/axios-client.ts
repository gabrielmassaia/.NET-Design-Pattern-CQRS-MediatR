import axios, { type AxiosError, type AxiosInstance } from 'axios';
import type { ApiResponse } from '@/shared/types/api-response';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string }>) => {
    const msg = err.response?.data?.message ?? 'Erro inesperado. Tente novamente.';
    return Promise.reject(new Error(msg));
  },
);

export async function downloadFile(url: string, params: Record<string, unknown>): Promise<Blob> {
  const { data } = await api.get(url, {
    params,
    responseType: 'blob',
  });
  return data;
}

export async function getApiData<T>(url: string): Promise<T> {
  const { data } = await api.get<ApiResponse<T>>(url);
  return data.data;
}

export async function postApiData<T>(url: string, payload?: unknown): Promise<T> {
  const { data } = await api.post<ApiResponse<T>>(url, payload);
  return data.data;
}

export async function patchApiData<T>(url: string, payload?: unknown): Promise<T> {
  const { data } = await api.patch<ApiResponse<T>>(url, payload);
  return data.data;
}

export async function deleteApiData(url: string): Promise<void> {
  await api.delete(url);
}
