import { WarningOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Alerta } from '@/domain/types';
import { formatCnpj, formatDate } from '@/utils/formatters';
import { DataTable, StatusBadge } from '@/components/ui';

interface AlertasTableProps { data: Alerta[]; loading: boolean; }

function DiasPill({ dias }: { dias: number }) {
  let color: string;
  let bg: string;
  let border: string;
  let label: string;
  let icon: React.ReactNode = null;

  if (dias < 0) {
    color  = '#C62828';
    bg     = 'rgba(198,40,40,0.10)';
    border = 'rgba(198,40,40,0.20)';
    label  = `${Math.abs(dias)}d em atraso`;
  } else if (dias <= 7) {
    color  = '#E65100';
    bg     = 'rgba(245,127,23,0.12)';
    border = 'rgba(245,127,23,0.25)';
    label  = `${dias}d restantes`;
    icon   = <WarningOutlined style={{ fontSize: 11 }} />;
  } else {
    color  = '#2E7D32';
    bg     = 'rgba(46,125,50,0.10)';
    border = 'rgba(46,125,50,0.20)';
    label  = `${dias}d restantes`;
  }

  return (
    <span style={{
      display:    'inline-flex',
      alignItems: 'center',
      gap:        4,
      padding:    '2px 9px',
      borderRadius: 999,
      background:   bg,
      border:       `1px solid ${border}`,
      color,
      fontSize:   12,
      fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>
      {icon}
      {label}
    </span>
  );
}

const columns: ColumnsType<Alerta> = [
  {
    title: 'Empresa',
    dataIndex: 'razaoSocial',
    key: 'razaoSocial',
    render: (nome: string, record: Alerta) => (
      <div>
        <Typography.Text strong style={{ display: 'block' }}>{nome}</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12, fontFamily: 'monospace' }}>
          {formatCnpj(record.cnpj)}
        </Typography.Text>
      </div>
    ),
  },
  {
    title: 'Obrigação',
    dataIndex: 'tipoNome',
    key: 'tipoNome',
    render: (nome: string) => (
      <Typography.Text strong style={{ fontSize: 13 }}>{nome}</Typography.Text>
    ),
  },
  {
    title: 'Vencimento',
    dataIndex: 'dataVencimento',
    key: 'dataVencimento',
    render: (val: string) => (
      <Typography.Text style={{ fontSize: 13 }}>{formatDate(val)}</Typography.Text>
    ),
    sorter: (a: Alerta, b: Alerta) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime(),
  },
  {
    title: 'Urgência',
    dataIndex: 'diasRestantes',
    key: 'diasRestantes',
    render: (dias: number) => <DiasPill dias={dias} />,
    sorter: (a: Alerta, b: Alerta) => a.diasRestantes - b.diasRestantes,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <StatusBadge status={status} />,
  },
];

export function AlertasTable({ data, loading }: AlertasTableProps) {
  return (
    <DataTable<Alerta>
      columns={columns}
      data={data}
      loading={loading}
      totalLabel="alertas"
      rowClassName={(record) => record.diasRestantes < 0 ? 'row-atrasada' : ''}
    />
  );
}
