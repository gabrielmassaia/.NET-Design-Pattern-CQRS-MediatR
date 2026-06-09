import { CheckOutlined, ClearOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Empty, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Obrigacao } from '@/domain/types';
import { StatusObrigacao } from '@/domain/types';
import { formatDate } from '@/utils/formatters';
import { DataTable, StatusBadge } from '@/components/ui';

interface ObrigacaoTableProps {
  data: Obrigacao[];
  loading: boolean;
  statusFiltro: StatusObrigacao | null;
  isRegistrando: boolean;
  onRegistrar: (id: string) => void;
  onLimparStatus: () => void;
}

export function ObrigacaoTable({
  data,
  loading,
  statusFiltro,
  isRegistrando,
  onRegistrar,
  onLimparStatus,
}: ObrigacaoTableProps) {
  const columns: ColumnsType<Obrigacao> = [
    {
      title: 'Obrigação',
      dataIndex: 'tipoNome',
      key: 'tipoNome',
      render: (nome: string) => <Typography.Text strong>{nome}</Typography.Text>,
    },
    {
      title: 'Competência',
      dataIndex: 'competencia',
      key: 'competencia',
      render: (val: string) => formatDate(val),
    },
    {
      title: 'Vencimento',
      dataIndex: 'dataVencimento',
      key: 'dataVencimento',
      render: (val: string) => formatDate(val),
      sorter: (a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime(),
    },
    {
      title: 'Entregue em',
      dataIndex: 'dataEntrega',
      key: 'dataEntrega',
      render: (val?: string) => formatDate(val),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'Ação',
      key: 'acao',
      width: 140,
      render: (_, record) =>
        record.status !== StatusObrigacao.Entregue ? (
          <Button size="small" type="primary" icon={<CheckOutlined />}
            loading={isRegistrando} onClick={() => onRegistrar(record.id)}>
            Registrar
          </Button>
        ) : (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>Concluída</Typography.Text>
        ),
    },
  ];

  const emptyContent = (
    <Empty
      image={<InboxOutlined style={{ fontSize: 48, color: '#8A98AA' }} />}
      imageStyle={{ height: 56 }}
      description={
        <div style={{ textAlign: 'center' }}>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            Sem resultados para os filtros selecionados
          </Typography.Text>
          {statusFiltro !== null && (
            <Button size="small" icon={<ClearOutlined />} onClick={onLimparStatus}>
              Limpar filtro de status
            </Button>
          )}
        </div>
      }
    />
  );

  return (
    <DataTable<Obrigacao>
      columns={columns}
      data={data}
      loading={loading}
      pagination={false}
      emptyText={emptyContent}
      rowClassName={(record) => {
        if (record.status === StatusObrigacao.Atrasada) return 'row-atrasada';
        if (record.status === StatusObrigacao.Entregue) return 'row-entregue';
        return '';
      }}
    />
  );
}
