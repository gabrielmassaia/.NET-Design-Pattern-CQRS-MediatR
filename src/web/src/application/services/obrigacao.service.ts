import { api, downloadFile } from '@/infrastructure/http/axios-client';
import { BaseService } from '@/shared/services/base-service';
import { ExportFormato } from '@/domain/types';
import type {
  Obrigacao,
  RegistrarEntregaPayload,
  FindObrigacoesParams,
  ExportObrigacoesParams,
} from '@/domain/types';

class ObrigacaoService extends BaseService<Obrigacao> {
  protected readonly resource = '/api/obrigacoes';

  async findByFilters(params: FindObrigacoesParams): Promise<Obrigacao[]> {
    return this.getRequest<Obrigacao[]>(this.resource, { params });
  }

  async registrarEntrega(id: string, payload: RegistrarEntregaPayload): Promise<Obrigacao> {
    return this.patchRequest<Obrigacao>(`${this.resource}/${id}/entrega`, payload);
  }

  async getHistorico(empresaId: string): Promise<Obrigacao[]> {
    return this.getRequest<Obrigacao[]>(`${this.resource}/historico/${empresaId}`);
  }

  async exportObrigacoes(params: ExportObrigacoesParams): Promise<Blob> {
    return downloadFile(`${this.resource}/export`, {
      ...params,
      formato: params.formato ?? ExportFormato.CSV,
    });
  }
}

export const obrigacaoService = new ObrigacaoService(api);
