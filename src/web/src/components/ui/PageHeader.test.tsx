import { Button } from 'antd';
import { renderWithProviders, screen } from '@/test/render';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders title and subtitle', () => {
    renderWithProviders(<PageHeader title="Dashboard" subtitle="Visão geral" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Visão geral')).toBeInTheDocument();
  });

  it('renders without subtitle', () => {
    renderWithProviders(<PageHeader title="Apenas título" />);
    expect(screen.getByText('Apenas título')).toBeInTheDocument();
    expect(screen.queryByText('Visão geral')).not.toBeInTheDocument();
  });

  it('renders actions slot', () => {
    renderWithProviders(
      <PageHeader title="Com ações" actions={<Button>Ação</Button>} />,
    );
    expect(screen.getByRole('button', { name: 'Ação' })).toBeInTheDocument();
  });
});
