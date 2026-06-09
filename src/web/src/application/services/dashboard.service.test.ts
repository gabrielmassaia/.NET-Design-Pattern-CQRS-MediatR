import { api } from '@/infrastructure/http/axios-client';
import { dashboardService } from './dashboard.service';
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

describe('dashboardService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getDashboard', () => {
    it('calls getApiData with /api/dashboard', async () => {
      const { getApiData } = await import('@/infrastructure/http/axios-client');
      const mockData = {
        totalEmpresas: 5,
        totalObrigacoesMes: 12,
        pendentes: 7,
        entregues: 3,
        atrasadas: 2,
      };
      (getApiData as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockData);

      const result = await dashboardService.getDashboard();

      expect(getApiData).toHaveBeenCalledWith('/api/dashboard');
      expect(result).toEqual(mockData);
    });
  });

  describe('getAlertas', () => {
    it('calls getApiData with /api/dashboard/alertas', async () => {
      const { getApiData } = await import('@/infrastructure/http/axios-client');
      (getApiData as ReturnType<typeof vi.fn>).mockResolvedValueOnce([{ id: 'a1' }]);

      const result = await dashboardService.getAlertas();

      expect(getApiData).toHaveBeenCalledWith('/api/dashboard/alertas');
      expect(result).toHaveLength(1);
    });
  });

  describe('exportAlertas', () => {
    it('calls downloadFile with CSV format', async () => {
      const { downloadFile } = await import('@/infrastructure/http/axios-client');
      const blob = new Blob(['csv']);
      (downloadFile as ReturnType<typeof vi.fn>).mockResolvedValueOnce(blob);

      const result = await dashboardService.exportAlertas(ExportFormato.CSV);

      expect(downloadFile).toHaveBeenCalledWith('/api/dashboard/alertas/export', { formato: 'csv' });
      expect(result).toBe(blob);
    });
  });

  describe('exportDashboard', () => {
    it('calls downloadFile with PDF format', async () => {
      const { downloadFile } = await import('@/infrastructure/http/axios-client');
      const blob = new Blob(['pdf']);
      (downloadFile as ReturnType<typeof vi.fn>).mockResolvedValueOnce(blob);

      const result = await dashboardService.exportDashboard(ExportFormato.PDF);

      expect(downloadFile).toHaveBeenCalledWith('/api/dashboard/export', { formato: 'pdf' });
      expect(result).toBe(blob);
    });
  });
});
