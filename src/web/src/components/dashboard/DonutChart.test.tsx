import { renderWithProviders, screen } from '@/test/render';
import { DonutChart } from './DonutChart';

describe('DonutChart', () => {
  it('renders total value in center', () => {
    renderWithProviders(<DonutChart segments={[]} total={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('OBRIGAÇÕES')).toBeInTheDocument();
  });

  it('renders svg with circle elements', () => {
    const { container } = renderWithProviders(
      <DonutChart
        segments={[
          { color: '#C0392B', value: 2 },
          { color: '#E8944A', value: 7 },
          { color: '#4CAF7D', value: 3 },
        ]}
        total={12}
      />,
    );
    const circles = container.querySelectorAll('circle');
    // background circle + 3 segment circles
    expect(circles.length).toBe(4);
  });

  it('renders no arcs when total is 0', () => {
    const { container } = renderWithProviders(
      <DonutChart segments={[{ color: '#C0392B', value: 0 }]} total={0} />,
    );
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(1);
  });
});
