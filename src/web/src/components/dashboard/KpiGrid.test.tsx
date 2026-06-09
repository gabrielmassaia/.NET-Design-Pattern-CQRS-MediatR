import { renderWithProviders, screen } from '@/test/render';
import { KpiGrid } from './KpiGrid';

describe('KpiGrid', () => {
  const dashboard = {
    totalEmpresas: 5,
    totalObrigacoesMes: 12,
    pendentes: 7,
    entregues: 3,
    atrasadas: 2,
  };

  it('renders all KPI values', () => {
    renderWithProviders(<KpiGrid dashboard={dashboard} loading={false} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    const { container } = renderWithProviders(
      <KpiGrid dashboard={undefined} loading />,
    );
    expect(container.querySelector('.ant-skeleton')).toBeInTheDocument();
  });

  it('renders all KPI labels', () => {
    renderWithProviders(<KpiGrid dashboard={dashboard} loading={false} />);
    expect(screen.getByText('Empresas')).toBeInTheDocument();
    expect(screen.getByText('Obrigações do Mês')).toBeInTheDocument();
    expect(screen.getByText('Pendentes')).toBeInTheDocument();
    expect(screen.getByText('Entregues')).toBeInTheDocument();
    expect(screen.getByText('Atrasadas')).toBeInTheDocument();
  });
});
