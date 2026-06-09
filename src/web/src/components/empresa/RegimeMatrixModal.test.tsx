import { renderWithProviders, screen } from '@/test/render';
import { RegimeMatrixModal } from './RegimeMatrixModal';

describe('RegimeMatrixModal', () => {
  it('renders modal title when open', () => {
    renderWithProviders(<RegimeMatrixModal open onClose={vi.fn()} />);
    expect(screen.getByText('Matriz de Obrigações por Regime Tributário')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProviders(<RegimeMatrixModal open={false} onClose={vi.fn()} />);
    expect(screen.queryByText('Matriz de Obrigações por Regime Tributário')).not.toBeInTheDocument();
  });

  it('renders obligation data in the table', () => {
    renderWithProviders(<RegimeMatrixModal open onClose={vi.fn()} />);
    expect(screen.getByText('DAS')).toBeInTheDocument();
    expect(screen.getByText('eSocial')).toBeInTheDocument();
    expect(screen.getByText('DIRF')).toBeInTheDocument();
    expect(screen.getByText('SPED_ECD')).toBeInTheDocument();
  });

  it('renders regime columns in table', () => {
    renderWithProviders(<RegimeMatrixModal open onClose={vi.fn()} />);
    expect(screen.getByText('Simples Nacional')).toBeInTheDocument();
    expect(screen.getByText('Lucro Presumido')).toBeInTheDocument();
    expect(screen.getByText('Lucro Real')).toBeInTheDocument();
  });

  it('renders period tags for obligations', () => {
    renderWithProviders(<RegimeMatrixModal open onClose={vi.fn()} />);
    const mensalTags = screen.getAllByText('Mensal');
    expect(mensalTags.length).toBeGreaterThan(0);
    const anualTags = screen.getAllByText('Anual');
    expect(anualTags.length).toBeGreaterThan(0);
  });
});
