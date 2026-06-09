import { api, downloadFile, getApiData, postApiData, patchApiData, deleteApiData } from './axios-client';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
        response: { use: vi.fn((onFulfilled, onRejected) => {
          // Store the rejection handler for testing
          (globalThis as any).__axiosResponseErrorHandler = onRejected;
          return 0;
        }), eject: vi.fn(), clear: vi.fn() },
      },
      defaults: { baseURL: '', headers: { common: {} } },
    })),
  },
}));

describe('axios-client', () => {
  describe('api instance', () => {
    it('has a response interceptor that rejects with error message', async () => {
      const handler = (globalThis as any).__axiosResponseErrorHandler;
      const error = {
        response: { data: { message: 'Erro customizado' } },
      };
      await expect(handler(error)).rejects.toThrow('Erro customizado');
    });

    it('uses fallback message when no response data', async () => {
      const handler = (globalThis as any).__axiosResponseErrorHandler;
      const error = { response: {} };
      await expect(handler(error)).rejects.toThrow('Erro inesperado. Tente novamente.');
    });
  });

  describe('downloadFile', () => {
    it('calls api.get with responseType blob', async () => {
      const blob = new Blob(['csv']);
      (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: blob });

      const result = await downloadFile('/api/export', { formato: 'csv' });
      expect(api.get).toHaveBeenCalledWith('/api/export', {
        params: { formato: 'csv' },
        responseType: 'blob',
      });
      expect(result).toBe(blob);
    });
  });

  describe('getApiData', () => {
    it('returns data field from response envelope', async () => {
      (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, message: '', data: { id: '1' }, errorCode: null },
      });

      const result = await getApiData('/api/test');
      expect(api.get).toHaveBeenCalledWith('/api/test');
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('postApiData', () => {
    it('posts payload and returns data field', async () => {
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, message: '', data: { id: '2' }, errorCode: null },
      });

      const result = await postApiData('/api/test', { name: 'x' });
      expect(api.post).toHaveBeenCalledWith('/api/test', { name: 'x' });
      expect(result).toEqual({ id: '2' });
    });
  });

  describe('patchApiData', () => {
    it('patches payload and returns data field', async () => {
      (api.patch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, message: '', data: { status: 3 }, errorCode: null },
      });

      const result = await patchApiData('/api/test/1', { status: 3 });
      expect(api.patch).toHaveBeenCalledWith('/api/test/1', { status: 3 });
      expect(result).toEqual({ status: 3 });
    });
  });

  describe('deleteApiData', () => {
    it('calls api.delete with the url', async () => {
      (api.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});

      await deleteApiData('/api/test/1');
      expect(api.delete).toHaveBeenCalledWith('/api/test/1');
    });
  });
});
