import { Button, Space, Table, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { Tag as TagType } from '@/domain/types';

interface Props {
  data: TagType[];
  loading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function TagTable({ data, loading, onDelete, isDeleting }: Props) {
  return (
    <Table
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={false}
      columns={[
        {
          title: 'Nome',
          dataIndex: 'nome',
          key: 'nome',
          render: (nome: string, record: TagType) => (
            <Tag color={record.cor}>{nome}</Tag>
          ),
        },
        {
          title: 'Cor',
          dataIndex: 'cor',
          key: 'cor',
          render: (cor: string) => (
            <Space>
              <span
                style={{
                  display: 'inline-block',
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: cor,
                  border: '1px solid #d9d9d9',
                }}
              />
              {cor}
            </Space>
          ),
        },
        {
          title: 'Ações',
          key: 'acoes',
          width: 100,
          render: (_: unknown, record: TagType) => (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              loading={isDeleting}
              onClick={() => onDelete(record.id)}
            />
          ),
        },
      ]}
    />
  );
}
