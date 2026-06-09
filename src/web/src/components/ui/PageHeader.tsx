import { Grid, Space, Typography, theme } from 'antd';
import type { ReactNode } from 'react';

const { useBreakpoint } = Grid;

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  const { token } = theme.useToken();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <div style={{
      display:       'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent:'space-between',
      alignItems:    isMobile ? 'stretch' : 'flex-start',
      gap:           isMobile ? 12 : 0,
      marginBottom:  isMobile ? 20 : 28,
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
            style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.25, fontSize: isMobile ? 20 : undefined }}
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
        <Space style={{ flexShrink: 0, marginTop: 2, alignSelf: isMobile ? 'flex-start' : 'center' }}>{actions}</Space>
      )}
    </div>
  );
}
