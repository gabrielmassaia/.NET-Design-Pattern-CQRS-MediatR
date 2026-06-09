import { Grid, theme } from 'antd';

const { useBreakpoint } = Grid;

interface DonutSeg { color: string; value: number; }

interface DonutChartProps { segments: DonutSeg[]; total: number; }

export function DonutChart({ segments, total }: DonutChartProps) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { token } = theme.useToken();

  const size  = isMobile ? 100 : 148;
  const cx    = size / 2;
  const cy    = size / 2;
  const r     = isMobile ? 36 : 52;
  const sw    = isMobile ? 12 : 16;
  const circ  = 2 * Math.PI * r;
  const GAP   = isMobile ? 3 : 4;

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
        stroke={token.colorBorderSecondary}
        strokeWidth={sw}
      />
      {arcs}
      <text
        x={cx} y={cy - (isMobile ? 3 : 5)}
        textAnchor="middle"
        fontSize={isMobile ? '20' : '28'}
        fontWeight="300"
        fontFamily="'DM Mono', monospace"
        fill={token.colorText}
      >
        {total}
      </text>
      <text
        x={cx} y={cy + (isMobile ? 10 : 13)}
        textAnchor="middle"
        fontSize={isMobile ? '7' : '8.5'}
        fontFamily="'DM Mono', monospace"
        fill={token.colorTextTertiary}
        style={{ textTransform: 'uppercase' }}
      >
        OBRIGAÇÕES
      </text>
    </svg>
  );
}
