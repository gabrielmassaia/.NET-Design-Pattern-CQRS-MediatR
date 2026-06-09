interface LegendChipProps {
  color: string;
  label: string;
  count: number;
  pct: number;
}

export function LegendChip({ color, label, count, pct }: LegendChipProps) {
  return (
    <div style={{
      display:      'inline-flex',
      alignItems:   'center',
      gap:          5,
      padding:      '4px 10px',
      borderRadius: 999,
      background:   color + '18',
      border:       `1px solid ${color}28`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: 'rgba(232,234,240,0.70)' }}>
        {label}
      </span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color, fontWeight: 500 }}>
        {count}
      </span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(232,234,240,0.35)' }}>
        {pct}%
      </span>
    </div>
  );
}
