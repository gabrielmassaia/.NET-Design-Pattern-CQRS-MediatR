import { renderWithProviders, screen } from '@/test/render';
import { EmpresaTable } from './EmpresaTable';
import { RegimeTributario } from '@/domain/types';

describe('EmpresaTable', () => {
  const empresas = [
    { id: '1', cnpj: '11222333000181', razaoSocial: 'Empresa A', regime: RegimeTributario.SimplesNacional, createdAt: '2026-01-15T10:00:00Z' },
    { id: '2', cnpj: '44555666000199', razaoSocial: 'Empresa B', regime: RegimeTributario.LucroPresumido, createdAt: '2026-03-20T10:00:00Z' },
  ];

  it('renders company rows with formatted data', () => {
    renderWithProviders(
      <EmpresaTable
        data={empresas}
        loading={false}
        onDelete={vi.fn()}
        isDeleting={false}
        onHistorico={vi.fn()}
      />,
    );
    expect(screen.getByText('Empresa A')).toBeInTheDocument();
    expect(screen.getByText('Empresa B')).toBeInTheDocument();
    expect(screen.getByText('Simples Nacional')).toBeInTheDocument();
    expect(screen.getByText('Lucro Presumido')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const { container } = renderWithProviders(
      <EmpresaTable
        data={[]}
        loading
        onDelete={vi.fn()}
        isDeleting={false}
        onHistorico={vi.fn()}
      />,
    );
    expect(container.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('calls onHistorico when history button clicked', async () => {
    const onHistorico = vi.fn();
    const user = (await import('@/test/render')).userEvent.setup();

    renderWithProviders(
      <EmpresaTable
        data={empresas}
        loading={false}
        onDelete={vi.fn()}
        isDeleting={false}
        onHistorico={onHistorico}
      />,
    );

    const historyBtns = screen.getAllByRole('button', { name: 'history' });
    await user.click(historyBtns[0]);
    expect(onHistorico).toHaveBeenCalledWith(empresas[0]);
  });
});
