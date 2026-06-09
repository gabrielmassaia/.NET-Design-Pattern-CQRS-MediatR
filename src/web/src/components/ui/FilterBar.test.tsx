import { renderWithProviders, screen, userEvent } from '@/test/render';
import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  it('renders search input and fires onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithProviders(
      <FilterBar
        filters={[
          { key: 'busca', type: 'search', placeholder: 'Buscar...' },
        ]}
        values={{}}
        onChange={onChange}
      />,
    );

    const input = screen.getByPlaceholderText('Buscar...');
    await user.type(input, 'test');
    expect(onChange).toHaveBeenLastCalledWith('busca', 't');
    expect(onChange).toHaveBeenCalled();
  });

  it('renders select filter with options', () => {
    renderWithProviders(
      <FilterBar
        filters={[
          {
            key: 'status',
            type: 'select',
            placeholder: 'Selecione',
            options: [
              { value: 1, label: 'Ativo' },
              { value: 2, label: 'Inativo' },
            ],
          },
        ]}
        values={{}}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Selecione')).toBeInTheDocument();
  });

  it('renders month picker filter', () => {
    renderWithProviders(
      <FilterBar
        filters={[{ key: 'mes', type: 'month' }]}
        values={{}}
        onChange={vi.fn()}
      />,
    );

    expect(document.querySelector('.ant-picker')).toBeInTheDocument();
  });
});
