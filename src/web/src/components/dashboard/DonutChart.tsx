interface DonutSeg { color: string; value: number; }

interface DonutChartProps { segments: DonutSeg[]; total: number; }

export function DonutChart({ segments, total }: DonutChartProps) {
  const size  = 148;
  const cx    = size / 2;
  const cy    = size / 2;
  const r     = 52;
  const sw    = 16;
  const circ  = 2 * Math.PI * r;
  const GAP   = 4;

  let offset = GAP / 2;
  const arcs = total === 0 ? null : segments.map((seg, i) => {
    const fullArc = (seg.value / total) * circ;
    const dash    = Math.max(0, fullArc - GAP);
    const el = (
      <circle
        key={i}
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth={sw}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={-offset}
        strokeLinecap="butt"
        style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
      />
    );
    offset += fullArc;
    return el;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={sw}
      />
      {arcs}
      <text
        x={cx} y={cy - 5}
        textAnchor="middle"
        fontSize="28"
        fontWeight="300"
        fontFamily="'DM Mono', monospace"
        fill="#E8EAF0"
      >
        {total}
      </text>
      <text
        x={cx} y={cy + 13}
        textAnchor="middle"
        fontSize="8.5"
        fontFamily="'DM Mono', monospace"
        fill="rgba(232,234,240,0.38)"
        style={{ textTransform: 'uppercase' }}
      >
        OBRIGAÇÕES
      </text>
    </svg>
  );
}
