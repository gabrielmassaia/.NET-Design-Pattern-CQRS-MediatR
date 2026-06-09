import { renderWithProviders, screen } from '@/test/render';
import { AlertasChart } from './AlertasChart';
import { StatusObrigacao } from '@/domain/types';

describe('AlertasChart', () => {
  const defaultDashboard = {
    totalEmpresas: 5,
    totalObrigacoesMes: 10,
    pendentes: 5,
    entregues: 3,
    atrasadas: 2,
  };

  const defaultProps = { periodLabel: '06/26' };

  it('renders loading skeleton', () => {
    const { container } = renderWithProviders(
      <AlertasChart
        alertas={[]}
        dashboard={undefined}
        loadingAlertas
        loadingDash
        {...defaultProps}
      />,
    );
    expect(container.querySelector('.ant-skeleton')).toBeInTheDocument();
  });

  it('renders empty state when no alertas', () => {
    renderWithProviders(
      <AlertasChart
        alertas={[]}
        dashboard={defaultDashboard}
        loadingAlertas={false}
        loadingDash={false}
        {...defaultProps}
      />,
    );
    expect(
      screen.getByText('Nenhuma obrigação pendente ou atrasada'),
    ).toBeInTheDocument();
  });

  it('renders alerta urgency buckets', () => {
    renderWithProviders(
      <AlertasChart
        alertas={[
          { id: '1', empresaId: '1', razaoSocial: 'A', cnpj: '00', tipoNome: 'DAS', dataVencimento: '2026-07-01', diasRestantes: -5, status: StatusObrigacao.Atrasada },
          { id: '2', empresaId: '1', razaoSocial: 'A', cnpj: '00', tipoNome: 'DAS', dataVencimento: '2026-07-10', diasRestantes: 3, status: StatusObrigacao.Pendente },
          { id: '3', empresaId: '1', razaoSocial: 'A', cnpj: '00', tipoNome: 'DAS', dataVencimento: '2026-07-20', diasRestantes: 12, status: StatusObrigacao.Pendente },
          { id: '4', empresaId: '1', razaoSocial: 'A', cnpj: '00', tipoNome: 'DAS', dataVencimento: '2026-08-01', diasRestantes: 25, status: StatusObrigacao.Pendente },
        ]}
        dashboard={defaultDashboard}
        loadingAlertas={false}
        loadingDash={false}
        {...defaultProps}
      />,
    );
    expect(screen.getByText('Em atraso')).toBeInTheDocument();
    expect(screen.getByText('Crítico (1–7 dias)')).toBeInTheDocument();
    expect(screen.getByText('Próximo (8–15 dias)')).toBeInTheDocument();
    expect(screen.getByText('Em breve (16–30 d)')).toBeInTheDocument();
    expect(screen.getByText('Total de Alertas')).toBeInTheDocument();
  });

  it('renders total alertas count', () => {
    renderWithProviders(
      <AlertasChart
        alertas={[
          { id: '1', empresaId: '1', razaoSocial: 'A', cnpj: '00', tipoNome: 'DAS', dataVencimento: '2026-07-01', diasRestantes: 5, status: StatusObrigacao.Pendente },
        ]}
        dashboard={defaultDashboard}
        loadingAlertas={false}
        loadingDash={false}
        {...defaultProps}
      />,
    );
    const totalAlertas = screen.getAllByText('1');
    expect(totalAlertas.length).toBeGreaterThan(0);
  });

  it('renders "Nenhuma obrigação no mês" when total is 0', () => {
    renderWithProviders(
      <AlertasChart
        alertas={[]}
        dashboard={{ totalEmpresas: 5, totalObrigacoesMes: 0, pendentes: 0, entregues: 0, atrasadas: 0 }}
        loadingAlertas={false}
        loadingDash={false}
        {...defaultProps}
      />,
    );
    expect(screen.getByText('Nenhuma obrigação no mês')).toBeInTheDocument();
  });
});
