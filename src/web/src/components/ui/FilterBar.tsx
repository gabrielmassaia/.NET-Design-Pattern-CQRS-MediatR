import { SearchOutlined } from '@ant-design/icons';
import { Col, DatePicker, Input, Row, Select, theme } from 'antd';
import type { Dayjs } from 'dayjs';

export type FilterType = 'search' | 'select' | 'month';

export interface SelectOption {
  value: string | number | null;
  label: string;
}

export interface FilterConfig {
  key: string;
  type: FilterType;
  placeholder?: string;
  options?: SelectOption[];
  allowClear?: boolean;
  showSearch?: boolean;
  loading?: boolean;
  span?: { xs?: number; md?: number };
}

interface FilterBarProps {
  filters: FilterConfig[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export function FilterBar({ filters, values, onChange }: FilterBarProps) {
  const { token } = theme.useToken();

  return (
    <div style={{
      background:   token.colorBgElevated,
      border:       `1px solid ${token.colorBorderSecondary}`,
      borderRadius: 12,
      padding:      '16px 20px',
      marginBottom: 24,
    }}>
      <Row gutter={[16, 12]}>
        {filters.map((f) => (
          <Col key={f.key} xs={f.span?.xs ?? 24} md={f.span?.md ?? 8}>
            {f.type === 'search' && (
              <Input
                size="middle"
                prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
                placeholder={f.placeholder}
                value={(values[f.key] as string) ?? ''}
                onChange={(e) => onChange(f.key, e.target.value)}
                allowClear={f.allowClear ?? true}
              />
            )}
            {f.type === 'select' && (
              <Select
                size="middle"
                placeholder={f.placeholder}
                options={f.options ?? []}
                value={(values[f.key] as string | number | null | undefined) ?? undefined}
                onChange={(v) => onChange(f.key, v)}
                style={{ width: '100%' }}
                showSearch={f.showSearch ?? false}
                optionFilterProp="label"
                allowClear={f.allowClear ?? false}
                loading={f.loading ?? false}
              />
            )}
            {f.type === 'month' && (
              <DatePicker
                size="middle"
                picker="month"
                value={(values[f.key] as Dayjs | null) ?? null}
                onChange={(d) => onChange(f.key, d)}
                format="MM/YYYY"
                style={{ width: '100%' }}
                allowClear={f.allowClear ?? false}
              />
            )}
          </Col>
        ))}
      </Row>
    </div>
  );
}
