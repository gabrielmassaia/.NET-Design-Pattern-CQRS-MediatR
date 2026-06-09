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
});
