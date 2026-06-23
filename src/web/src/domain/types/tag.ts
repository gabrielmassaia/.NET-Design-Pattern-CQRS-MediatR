export interface Tag {
  id: string;
  nome: string;
  cor: string;
}

export interface CreateTagPayload {
  nome: string;
  cor: string;
}

export interface VincularTagsPayload {
  tagIds: string[];
}
