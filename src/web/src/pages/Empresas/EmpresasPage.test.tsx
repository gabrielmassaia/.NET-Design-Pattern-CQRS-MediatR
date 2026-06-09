import { renderWithProviders, screen, userEvent, waitFor } from '@/test/render';
import EmpresasPage from './EmpresasPage';

describe('EmpresasPage', () => {
  it('renders page title with company count', async () => {
    renderWithProviders(<EmpresasPage />);
    expect(await screen.findByText('Empresas')).toBeInTheDocument();
    expect(await screen.findByText(/empresa\(s\) cadastrada/)).toBeInTheDocument();
  });

  it('renders search input', async () => {
    renderWithProviders(<EmpresasPage />);
    expect(await screen.findByPlaceholderText(/buscar por razão social/i)).toBeInTheDocument();
  });

  it('renders new company button', async () => {
    renderWithProviders(<EmpresasPage />);
    expect(await screen.findByText('Nova Empresa')).toBeInTheDocument();
  });

  it('renders company list from API', async () => {
    renderWithProviders(<EmpresasPage />);
    expect(await screen.findByText('Empresa Exemplo Ltda')).toBeInTheDocument();
    expect(await screen.findByText('Comércio Brasil S.A.')).toBeInTheDocument();
  });

  it('opens modal on new company click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EmpresasPage />);

    const btns = await screen.findAllByText('Nova Empresa');
    await user.click(btns[0]);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('00.000.000/0000-00')).toBeInTheDocument();
    });
  });

  it('renders delete button for each company', async () => {
    renderWithProviders(<EmpresasPage />);
    const deleteButtons = await screen.findAllByLabelText('delete');
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it('renders regime badge for each company', async () => {
    renderWithProviders(<EmpresasPage />);
    expect(await screen.findByText('Simples Nacional')).toBeInTheDocument();
    expect(await screen.findByText('Lucro Presumido')).toBeInTheDocument();
  });

  it('renders company CNPJs formatted', async () => {
    renderWithProviders(<EmpresasPage />);
    const cnpjElements = await screen.findAllByText(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
    expect(cnpjElements.length).toBeGreaterThan(0);
  });
});
