import { renderWithProviders, screen, userEvent } from '@/test/render';
import { EmpresaForm } from './EmpresaForm';

describe('EmpresaForm', () => {
  it('renders modal with form fields when open', () => {
    renderWithProviders(<EmpresaForm open onClose={vi.fn()} />);
    expect(screen.getByText('Nova Empresa')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('00.000.000/0000-00')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome da empresa')).toBeInTheDocument();
    expect(screen.getByText('Cadastrar')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProviders(<EmpresaForm open={false} onClose={vi.fn()} />);
    expect(screen.queryByText('Nova Empresa')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<EmpresaForm open onClose={onClose} />);
    await user.click(screen.getByText('Cancelar'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
