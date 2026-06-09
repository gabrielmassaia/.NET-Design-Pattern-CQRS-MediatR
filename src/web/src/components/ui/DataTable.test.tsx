import { Typography } from 'antd';
import { renderWithProviders, screen } from '@/test/render';
import { DataTable } from './DataTable';

interface TestRow { id: string; name: string; }

describe('DataTable', () => {
  const columns = [
    { title: 'Nome', dataIndex: 'name', key: 'name' as const,
      render: (val: string) => <Typography.Text>{val}</Typography.Text> },
  ];

  it('renders data rows', () => {
    const data: TestRow[] = [
      { id: '1', name: 'Item A' },
      { id: '2', name: 'Item B' },
    ];
    renderWithProviders(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    renderWithProviders(<DataTable columns={columns} data={[]} />);
    const noDataElements = screen.getAllByText('No data');
    expect(noDataElements.length).toBeGreaterThan(0);
  });

  it('renders custom empty text', () => {
    renderWithProviders(
      <DataTable columns={columns} data={[]} emptyText={<span>Nada aqui</span>} />,
    );
    expect(screen.getByText('Nada aqui')).toBeInTheDocument();
  });

  it('shows loading indicator', () => {
    renderWithProviders(<DataTable columns={columns} data={[]} loading />);
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('renders total label in pagination', () => {
    const data: TestRow[] = Array.from({ length: 12 }, (_, i) => ({
      id: `${i}`, name: `Item ${i}`,
    }));
    renderWithProviders(<DataTable columns={columns} data={data} totalLabel="itens" />);
    expect(screen.getByText('12 itens')).toBeInTheDocument();
  });

  it('hides pagination when false', () => {
    renderWithProviders(<DataTable columns={columns} data={[]} pagination={false} />);
    expect(document.querySelector('.ant-pagination')).not.toBeInTheDocument();
  });
});
