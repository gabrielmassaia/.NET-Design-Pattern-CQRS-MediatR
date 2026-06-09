import type { AxiosInstance } from 'axios';
import { BaseService } from './base-service';

interface TestEntity { id: string; name: string; }
interface TestCreate { name: string; }
interface TestUpdate { name: string; }

class TestService extends BaseService<TestEntity, TestCreate, TestUpdate> {
  protected readonly resource = '/api/test';
}

const mockClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
    response: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
  },
} as unknown as AxiosInstance;

describe('BaseService', () => {
  let service: TestService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new TestService(mockClient);
  });

  describe('getAll', () => {
    it('calls GET on resource and returns data', async () => {
      (mockClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, data: [{ id: '1', name: 'A' }], errorCode: null },
      });

      const result = await service.getAll();
      expect(mockClient.get).toHaveBeenCalledWith('/api/test');
      expect(result).toEqual([{ id: '1', name: 'A' }]);
    });
  });

  describe('getById', () => {
    it('calls GET on resource/:id', async () => {
      (mockClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, data: { id: '1', name: 'A' }, errorCode: null },
      });

      const result = await service.getById('1');
      expect(mockClient.get).toHaveBeenCalledWith('/api/test/1');
      expect(result).toEqual({ id: '1', name: 'A' });
    });
  });

  describe('create', () => {
    it('calls POST on resource with payload', async () => {
      (mockClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, data: { id: '1', name: 'New' }, errorCode: null },
      });

      const result = await service.create({ name: 'New' });
      expect(mockClient.post).toHaveBeenCalledWith('/api/test', { name: 'New' });
      expect(result.name).toBe('New');
    });
  });

  describe('update', () => {
    it('calls PUT on resource/:id with payload', async () => {
      (mockClient.put as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, data: { id: '1', name: 'Updated' }, errorCode: null },
      });

      const result = await service.update('1', { name: 'Updated' });
      expect(mockClient.put).toHaveBeenCalledWith('/api/test/1', { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('calls DELETE on resource/:id', async () => {
      (mockClient.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});

      await service.remove('1');
      expect(mockClient.delete).toHaveBeenCalledWith('/api/test/1');
    });
  });

  describe('getRequest (protected)', () => {
    it('calls GET with config and returns data', async () => {
      (mockClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, data: [{ id: '1' }], errorCode: null },
      });

      const result = await (service as unknown as { getRequest<T>(url: string, config?: object): Promise<T> }).getRequest<{ id: string }[]>('/api/test', { params: { q: 'test' } });
      expect(mockClient.get).toHaveBeenCalledWith('/api/test', { params: { q: 'test' } });
      expect(result).toEqual([{ id: '1' }]);
    });
  });

  describe('postRequest (protected)', () => {
    it('calls POST with payload and config', async () => {
      (mockClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, data: { id: '1' }, errorCode: null },
      });

      const result = await (service as unknown as { postRequest<T>(url: string, payload?: unknown, config?: object): Promise<T> }).postRequest<{ id: string }>('/api/test', { name: 'test' });
      expect(mockClient.post).toHaveBeenCalledWith('/api/test', { name: 'test' }, undefined);
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('patchRequest (protected)', () => {
    it('calls PATCH with payload', async () => {
      (mockClient.patch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, data: { id: '1', status: 3 }, errorCode: null },
      });

      const result = await (service as unknown as { patchRequest<T>(url: string, payload?: unknown, config?: object): Promise<T> }).patchRequest<{ id: string; status: number }>('/api/test/1', { status: 3 });
      expect(mockClient.patch).toHaveBeenCalledWith('/api/test/1', { status: 3 }, undefined);
      expect(result.status).toBe(3);
    });
  });

  describe('deleteRequest (protected)', () => {
    it('calls DELETE and returns data', async () => {
      (mockClient.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, data: null, errorCode: null },
      });

      const result = await (service as unknown as { deleteRequest<T>(url: string, config?: object): Promise<T> }).deleteRequest<null>('/api/test/1');
      expect(mockClient.delete).toHaveBeenCalledWith('/api/test/1', undefined);
      expect(result).toBeNull();
    });
  });
});
