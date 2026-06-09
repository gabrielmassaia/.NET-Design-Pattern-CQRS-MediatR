import { api } from '@/infrastructure/http/axios-client';
import { empresaService } from './empresa.service';

vi.mock('@/infrastructure/http/axios-client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
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
  beforeEach(() => vi.clearAllMocks());

  describe('getAll', () => {
    it('calls GET /api/empresas and returns data', async () => {
      (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: {
          success: true,
          data: [
            { id: '1', cnpj: '11222333000181', razaoSocial: 'Empresa A', regime: 1 },
          ],
          errorCode: null,
        },
      });

      const result = await empresaService.getAll();

      expect(api.get).toHaveBeenCalledWith('/api/empresas');
      expect(result).toHaveLength(1);
      expect(result[0].razaoSocial).toBe('Empresa A');
    });
  });

  describe('search', () => {
    it('calls GET /api/empresas/search with query param', async () => {
      (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, data: [{ id: '1', razaoSocial: 'Exemplo' }], errorCode: null },
      });

      const result = await empresaService.search('exemplo');

      expect(api.get).toHaveBeenCalledWith('/api/empresas/search', { params: { q: 'exemplo' } });
      expect(result).toHaveLength(1);
    });

    it('returns empty when no matches', async () => {
      (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, data: [], errorCode: null },
      });

      const result = await empresaService.search('zzzzz');

      expect(result).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('calls POST /api/empresas with payload', async () => {
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: {
          success: true,
          data: { id: '3', cnpj: '99888777000155', razaoSocial: 'Nova', regime: 1 },
          errorCode: null,
        },
      });

      const result = await empresaService.create({ cnpj: '99888777000155', razaoSocial: 'Nova', regime: 1 });

      expect(api.post).toHaveBeenCalledWith('/api/empresas', { cnpj: '99888777000155', razaoSocial: 'Nova', regime: 1 });
      expect(result.id).toBe('3');
    });
  });

  describe('remove', () => {
    it('calls DELETE /api/empresas/:id', async () => {
      (api.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, data: null, errorCode: null },
      });

      await empresaService.remove('1');

      expect(api.delete).toHaveBeenCalledWith('/api/empresas/1');
    });
  });
});
