import { renderWithProviders, screen, userEvent, waitFor } from '@/test/render';
import CalendarioPage from './CalendarioPage';

async function selectEmpresa(user: ReturnType<typeof userEvent.setup>) {
  const select = document.querySelector('.ant-select-selector');
  if (!select) return;
  await user.click(select);

  const option = await screen.findByTitle('Empresa Exemplo Ltda — Simples Nacional');
  await user.click(option);
}

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

  it('shows obrigacao table when empresa is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CalendarioPage />);

    await selectEmpresa(user);

    await waitFor(() => {
      expect(screen.queryByText('Selecione uma empresa para visualizar as obrigações do período.')).not.toBeInTheDocument();
    });
  });

  it('shows obrigacao data after selecting empresa', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CalendarioPage />);

    await selectEmpresa(user);

    expect(await screen.findByText('DAS')).toBeInTheDocument();
    expect(await screen.findByText('eSocial')).toBeInTheDocument();
  });

  it('shows clear filter button when status filter is active', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CalendarioPage />);

    const selectElements = document.querySelectorAll('.ant-select-selector');
    const statusSelect = selectElements[selectElements.length - 1];
    expect(statusSelect).toBeInTheDocument();
    if (statusSelect) {
      await user.click(statusSelect);
    }

    const pendenteOption = await screen.findByText('Pendente');
    await user.click(pendenteOption);

    expect(await screen.findByText('Limpar filtro')).toBeInTheDocument();
  });

  it('renders register entrega button for pending obrigacoes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CalendarioPage />);

    await selectEmpresa(user);

    await waitFor(() => {
      const buttons = screen.getAllByText('Registrar');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
