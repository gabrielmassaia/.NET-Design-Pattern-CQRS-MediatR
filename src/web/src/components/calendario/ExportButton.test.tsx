import { renderWithProviders, screen } from '@/test/render';
import { ExportButton } from './ExportButton';

describe('ExportButton', () => {
  it('renders CSV and PDF buttons', () => {
    renderWithProviders(
      <ExportButton
        params={{ empresaId: '1', ano: 2026, mes: 6 }}
        disabled={false}
      />,
    );
    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('disables buttons when disabled prop is true', () => {
    renderWithProviders(
      <ExportButton
        params={{ empresaId: '1', ano: 2026, mes: 6 }}
        disabled
      />,
    );
    expect(screen.getByText('CSV').closest('button')).toBeDisabled();
    expect(screen.getByText('PDF').closest('button')).toBeDisabled();
  });
});
