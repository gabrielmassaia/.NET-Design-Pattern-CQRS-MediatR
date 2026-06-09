import { AlertOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, TeamOutlined } from '@ant-design/icons';
import type { DashboardData } from '@/domain/types';
import { StatCard } from './StatCard';

interface KpiGridProps {
  dashboard: DashboardData | undefined;
  loading: boolean;
}

const KPI_ITEMS = [
  { title: 'Empresas',            key: 'totalEmpresas' as const, icon: <TeamOutlined />,             color: '#4A7FC1' },
  { title: 'Obrigações do Mês',  key: 'totalObrigacoesMes' as const, icon: <ClockCircleOutlined />, color: '#4A7FC1' },
  { title: 'Pendentes',           key: 'pendentes' as const,   icon: <ExclamationCircleOutlined />, color: '#E8944A' },
  { title: 'Atrasadas',           key: 'atrasadas' as const,   icon: <AlertOutlined />,             color: '#C0392B' },
  { title: 'Entregues',           key: 'entregues' as const,   icon: <CheckCircleOutlined />,       color: '#4CAF7D' },
];

export function KpiGrid({ dashboard, loading }: KpiGridProps) {
  return (
    <div style={{ display: 'flex', gap: 14, marginBottom: 32, flexWrap: 'nowrap' }}>
      {KPI_ITEMS.map(({ title, key, icon, color }) => (
        <div key={title} style={{ flex: 1, minWidth: 0 }}>
          <StatCard
            title={title}
            value={dashboard?.[key] ?? 0}
            icon={icon}
            valueStyle={{ color }}
            loading={loading}
          />
        </div>
      ))}
    </div>
  );
}
