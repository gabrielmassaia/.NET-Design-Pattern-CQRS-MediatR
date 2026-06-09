import { api } from '@/infrastructure/http/axios-client';
import { empresaService } from '@/application/services';

vi.mock('@/infrastructure/http/axios-client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
    },
  },
  downloadFile: vi.fn(),
  getApiData: vi.fn(),
}));

describe('empresaService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('calls GET /api/empresas and returns data', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: '',
          data: [
            { id: '1', cnpj: '11222333000181', razaoSocial: 'Teste Ltda', regime: 1, createdAt: '2026-01-01T00:00:00Z' },
          ],
          errorCode: null,
        },
      };
      (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const result = await empresaService.getAll();
      expect(api.get).toHaveBeenCalledWith('/api/empresas');
      expect(result).toHaveLength(1);
      expect(result[0].razaoSocial).toBe('Teste Ltda');
    });
  });

  describe('getById', () => {
    it('calls GET /api/empresas/:id', async () => {
      const mockResponse = {
        data: { success: true, message: '', data: { id: '1', cnpj: '00', razaoSocial: 'A', regime: 1, createdAt: '' }, errorCode: null },
      };
      (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const result = await empresaService.getById('1');
      expect(api.get).toHaveBeenCalledWith('/api/empresas/1');
      expect(result.id).toBe('1');
    });
  });

  describe('create', () => {
    it('calls POST /api/empresas with payload', async () => {
      const mockResponse = {
        data: { success: true, message: '', data: { id: '3', cnpj: '99888777000155', razaoSocial: 'Nova', regime: 2, createdAt: '' }, errorCode: null },
      };
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const result = await empresaService.create({ cnpj: '99888777000155', razaoSocial: 'Nova', regime: 2 });
      expect(api.post).toHaveBeenCalledWith('/api/empresas', { cnpj: '99888777000155', razaoSocial: 'Nova', regime: 2 });
      expect(result.razaoSocial).toBe('Nova');
    });
  });

  describe('remove', () => {
    it('calls DELETE /api/empresas/:id', async () => {
      (api.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});

      await empresaService.remove('1');
      expect(api.delete).toHaveBeenCalledWith('/api/empresas/1');
    });
  });

  describe('search', () => {
    it('calls GET /api/empresas/search with query param', async () => {
      const mockResponse = {
        data: { success: true, message: '', data: [{ id: '1', cnpj: '00', razaoSocial: 'A', regime: 1, createdAt: '' }], errorCode: null },
      };
      (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const result = await empresaService.search('exemplo');
      expect(api.get).toHaveBeenCalledWith('/api/empresas/search', { params: { q: 'exemplo' } });
      expect(result).toHaveLength(1);
    });
  });
});
