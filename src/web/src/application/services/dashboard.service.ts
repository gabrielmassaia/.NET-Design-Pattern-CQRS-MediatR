import { api, downloadFile, getApiData } from '@/infrastructure/http/axios-client';
import { BaseService } from '@/shared/services/base-service';
import type { DashboardData, Alerta } from '@/domain/types';
import { ExportFormato } from '@/domain/types';

class DashboardService extends BaseService<never> {
  protected readonly resource = '/api/dashboard';

  async getDashboard(ano?: number, mes?: number): Promise<DashboardData> {
    const params = new URLSearchParams();
    if (ano) params.set('ano', String(ano));
    if (mes) params.set('mes', String(mes));
    const qs = params.toString();
    return getApiData<DashboardData>(qs ? `${this.resource}?${qs}` : this.resource);
  }

  async getAlertas(): Promise<Alerta[]> {
    return getApiData<Alerta[]>(`${this.resource}/alertas`);
  }

  async exportAlertas(formato: ExportFormato = ExportFormato.CSV): Promise<Blob> {
    return downloadFile(`${this.resource}/alertas/export`, { formato });
  }

  async exportDashboard(formato: ExportFormato = ExportFormato.CSV): Promise<Blob> {
    return downloadFile(`${this.resource}/export`, { formato });
  }
}

export const dashboardService = new DashboardService(api);
