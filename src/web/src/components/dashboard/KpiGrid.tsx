import { AlertOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { Grid } from 'antd';
import type { DashboardData } from '@/domain/types';
import { StatCard } from './StatCard';

const { useBreakpoint } = Grid;

interface KpiGridProps {
  dashboard: DashboardData | undefined;
  loading: boolean;
  periodLabel: string;
}

const KPI_ITEMS = [
  { title: 'Empresas',            key: 'totalEmpresas' as const, icon: <TeamOutlined />,             color: '#4A7FC1' },
  { title: 'Obrigações do Mês',  key: 'totalObrigacoesMes' as const, icon: <ClockCircleOutlined />, color: '#4A7FC1' },
  { title: 'Pendentes',           key: 'pendentes' as const,   icon: <ExclamationCircleOutlined />, color: '#E8944A' },
  { title: 'Atrasadas',           key: 'atrasadas' as const,   icon: <AlertOutlined />,             color: '#C0392B' },
  { title: 'Entregues',           key: 'entregues' as const,   icon: <CheckCircleOutlined />,       color: '#4CAF7D' },
];

const ALWAYS_GLOBAL = new Set(['totalEmpresas', 'atrasadas']);

export function KpiGrid({ dashboard, loading, periodLabel }: KpiGridProps) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <div style={{ display: 'flex', gap: 14, marginBottom: 32, flexWrap: 'wrap' }}>
      {KPI_ITEMS.map(({ title, key, icon, color }) => (
        <div key={title} style={{ flex: isMobile ? '0 0 calc(50% - 7px)' : '1 1 0', minWidth: isMobile ? 0 : 0 }}>
          <StatCard
            title={title}
            value={dashboard?.[key] ?? 0}
            icon={icon}
            valueStyle={{ color }}
            loading={loading}
            periodLabel={ALWAYS_GLOBAL.has(key) ? 'total acumulado' : periodLabel}
          />
        </div>
      ))}
    </div>
  );
}
