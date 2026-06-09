import { renderWithProviders, screen } from '@/test/render';
import CalendarioPage from './CalendarioPage';

describe('CalendarioPage', () => {
  it('renders page title', async () => {
    renderWithProviders(<CalendarioPage />);
    expect(await screen.findByText('Calendário de Obrigações')).toBeInTheDocument();
  });

  it('renders info alert when no company selected', async () => {
    renderWithProviders(<CalendarioPage />);
    expect(
      await screen.findByText('Selecione uma empresa para visualizar as obrigações do período.'),
    ).toBeInTheDocument();
  });

  it('renders filter elements', async () => {
    renderWithProviders(<CalendarioPage />);
    expect(await screen.findByText('Todos os status')).toBeInTheDocument();
    expect(document.querySelector('.ant-picker')).toBeInTheDocument();
  });

  it('renders CSV and PDF export buttons', async () => {
    renderWithProviders(<CalendarioPage />);
    expect(await screen.findByText('CSV')).toBeInTheDocument();
    expect(await screen.findByText('PDF')).toBeInTheDocument();
  });
});
