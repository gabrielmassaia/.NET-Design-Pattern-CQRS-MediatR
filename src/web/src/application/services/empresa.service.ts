import { api } from '@/infrastructure/http/axios-client';
import { BaseService } from '@/shared/services/base-service';
import type { Empresa, CreateEmpresaPayload } from '@/domain/types';

class EmpresaService extends BaseService<Empresa, CreateEmpresaPayload> {
  protected readonly resource = '/api/empresas';

  async search(q: string): Promise<Empresa[]> {
    return this.getRequest<Empresa[]>(`${this.resource}/search`, { params: { q } });
  }
}

export const empresaService = new EmpresaService(api);
