import type { AxiosInstance } from 'axios';
import type { ApiResponse } from '@/shared/types/api-response';

export abstract class BaseService<TEntity, TCreate = never, TUpdate = never> {
  protected abstract readonly resource: string;

  constructor(protected readonly client: AxiosInstance) {}

  async getAll(): Promise<TEntity[]> {
    const { data } = await this.client.get<ApiResponse<TEntity[]>>(this.resource);
    return data.data;
  }

  async getById(id: string): Promise<TEntity> {
    const { data } = await this.client.get<ApiResponse<TEntity>>(`${this.resource}/${id}`);
    return data.data;
  }

  async create(payload: TCreate): Promise<TEntity> {
    const { data } = await this.client.post<ApiResponse<TEntity>>(this.resource, payload);
    return data.data;
  }

  async update(id: string, payload: TUpdate): Promise<TEntity> {
    const { data } = await this.client.put<ApiResponse<TEntity>>(`${this.resource}/${id}`, payload);
    return data.data;
  }

  async remove(id: string): Promise<void> {
    await this.client.delete(`${this.resource}/${id}`);
  }

  protected async getRequest<TResponse>(url: string, config?: object): Promise<TResponse> {
    const { data } = await this.client.get<ApiResponse<TResponse>>(url, config);
    return data.data;
  }

  protected async postRequest<TResponse, TPayload = unknown>(
    url: string,
    payload?: TPayload,
    config?: object,
  ): Promise<TResponse> {
    const { data } = await this.client.post<ApiResponse<TResponse>>(url, payload, config);
    return data.data;
  }

  protected async patchRequest<TResponse, TPayload = unknown>(
    url: string,
    payload?: TPayload,
    config?: object,
  ): Promise<TResponse> {
    const { data } = await this.client.patch<ApiResponse<TResponse>>(url, payload, config);
    return data.data;
  }

  protected async deleteRequest<TResponse>(url: string, config?: object): Promise<TResponse> {
    const { data } = await this.client.delete<ApiResponse<TResponse>>(url, config);
    return data.data;
  }
}
