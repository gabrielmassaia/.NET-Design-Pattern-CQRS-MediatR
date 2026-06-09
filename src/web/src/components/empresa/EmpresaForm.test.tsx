import { renderWithProviders, screen, userEvent, waitFor } from '@/test/render';
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

  it('shows CNPJ mask on typing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EmpresaForm open onClose={vi.fn()} />);

    const cnpjInput = screen.getByPlaceholderText('00.000.000/0000-00');
    await user.type(cnpjInput, '11222333000181');
    expect(cnpjInput).toHaveValue('11.222.333/0001-81');
  });

  it('renders regime select placeholder', () => {
    renderWithProviders(<EmpresaForm open onClose={vi.fn()} />);
    expect(screen.getByText('Selecione...')).toBeInTheDocument();
  });

  it('opens RegimeMatrixModal on question icon click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EmpresaForm open onClose={vi.fn()} />);

    const questionIcon = document.querySelector('.anticon-question-circle');
    expect(questionIcon).toBeInTheDocument();
    if (questionIcon) {
      await user.click(questionIcon);
    }

    await waitFor(() => {
      expect(screen.getByText('Matriz de Obrigações por Regime Tributário')).toBeInTheDocument();
    });
  });

  it('submits form with valid data and closes', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<EmpresaForm open onClose={onClose} />);

    const cnpjInput = screen.getByPlaceholderText('00.000.000/0000-00');
    await user.type(cnpjInput, '11.222.333/0001-81');

    const nomeInput = screen.getByPlaceholderText('Nome da empresa');
    await user.type(nomeInput, 'Empresa Teste Ltda');

    const select = document.querySelector('.ant-select-selector');
    expect(select).toBeInTheDocument();
    if (select) {
      await user.click(select);
    }

    const option = await screen.findByTitle('Simples Nacional');
    await user.click(option);

    await user.click(screen.getByText('Cadastrar'));

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });
});
