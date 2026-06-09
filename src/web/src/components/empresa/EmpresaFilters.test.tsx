import { renderWithProviders, screen, userEvent } from '@/test/render';
import { EmpresaFilters } from './EmpresaFilters';

describe('EmpresaFilters', () => {
  it('renders search input with placeholder', () => {
    renderWithProviders(<EmpresaFilters onSearch={vi.fn()} />);
    expect(
      screen.getByPlaceholderText(/buscar por razão social/i),
    ).toBeInTheDocument();
  });

  it('calls onSearch when typing', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<EmpresaFilters onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/buscar por razão social/i);
    await user.type(input, 'ab');

    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(onSearch).toHaveBeenCalledWith('ab');
  });
});
