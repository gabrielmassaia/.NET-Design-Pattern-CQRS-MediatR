import type { StatusObrigacao } from './obrigacao';

export interface DashboardData {
  totalEmpresas: number;
  totalObrigacoesMes: number;
  pendentes: number;
  entregues: number;
  atrasadas: number;
}

export interface Alerta {
  id: string;
  empresaId: string;
  razaoSocial: string;
  cnpj: string;
  tipoNome: string;
  dataVencimento: string;
  diasRestantes: number;
  status: StatusObrigacao;
}
