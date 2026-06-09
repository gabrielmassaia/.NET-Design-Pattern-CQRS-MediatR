import { renderWithProviders, screen } from '@/test/render';
import { ChartCard } from './ChartCard';

describe('ChartCard', () => {
  it('renders label text', () => {
    renderWithProviders(<ChartCard label="Test Label">Content</ChartCard>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderWithProviders(<ChartCard label="Label"><span>Child Content</span></ChartCard>);
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('has section-label class on the label', () => {
    renderWithProviders(<ChartCard label="Metrics">Content</ChartCard>);
    const labelDiv = screen.getByText('Metrics').closest('div');
    expect(labelDiv).toHaveClass('section-label');
  });
});
