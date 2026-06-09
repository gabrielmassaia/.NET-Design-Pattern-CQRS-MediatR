import { renderWithProviders, screen } from '@/test/render';
import { UrgencyRow } from './UrgencyRow';

describe('UrgencyRow', () => {
  it('renders label and count', () => {
    renderWithProviders(<UrgencyRow color="#C0392B" label="Em atraso" count={3} max={10} />);
    expect(screen.getByText('Em atraso')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
