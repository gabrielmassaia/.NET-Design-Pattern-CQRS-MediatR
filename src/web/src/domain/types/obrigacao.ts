export enum TipoObrigacao {
  DAS = 1, DCTF = 2, EFD_ICMS_IPI = 3, EFD_Contribuicoes = 4,
  EFD_Reinf = 5, eSocial = 6, DEFIS = 7, SPED_ECD = 8,
  SPED_ECF = 9, DIRF = 10, RAIS = 11,
}

export enum StatusObrigacao {
  Pendente     = 1,
  Atrasada     = 2,
  Entregue     = 3,
  NaoAplicavel = 4,
}

export interface Obrigacao {
  id: string;
  empresaId: string;
  tipo: TipoObrigacao;
  tipoNome: string;
  competencia: string;
  dataVencimento: string;
  dataEntrega?: string;
  status: StatusObrigacao;
}

export interface RegistrarEntregaPayload {
  dataEntrega?: string;
}

import { ExportFormato } from './export';

export interface FindObrigacoesParams {
  empresaId: string;
  ano: number;
  mes: number;
}

export interface ExportObrigacoesParams extends FindObrigacoesParams {
  formato?: ExportFormato;
}
