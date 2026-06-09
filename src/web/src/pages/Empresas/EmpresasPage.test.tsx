import { renderWithProviders, screen, waitFor } from '@/test/render';
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
    expect(await screen.findByText('Empresa Exemplo Ltda', {}, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByText('Comércio Brasil S.A.', {}, { timeout: 5000 })).toBeInTheDocument();
  });

  it('opens modal on new company click', async () => {
    const user = (await import('@/test/render')).userEvent.setup();
    renderWithProviders(<EmpresasPage />);

    const btns = await screen.findAllByText('Nova Empresa');
    await user.click(btns[0]);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('00.000.000/0000-00')).toBeInTheDocument();
    });
  });
});
