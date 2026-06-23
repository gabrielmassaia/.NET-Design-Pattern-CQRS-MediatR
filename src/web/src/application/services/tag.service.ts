import { api } from '@/infrastructure/http/axios-client';
import { BaseService } from '@/shared/services/base-service';
import type { Tag, CreateTagPayload } from '@/domain/types';

class TagService extends BaseService<Tag, CreateTagPayload> {
  protected readonly resource = '/api/tags';

  async getByObrigacao(obrigacaoId: string): Promise<Tag[]> {
    return this.getRequest<Tag[]>(`/api/obrigacoes/${obrigacaoId}/tags`);
  }

  async vincularTags(obrigacaoId: string, tagIds: string[]): Promise<Tag> {
    return this.postRequest<Tag>(`/api/obrigacoes/${obrigacaoId}/tags`, { tagIds });
  }
}

export const tagService = new TagService(api);
