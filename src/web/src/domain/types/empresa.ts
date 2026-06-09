export enum RegimeTributario {
  SimplesNacional  = 1,
  LucroPresumido   = 2,
  LucroReal        = 3,
  ImunidadeIsencao = 4,
}

export interface Empresa {
  id: string;
  cnpj: string;
  razaoSocial: string;
  regime: RegimeTributario;
  createdAt: string;
}

export interface CreateEmpresaPayload {
  cnpj: string;
  razaoSocial: string;
  regime: RegimeTributario;
}
