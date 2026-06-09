import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { empresaService } from '@/application/services';
import { empresasKeys } from '@/lib/query-keys';
import type { CreateEmpresaPayload } from '@/domain/types';

export function useEmpresas() {
  return useQuery({
    queryKey: empresasKeys.all,
    queryFn: () => empresaService.getAll(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useEmpresaSearch(query: string) {
  return useQuery({
    queryKey: empresasKeys.search(query),
    queryFn: () => empresaService.search(query),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 10,
  });
}

export function useCreateEmpresa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmpresaPayload) => empresaService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: empresasKeys.all }),
  });
}

export function useDeleteEmpresa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => empresaService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: empresasKeys.all }),
  });
}
