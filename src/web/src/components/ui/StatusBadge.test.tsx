import { StatusObrigacao } from '@/domain/types';
import { renderWithProviders, screen } from '@/test/render';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it.each([
    { status: StatusObrigacao.Pendente, label: 'Pendente' },
    { status: StatusObrigacao.Atrasada, label: 'Atrasada' },
    { status: StatusObrigacao.Entregue, label: 'Entregue' },
    { status: StatusObrigacao.NaoAplicavel, label: 'Não Aplicável' },
  ])('renders $label for status $status', ({ status, label }) => {
    renderWithProviders(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('renders with lg size', () => {
    renderWithProviders(<StatusBadge status={StatusObrigacao.Pendente} size="lg" />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });
});
