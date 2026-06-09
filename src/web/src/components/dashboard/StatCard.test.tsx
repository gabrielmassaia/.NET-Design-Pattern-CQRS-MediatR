import { TeamOutlined } from '@ant-design/icons';
import { renderWithProviders, screen } from '@/test/render';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('renders title and formatted value', () => {
    renderWithProviders(
      <StatCard title="Empresas" value={1234} icon={<TeamOutlined />} />,
    );
    expect(screen.getByText('Empresas')).toBeInTheDocument();
    expect(screen.getByText('1.234')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    const { container } = renderWithProviders(
      <StatCard title="Empresas" value={0} icon={<TeamOutlined />} loading />,
    );
    expect(container.querySelector('.ant-skeleton')).toBeInTheDocument();
  });

  it('shows "sem dados" when value is 0', () => {
    renderWithProviders(
      <StatCard title="Vazio" value={0} icon={<TeamOutlined />} />,
    );
    expect(screen.getByText('— sem dados')).toBeInTheDocument();
  });

  it('shows "este mês" when value is positive', () => {
    renderWithProviders(
      <StatCard title="Empresas" value={5} icon={<TeamOutlined />} />,
    );
    expect(screen.getByText('este mês')).toBeInTheDocument();
  });
});
