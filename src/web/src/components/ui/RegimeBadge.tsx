import {
  BarChartOutlined,
  BankOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { RegimeTributario } from '@/domain/types';

interface RegimeBadgeProps { regime: RegimeTributario; }

type RegimeConfig = {
  color: string;
  bg: string;
  border: string;
  label: string;
  icon: React.ReactNode;
};

const REGIME_CONFIG: Record<RegimeTributario, RegimeConfig> = {
  [RegimeTributario.SimplesNacional]: {
    color:  '#007A8A',
    bg:     'rgba(0,172,193,0.10)',
    border: 'rgba(0,172,193,0.22)',
    label:  'Simples Nacional',
    icon:   <ThunderboltOutlined />,
  },
  [RegimeTributario.LucroPresumido]: {
    color:  '#1565C0',
    bg:     'rgba(30,136,229,0.10)',
    border: 'rgba(30,136,229,0.22)',
    label:  'Lucro Presumido',
    icon:   <BarChartOutlined />,
  },
  [RegimeTributario.LucroReal]: {
    color:  '#0D47A1',
    bg:     'rgba(13,71,161,0.10)',
    border: 'rgba(13,71,161,0.22)',
    label:  'Lucro Real',
    icon:   <BankOutlined />,
  },
  [RegimeTributario.ImunidadeIsencao]: {
    color:  '#2E7D32',
    bg:     'rgba(46,125,50,0.10)',
    border: 'rgba(46,125,50,0.22)',
    label:  'Imunidade / Isenção',
    icon:   <SafetyOutlined />,
  },
};

export function RegimeBadge({ regime }: RegimeBadgeProps) {
  const cfg = REGIME_CONFIG[regime] ?? {
    color: '#7A8794', bg: 'rgba(122,135,148,0.10)', border: 'rgba(122,135,148,0.18)',
    label: '—', icon: null,
  };

  return (
    <span style={{
      display:    'inline-flex',
      alignItems: 'center',
      gap:        5,
      padding:    '2px 9px',
      borderRadius: 999,
      background:   cfg.bg,
      border:       `1px solid ${cfg.border}`,
      color:        cfg.color,
      fontSize:     12,
      fontWeight:   600,
      lineHeight:   '1.5',
      whiteSpace:   'nowrap',
    }}>
      <span style={{ fontSize: 11 }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}
