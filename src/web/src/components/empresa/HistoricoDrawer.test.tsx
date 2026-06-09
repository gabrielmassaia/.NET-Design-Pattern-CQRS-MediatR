import { renderWithProviders, screen } from '@/test/render';
import { HistoricoDrawer } from './HistoricoDrawer';
import { RegimeTributario } from '@/domain/types';

describe('HistoricoDrawer', () => {
  it('renders drawer with empresa name when open', () => {
    renderWithProviders(
      <HistoricoDrawer
        empresa={{ id: '1', cnpj: '00', razaoSocial: 'Empresa X', regime: RegimeTributario.SimplesNacional, createdAt: '2026-01-01T00:00:00Z' }}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText('Histórico de Entregas')).toBeInTheDocument();
    expect(screen.getByText('Empresa X')).toBeInTheDocument();
  });

  it('does not render drawer when empresa is null', () => {
    renderWithProviders(<HistoricoDrawer empresa={null} onClose={vi.fn()} />);
    expect(screen.queryByText('Histórico de Entregas')).not.toBeInTheDocument();
  });
});
