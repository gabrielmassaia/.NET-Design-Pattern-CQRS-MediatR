import { renderWithProviders, screen, userEvent, waitFor } from '@/test/render';
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
    const dozeElements = await screen.findAllByText('12');
    expect(dozeElements.length).toBeGreaterThanOrEqual(1);
    const seteElements = await screen.findAllByText('7');
    expect(seteElements.length).toBeGreaterThanOrEqual(1);
    const tresElements = await screen.findAllByText('3');
    expect(tresElements.length).toBeGreaterThanOrEqual(1);
    const doisElements = await screen.findAllByText('2');
    expect(doisElements.length).toBeGreaterThanOrEqual(1);
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

  it('renders export buttons', async () => {
    renderWithProviders(<DashboardPage />);
    const xlsxButtons = await screen.findAllByText('XLSX');
    expect(xlsxButtons.length).toBeGreaterThan(0);
    const csvButtons = await screen.findAllByText('CSV');
    expect(csvButtons.length).toBeGreaterThan(0);
    const pdfButtons = await screen.findAllByText('PDF');
    expect(pdfButtons.length).toBeGreaterThan(0);
  });

  it('switches to alertas only mode via query param', async () => {
    renderWithProviders(<DashboardPage />, { route: '/dashboard?alertas=1' });
    expect(await screen.findByText('Painel de Alertas')).toBeInTheDocument();
    expect(screen.queryByText('Visão de Alertas')).not.toBeInTheDocument();
  });

  it('renders alertas table data in alertas mode', async () => {
    renderWithProviders(<DashboardPage />, { route: '/dashboard?alertas=1' });
    expect(await screen.findByText('DAS')).toBeInTheDocument();
    expect(await screen.findByText('DCTF')).toBeInTheDocument();
  });

  it('renders period tag with current month/year', async () => {
    renderWithProviders(<DashboardPage />);
    expect(await screen.findByText(/06\/26/)).toBeInTheDocument();
  });

  it('renders month picker', async () => {
    renderWithProviders(<DashboardPage />);
    const monthPicker = document.querySelector('.ant-picker');
    expect(monthPicker).toBeInTheDocument();
  });
});
