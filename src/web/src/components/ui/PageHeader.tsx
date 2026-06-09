import { Space, Typography, theme } from 'antd';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  const { token } = theme.useToken();

  return (
    <div style={{
      display:       'flex',
      justifyContent:'space-between',
      alignItems:    'flex-start',
      marginBottom:  28,
      paddingBottom: 20,
      borderBottom:  `1px solid ${token.colorBorderSecondary}`,
    }}>
      <div style={{
        display:    'flex',
        alignItems: 'stretch',
        gap:        14,
      }}>
        <div style={{
          width:        4,
          borderRadius: 4,
          background:   `linear-gradient(180deg, ${token.colorPrimary}, ${token.colorInfo})`,
          flexShrink:   0,
          alignSelf:    'stretch',
          minHeight:    subtitle ? 44 : 28,
        }} />
        <div>
          <Typography.Title
            level={3}
            style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.25 }}
          >
            {title}
          </Typography.Title>
          {subtitle && (
            <Typography.Text
              type="secondary"
              style={{ fontSize: 14, marginTop: 3, display: 'block' }}
            >
              {subtitle}
            </Typography.Text>
          )}
        </div>
      </div>
      {actions && (
        <Space style={{ flexShrink: 0, marginTop: 2 }}>{actions}</Space>
      )}
    </div>
  );
}
