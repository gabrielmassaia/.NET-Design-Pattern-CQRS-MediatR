import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tagService } from '@/application/services';
import { tagsKeys } from '@/lib/query-keys';
import type { CreateTagPayload } from '@/domain/types';

export function useTags() {
  return useQuery({
    queryKey: tagsKeys.all,
    queryFn: () => tagService.getAll(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useTagsByObrigacao(obrigacaoId: string) {
  return useQuery({
    queryKey: tagsKeys.byObrigacao(obrigacaoId),
    queryFn: () => tagService.getByObrigacao(obrigacaoId),
    enabled: !!obrigacaoId,
    staleTime: 1000 * 30,
  });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTagPayload) => tagService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagsKeys.all }),
  });
}

export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tagService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagsKeys.all }),
  });
}

export function useVincularTags(obrigacaoId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tagIds: string[]) => tagService.vincularTags(obrigacaoId, tagIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tagsKeys.byObrigacao(obrigacaoId) });
      qc.invalidateQueries({ queryKey: tagsKeys.all });
    },
  });
}
