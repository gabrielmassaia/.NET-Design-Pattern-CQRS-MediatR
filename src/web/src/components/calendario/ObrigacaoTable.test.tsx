import { renderWithProviders, screen } from '@/test/render';
import { ObrigacaoTable } from './ObrigacaoTable';
import { StatusObrigacao, TipoObrigacao } from '@/domain/types';

describe('ObrigacaoTable', () => {
  it('renders obligation rows', () => {
    renderWithProviders(
      <ObrigacaoTable
        data={[
          {
            id: 'o1', empresaId: '1', tipo: TipoObrigacao.DAS, tipoNome: 'DAS',
            competencia: '2026-06-01T00:00:00Z', dataVencimento: '2026-07-20',
            status: StatusObrigacao.Pendente,
          },
        ]}
        loading={false}
        statusFiltro={null}
        isRegistrando={false}
        onRegistrar={vi.fn()}
        onLimparStatus={vi.fn()}
      />,
    );
    expect(screen.getByText('DAS')).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('renders "Concluída" for delivered obligations', () => {
    renderWithProviders(
      <ObrigacaoTable
        data={[
          {
            id: 'o2', empresaId: '1', tipo: TipoObrigacao.DAS, tipoNome: 'DAS',
            competencia: '2026-05-01T00:00:00Z', dataVencimento: '2026-06-20',
            dataEntrega: '2026-06-18', status: StatusObrigacao.Entregue,
          },
        ]}
        loading={false}
        statusFiltro={null}
        isRegistrando={false}
        onRegistrar={vi.fn()}
        onLimparStatus={vi.fn()}
      />,
    );
    expect(screen.getByText('Concluída')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /registrar/i })).not.toBeInTheDocument();
  });

  it('shows empty state with clear button when status filter active', () => {
    renderWithProviders(
      <ObrigacaoTable
        data={[]}
        loading={false}
        statusFiltro={StatusObrigacao.Atrasada}
        isRegistrando={false}
        onRegistrar={vi.fn()}
        onLimparStatus={vi.fn()}
      />,
    );
    expect(screen.getByText('Sem resultados para os filtros selecionados')).toBeInTheDocument();
    expect(screen.getByText('Limpar filtro de status')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const { container } = renderWithProviders(
      <ObrigacaoTable
        data={[]}
        loading
        statusFiltro={null}
        isRegistrando={false}
        onRegistrar={vi.fn()}
        onLimparStatus={vi.fn()}
      />,
    );
    expect(container.querySelector('.ant-spin')).toBeInTheDocument();
  });
});
