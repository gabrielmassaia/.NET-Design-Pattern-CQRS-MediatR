import { Table } from 'antd';
import type { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table';
import type { ReactNode } from 'react';

interface DataTableProps<T extends object> {
  columns: ColumnsType<T>;
  data: T[];
  loading?: boolean;
  rowKey?: string | ((row: T) => string);
  pagination?: false | Omit<TablePaginationConfig, 'showTotal'>;
  rowClassName?: (row: T) => string;
  scroll?: TableProps<T>['scroll'];
  size?: 'small' | 'middle' | 'large';
  totalLabel?: string;
  emptyText?: ReactNode;
}

export function DataTable<T extends object>({
  columns,
  data,
  loading = false,
  rowKey = 'id',
  pagination,
  rowClassName,
  scroll,
  size = 'middle',
  totalLabel = 'registros',
  emptyText,
}: DataTableProps<T>) {
  const paginationConfig: false | TablePaginationConfig =
    pagination === false
      ? false
      : {
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (total) => `${total} ${totalLabel}`,
          ...pagination,
        };

  return (
    <Table<T>
      className="ea-table"
      columns={columns}
      dataSource={data}
      rowKey={rowKey}
      loading={loading}
      size={size}
      pagination={paginationConfig}
      rowClassName={rowClassName}
      scroll={scroll ?? { x: 'max-content' }}
      locale={emptyText !== undefined ? { emptyText } : undefined}
    />
  );
}
