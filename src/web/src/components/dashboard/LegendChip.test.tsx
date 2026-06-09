import { renderWithProviders, screen } from '@/test/render';
import { LegendChip } from './LegendChip';

describe('LegendChip', () => {
  it('renders label and counts', () => {
    renderWithProviders(<LegendChip color="#4CAF7D" label="Entregues" count={10} pct={50} />);
    expect(screen.getByText('Entregues')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('renders with zero values', () => {
    renderWithProviders(<LegendChip color="#C0392B" label="Atrasadas" count={0} pct={0} />);
    expect(screen.getByText('Atrasadas')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('renders color indicator dot', () => {
    renderWithProviders(<LegendChip color="#D4A843" label="Pendentes" count={5} pct={25} />);
    const dot = document.querySelector('span[style*="border-radius: 50%"]');
    expect(dot).toBeInTheDocument();
  });
});
