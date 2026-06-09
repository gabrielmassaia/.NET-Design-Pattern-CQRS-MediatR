import { Skeleton, theme } from 'antd';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  valueStyle?: React.CSSProperties;
  loading?: boolean;
}

export function StatCard({ title, value, icon, valueStyle, loading = false }: StatCardProps) {
  const { token } = theme.useToken();
  const [hovered, setHovered] = useState(false);

  const accentColor = (valueStyle?.color as string) ?? '#4A7FC1';

  const card: React.CSSProperties = {
    background:    token.colorBgElevated,
    border:        `1px solid ${token.colorBorderSecondary}`,
    borderRadius:  14,
    padding:       '20px 20px 16px',
    cursor:        'default',
    position:      'relative',
    height:        '100%',
    transition:    'transform 0.15s ease-out, box-shadow 0.15s ease-out',
    transform:     hovered ? 'translateY(-1px)' : 'translateY(0)',
    boxShadow:     hovered ? '0 6px 24px rgba(0,0,0,0.30)' : 'none',
  };

  if (loading) {
    return (
      <div style={card}>
        <Skeleton active paragraph={{ rows: 2 }} title={false} />
      </div>
    );
  }

  return (
    <div
      style={card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position:  'absolute',
        top:       16,
        right:     18,
        fontSize:  18,
        color:     token.colorText,
        opacity:   0.25,
      }}>
        {icon}
      </div>
      <div style={{
        fontFamily:    "'DM Mono', monospace",
        fontSize:      10,
        fontWeight:    500,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color:         token.colorTextTertiary,
        marginBottom:  12,
      }}>
        {title}
      </div>
      <div style={{
        fontFamily:    "'Plus Jakarta Sans', sans-serif",
        fontSize:      34,
        fontWeight:    300,
        lineHeight:    1,
        letterSpacing: '-0.5px',
        color:         accentColor,
      }}>
        {value.toLocaleString('pt-BR')}
      </div>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize:   10,
        marginTop:  10,
        color:      token.colorTextTertiary,
        opacity:    0.8,
      }}>
        {value > 0 ? 'este mês' : '— sem dados'}
      </div>
    </div>
  );
}
