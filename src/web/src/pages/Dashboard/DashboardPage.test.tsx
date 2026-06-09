import { renderWithProviders, screen } from '@/test/render';
import DashboardPage from './DashboardPage';

describe('DashboardPage', () => {
  it('renders dashboard title', async () => {
    renderWithProviders(<DashboardPage />);
    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
  });

  it('renders KPI section after loading', async () => {
    renderWithProviders(<DashboardPage />);
    expect(await screen.findByText('Empresas')).toBeInTheDocument();
    expect(await screen.findByText('Obrigações do Mês')).toBeInTheDocument();
    const pendentes = await screen.findAllByText('Pendentes');
    expect(pendentes.length).toBeGreaterThan(0);
    const entregues = await screen.findAllByText('Entregues');
    expect(entregues.length).toBeGreaterThan(0);
    const atrasadas = await screen.findAllByText('Atrasadas');
    expect(atrasadas.length).toBeGreaterThan(0);
  });

  it('renders KPI values from API', async () => {
    renderWithProviders(<DashboardPage />);
    expect(await screen.findByText('5')).toBeInTheDocument();
  });

  it('renders alertas section', async () => {
    renderWithProviders(<DashboardPage />);
    expect(await screen.findByText('Visão de Alertas')).toBeInTheDocument();
  });

  it('renders timestamp', async () => {
    renderWithProviders(<DashboardPage />);
    const timestamp = await screen.findByText(/Atualizado às/);
    expect(timestamp).toBeInTheDocument();
  });
});
