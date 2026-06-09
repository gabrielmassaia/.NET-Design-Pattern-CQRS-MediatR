import { renderWithProviders, screen } from '@/test/render';
import { CalendarFilters } from './CalendarFilters';
import { RegimeTributario } from '@/domain/types';
import dayjs from 'dayjs';

describe('CalendarFilters', () => {
  it('renders month picker and status filter', () => {
    renderWithProviders(
      <CalendarFilters
        empresas={[
          { id: '1', cnpj: '00', razaoSocial: 'Empresa A', regime: RegimeTributario.SimplesNacional, createdAt: '2026-01-01T00:00:00Z' },
        ]}
        values={{ empresaId: '', competencia: dayjs(), status: null }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Todos os status')).toBeInTheDocument();
    expect(document.querySelector('.ant-picker')).toBeInTheDocument();
  });
});
