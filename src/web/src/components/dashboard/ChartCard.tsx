import { theme } from 'antd';
import type { ReactNode } from 'react';

interface ChartCardProps { label: string; children: ReactNode; }

export function ChartCard({ children, label }: ChartCardProps) {
  const { token } = theme.useToken();
  return (
    <div style={{
      flex:         1,
      background:   token.colorBgElevated,
      border:       `1px solid ${token.colorBorderSecondary}`,
      borderRadius: 14,
      padding:      '22px 24px',
    }}>
      <div className="section-label">{label}</div>
      {children}
    </div>
  );
}
