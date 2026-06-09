import { CalendarOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Tooltip, Typography, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Empresa } from '@/domain/types';
import { formatCnpj, formatDate } from '@/utils/formatters';
import { DataTable, RegimeBadge } from '@/components/ui';

interface EmpresaTableProps {
  data: Empresa[];
  loading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onHistorico: (empresa: Empresa) => void;
}

export function EmpresaTable({ data, loading, onDelete, isDeleting, onHistorico }: EmpresaTableProps) {
  const { token } = theme.useToken();

  const columns: ColumnsType<Empresa> = [
    {
      title: 'Razão Social',
      dataIndex: 'razaoSocial',
      key: 'razaoSocial',
      sorter: (a, b) => a.razaoSocial.localeCompare(b.razaoSocial),
      render: (nome: string) => (
        <Typography.Text strong style={{ fontSize: 13 }}>{nome}</Typography.Text>
      ),
    },
    {
      title: 'CNPJ',
      dataIndex: 'cnpj',
      key: 'cnpj',
      render: (cnpj: string) => (
        <Typography.Text
          copyable={{ text: cnpj }}
          style={{
            fontFamily:  '"JetBrains Mono", "Fira Code", monospace',
            fontSize:    13,
            color:       token.colorTextSecondary,
            letterSpacing: '0.02em',
          }}
        >
          {formatCnpj(cnpj)}
        </Typography.Text>
      ),
    },
    {
      title: 'Regime',
      dataIndex: 'regime',
      key: 'regime',
      render: (regime) => <RegimeBadge regime={regime} />,
      filters: [
        { text: 'Simples Nacional',   value: 1 },
        { text: 'Lucro Presumido',    value: 2 },
        { text: 'Lucro Real',         value: 3 },
        { text: 'Imunidade/Isenção',  value: 4 },
      ],
      onFilter: (value, record) => record.regime === value,
    },
    {
      title: 'Cadastro',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val: string) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: token.colorTextSecondary, fontSize: 13 }}>
          <CalendarOutlined style={{ fontSize: 12 }} />
          {formatDate(val)}
        </span>
      ),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Ações',
      key: 'acoes',
      width: 100,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Histórico de entregas">
            <Button
              type="text"
              icon={<HistoryOutlined />}
              style={{ color: token.colorPrimary }}
              onClick={() => onHistorico(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Remover empresa?"
            description="Todas as obrigações vinculadas também serão removidas."
            onConfirm={() => onDelete(record.id)}
            okText="Sim, remover"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} loading={isDeleting} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <DataTable<Empresa>
      columns={columns}
      data={data}
      loading={loading}
      totalLabel="empresas"
    />
  );
}
