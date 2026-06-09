import { api } from '@/infrastructure/http/axios-client';
import { obrigacaoService } from './obrigacao.service';
import { ExportFormato } from '@/domain/types';

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

describe('obrigacaoService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('findByFilters', () => {
    it('calls GET /api/obrigacoes with params', async () => {
      (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, data: [{ id: 'o1', status: 1 }], errorCode: null },
      });

      const result = await obrigacaoService.findByFilters({ empresaId: '1', ano: 2026, mes: 6 });

      expect(api.get).toHaveBeenCalledWith('/api/obrigacoes', {
        params: { empresaId: '1', ano: 2026, mes: 6 },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('o1');
    });
  });

  describe('registrarEntrega', () => {
    it('calls PATCH /api/obrigacoes/:id/entrega', async () => {
      (api.patch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, data: { id: 'o1', status: 3 }, errorCode: null },
      });

      const result = await obrigacaoService.registrarEntrega('o1', { dataEntrega: '2026-07-15' });

      expect(api.patch).toHaveBeenCalledWith('/api/obrigacoes/o1/entrega', { dataEntrega: '2026-07-15' }, undefined);
      expect(result.status).toBe(3);
    });
  });

  describe('getHistorico', () => {
    it('calls GET /api/obrigacoes/historico/:empresaId', async () => {
      (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, data: [{ id: 'h1', status: 3 }], errorCode: null },
      });

      const result = await obrigacaoService.getHistorico('1');

      expect(api.get).toHaveBeenCalledWith('/api/obrigacoes/historico/1', undefined);
      expect(result).toHaveLength(1);
    });
  });

  describe('exportObrigacoes', () => {
    it('calls downloadFile with export params', async () => {
      const { downloadFile } = await import('@/infrastructure/http/axios-client');
      const blob = new Blob(['csv']);
      (downloadFile as ReturnType<typeof vi.fn>).mockResolvedValueOnce(blob);

      const result = await obrigacaoService.exportObrigacoes({
        empresaId: '1', ano: 2026, mes: 6, formato: ExportFormato.CSV,
      });

      expect(downloadFile).toHaveBeenCalledWith('/api/obrigacoes/export', {
        empresaId: '1', ano: 2026, mes: 6, formato: 'csv',
      });
      expect(result).toBe(blob);
    });
  });
});
