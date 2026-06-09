import type { FindObrigacoesParams } from '@/domain/types';

export const empresasKeys = {
  all: ['empresas'] as const,
  search: (q: string) => ['empresas', 'search', q] as const,
};

export const obrigacoesKeys = {
  all: ['obrigacoes'] as const,
  list: (params: FindObrigacoesParams) =>
    ['obrigacoes', params.empresaId, params.ano, params.mes] as const,
  historico: (empresaId: string) => ['historico', empresaId] as const,
};

export const dashboardKeys = {
  dashboard: ['dashboard'] as const,
  alertas: ['alertas'] as const,
};
