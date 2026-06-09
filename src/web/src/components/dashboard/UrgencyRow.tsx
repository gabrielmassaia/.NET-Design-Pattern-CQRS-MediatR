import { useState } from 'react';

interface UrgencyRowProps {
  color: string;
  label: string;
  count: number;
  max: number;
}

export function UrgencyRow({ color, label, count, max }: UrgencyRowProps) {
  const [hovered, setHovered] = useState(false);
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;

  return (
    <div
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          10,
        padding:      '8px 10px',
        borderRadius: 8,
        background:   hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        transition:   'background 0.15s ease-out',
        cursor:       'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{
        flex:       1,
        fontSize:   12.5,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color:      'rgba(232,234,240,0.60)',
      }}>
        {label}
      </span>
      <div style={{ width: '44%', background: 'rgba(255,255,255,0.06)', borderRadius: 999, height: 4, overflow: 'hidden', flexShrink: 0 }}>
        <div style={{
          width:        `${pct}%`,
          height:       '100%',
          background:   color,
          borderRadius: 999,
          transition:   'width 0.5s ease',
        }} />
      </div>
      <span style={{
        fontFamily:   "'DM Mono', monospace",
        fontSize:     10.5,
        color,
        background:   color + '15',
        border:       `1px solid ${color}28`,
        padding:      '1px 8px',
        borderRadius: 999,
        minWidth:     30,
        textAlign:    'center',
        flexShrink:   0,
      }}>
        {count}
      </span>
    </div>
  );
}
