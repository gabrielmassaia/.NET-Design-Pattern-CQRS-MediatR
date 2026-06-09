import { Card, Typography, theme } from 'antd';
import type { ReactNode } from 'react';
import { useAppTheme } from '@/context/ThemeContext';

const { Title } = Typography;

interface SectionCardProps {
  id: string;
  icon?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function SectionCard({ id, icon, title, subtitle, children }: SectionCardProps) {
  const { appTheme } = useAppTheme();
  const { token } = theme.useToken();
  const isDark = appTheme === 'dark';

  return (
    <section
      id={id}
      style={{
        scrollMarginTop: 80,
        marginBottom: 48,
      }}
    >
      <div style={{ marginBottom: 24 }}>
        {icon && (
          <span style={{ fontSize: 28, marginRight: 10 }}>{icon}</span>
        )}
        <Title
          level={2}
          style={{
            display: 'inline',
            fontFamily: "'DM Mono', monospace",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '-0.3px',
            color: isDark ? '#E8EAF0' : '#1A1A2E',
            margin: 0,
          }}
        >
          {title}
        </Title>
        {subtitle && (
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
            marginTop: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {subtitle}
          </div>
        )}
      </div>
      <Card
        style={{
          background: isDark ? '#161B27' : '#FFFFFF',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          borderRadius: 14,
          boxShadow: isDark
            ? '0 4px 24px rgba(0,0,0,0.2)'
            : '0 2px 12px rgba(0,0,0,0.04)',
        }}
        styles={{ body: { padding: '28px 32px' } }}
      >
        {children}
      </Card>
    </section>
  );
}
