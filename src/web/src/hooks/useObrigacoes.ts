import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { obrigacaoService } from '@/application/services';
import { obrigacoesKeys } from '@/lib/query-keys';
import type { RegistrarEntregaPayload, FindObrigacoesParams } from '@/domain/types';

export function useObrigacoes(params: FindObrigacoesParams) {
  return useQuery({
    queryKey: obrigacoesKeys.list(params),
    queryFn: () => obrigacaoService.findByFilters(params),
    enabled: !!params.empresaId && params.ano > 0 && params.mes > 0,
    staleTime: 1000 * 30,
  });
}

export function useRegistrarEntrega() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RegistrarEntregaPayload }) =>
      obrigacaoService.registrarEntrega(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: obrigacoesKeys.all }),
  });
}

export function useHistorico(empresaId: string) {
  return useQuery({
    queryKey: obrigacoesKeys.historico(empresaId),
    queryFn: () => obrigacaoService.getHistorico(empresaId),
    enabled: !!empresaId,
    staleTime: 1000 * 60,
  });
}
