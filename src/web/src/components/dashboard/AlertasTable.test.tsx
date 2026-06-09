import { renderWithProviders, screen } from '@/test/render';
import { AlertasTable } from './AlertasTable';
import { StatusObrigacao } from '@/domain/types';

describe('AlertasTable', () => {
  it('renders alerta rows with company info', () => {
    renderWithProviders(
      <AlertasTable
        data={[
          {
            id: 'a1',
            empresaId: '1',
            razaoSocial: 'Empresa Exemplo Ltda',
            cnpj: '11222333000181',
            tipoNome: 'DAS',
            dataVencimento: '2026-07-20',
            diasRestantes: 13,
            status: StatusObrigacao.Pendente,
          },
        ]}
        loading={false}
      />,
    );
    expect(screen.getByText('Empresa Exemplo Ltda')).toBeInTheDocument();
    expect(screen.getByText('DAS')).toBeInTheDocument();
    expect(screen.getByText('13d restantes')).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('renders overdue pill for negative dias', () => {
    renderWithProviders(
      <AlertasTable
        data={[
          {
            id: 'a2',
            empresaId: '1',
            razaoSocial: 'A',
            cnpj: '00',
            tipoNome: 'DCTF',
            dataVencimento: '2026-06-01',
            diasRestantes: -5,
            status: StatusObrigacao.Atrasada,
          },
        ]}
        loading={false}
      />,
    );
    expect(screen.getByText('5d em atraso')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const { container } = renderWithProviders(
      <AlertasTable data={[]} loading />,
    );
    expect(container.querySelector('.ant-spin')).toBeInTheDocument();
  });
});
