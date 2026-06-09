import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { StatusObrigacao } from '@/domain/types';

interface StatusBadgeProps {
  status: StatusObrigacao;
  size?: 'sm' | 'lg';
}

type StatusConfig = {
  color: string;
  bg: string;
  border: string;
  label: string;
  icon: React.ReactNode;
};

const STATUS_CONFIG: Record<StatusObrigacao, StatusConfig> = {
  [StatusObrigacao.Pendente]: {
    color:  '#1565C0',
    bg:     'rgba(21,101,192,0.10)',
    border: 'rgba(21,101,192,0.20)',
    label:  'Pendente',
    icon:   <ClockCircleOutlined />,
  },
  [StatusObrigacao.Atrasada]: {
    color:  '#C62828',
    bg:     'rgba(198,40,40,0.10)',
    border: 'rgba(198,40,40,0.20)',
    label:  'Atrasada',
    icon:   <ExclamationCircleOutlined />,
  },
  [StatusObrigacao.Entregue]: {
    color:  '#2E7D32',
    bg:     'rgba(46,125,50,0.10)',
    border: 'rgba(46,125,50,0.20)',
    label:  'Entregue',
    icon:   <CheckCircleOutlined />,
  },
  [StatusObrigacao.NaoAplicavel]: {
    color:  '#7A8794',
    bg:     'rgba(122,135,148,0.10)',
    border: 'rgba(122,135,148,0.18)',
    label:  'Não Aplicável',
    icon:   <MinusCircleOutlined />,
  },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG[StatusObrigacao.NaoAplicavel];
  const isLg = size === 'lg';

  return (
    <span style={{
      display:       'inline-flex',
      alignItems:    'center',
      gap:           5,
      padding:       isLg ? '4px 12px' : '2px 9px',
      borderRadius:  999,
      background:    cfg.bg,
      border:        `1px solid ${cfg.border}`,
      color:         cfg.color,
      fontSize:      isLg ? 13 : 12,
      fontWeight:    600,
      lineHeight:    '1.5',
      whiteSpace:    'nowrap',
      letterSpacing: '0.01em',
    }}>
      <span style={{ fontSize: isLg ? 12 : 11 }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}
