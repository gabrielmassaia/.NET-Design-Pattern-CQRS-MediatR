import { renderWithProviders, screen, userEvent, waitFor } from '@/test/render';
import { ExportButton } from './ExportButton';
import { ExportFormato } from '@/domain/types';

const mockExportObrigacoes = vi.fn();
const mockTriggerDownload = vi.fn();

vi.mock('@/application/services', () => ({
  obrigacaoService: {
    exportObrigacoes: (...args: unknown[]) => mockExportObrigacoes(...args),
  },
}));

vi.mock('@/shared/utils/export', () => ({
  triggerDownload: (...args: unknown[]) => mockTriggerDownload(...args),
}));

describe('ExportButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders CSV and PDF buttons', () => {
    renderWithProviders(
      <ExportButton params={{ empresaId: '1', ano: 2026, mes: 6 }} disabled={false} />,
    );
    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('disables buttons when disabled prop is true', () => {
    renderWithProviders(
      <ExportButton params={{ empresaId: '1', ano: 2026, mes: 6 }} disabled />,
    );
    expect(screen.getByText('CSV').closest('button')).toBeDisabled();
    expect(screen.getByText('PDF').closest('button')).toBeDisabled();
  });

  it('calls export and triggers download on CSV click', async () => {
    const blob = new Blob(['csv']);
    mockExportObrigacoes.mockResolvedValueOnce(blob);

    const user = userEvent.setup();
    renderWithProviders(
      <ExportButton params={{ empresaId: '1', ano: 2026, mes: 6 }} disabled={false} />,
    );

    await user.click(screen.getByText('CSV'));

    await waitFor(() => {
      expect(mockExportObrigacoes).toHaveBeenCalledWith({
        empresaId: '1', ano: 2026, mes: 6, formato: ExportFormato.CSV,
      });
      expect(mockTriggerDownload).toHaveBeenCalledWith(blob, 'obrigacoes-2026-06.csv');
    });
  });

  it('calls export and triggers download on PDF click', async () => {
    const blob = new Blob(['pdf']);
    mockExportObrigacoes.mockResolvedValueOnce(blob);

    const user = userEvent.setup();
    renderWithProviders(
      <ExportButton params={{ empresaId: '1', ano: 2026, mes: 6 }} disabled={false} />,
    );

    await user.click(screen.getByText('PDF'));

    await waitFor(() => {
      expect(mockExportObrigacoes).toHaveBeenCalledWith({
        empresaId: '1', ano: 2026, mes: 6, formato: ExportFormato.PDF,
      });
      expect(mockTriggerDownload).toHaveBeenCalledWith(blob, 'obrigacoes-2026-06.pdf');
    });
  });
});
