import { CheckCircleOutlined } from '@ant-design/icons';
import { Grid, Skeleton, theme } from 'antd';
import { useMemo } from 'react';
import type { Alerta, DashboardData } from '@/domain/types';
import { DonutChart } from './DonutChart';
import { LegendChip } from './LegendChip';
import { UrgencyRow } from './UrgencyRow';
import { ChartCard } from './ChartCard';

const { useBreakpoint } = Grid;

const COLOR_DANGER  = '#C0392B';
const COLOR_EMBER   = '#E8944A';
const COLOR_SAGE    = '#4CAF7D';
const COLOR_COBALT  = '#4A7FC1';

interface AlertasChartProps {
  alertas: Alerta[];
  dashboard: DashboardData | undefined;
  loadingAlertas: boolean;
  loadingDash: boolean;
  periodLabel: string;
}

export function AlertasChart({ alertas, dashboard, loadingAlertas, loadingDash, periodLabel }: AlertasChartProps) {
  const { token } = theme.useToken();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const buckets = useMemo(() => ({
    atrasado: alertas.filter((a) => a.diasRestantes < 0).length,
    critico:  alertas.filter((a) => a.diasRestantes >= 0  && a.diasRestantes <= 7).length,
    proximo:  alertas.filter((a) => a.diasRestantes >= 8  && a.diasRestantes <= 15).length,
    emBreve:  alertas.filter((a) => a.diasRestantes >= 16).length,
  }), [alertas]);

  const maxBucket = Math.max(buckets.atrasado, buckets.critico, buckets.proximo, buckets.emBreve, 1);

  const pendentes = dashboard?.pendentes           ?? 0;
  const atrasadas = dashboard?.atrasadas           ?? 0;
  const entregues = dashboard?.entregues           ?? 0;
  const total     = dashboard?.totalObrigacoesMes  ?? 0;

  const donutSegs = [
    { color: COLOR_DANGER, value: atrasadas },
    { color: COLOR_EMBER,  value: pendentes },
    { color: COLOR_SAGE,   value: entregues },
  ];

  const safePct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  const loadingCard = (
    <div style={{
      background: token.colorBgElevated,
      border: `1px solid ${token.colorBorderSecondary}`,
      borderRadius: 14,
      padding: '22px 24px',
      flex: 1,
    }}>
      <Skeleton active paragraph={{ rows: 4 }} />
    </div>
  );

  if (loadingDash || loadingAlertas) {
    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', flexWrap: 'wrap' }}>
        {loadingCard}
        {loadingCard}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', flexWrap: 'wrap' }}>
      <ChartCard label={`Situação das Obrigações — ${periodLabel}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ flexShrink: 0 }}>
            <DonutChart segments={donutSegs} total={total} />
          </div>
          <div style={{ flex: 1 }}>
            {total === 0 ? (
              <p style={{ fontSize: 13, color: token.colorTextTertiary, margin: 0 }}>
                Nenhuma obrigação no mês
              </p>
            ) : (
              <>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: token.colorTextTertiary, marginBottom: 6 }}>
                    Distribuição
                  </div>
                  <div style={{ display: 'flex', height: 6, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
                    {donutSegs.filter(s => s.value > 0).map((s, i) => (
                      <div key={i} style={{
                        flex: s.value,
                        background: s.color,
                        borderRadius: 999,
                        opacity: 0.85,
                      }} />
                    ))}
                  </div>
                </div>
                {[
                  { color: COLOR_DANGER, label: 'Atrasadas', count: atrasadas },
                  { color: COLOR_EMBER,  label: 'Pendentes', count: pendentes },
                  { color: COLOR_SAGE,   label: 'Entregues', count: entregues },
                ].map(({ color, label, count }) => (
                  <div key={label} style={{
                    display:       'flex',
                    alignItems:    'center',
                    gap:           8,
                    paddingBottom: 6,
                    marginBottom:  6,
                    borderBottom:  `1px solid ${token.colorBorderSecondary}`,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 12, color: token.colorTextSecondary }}>{label}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color, fontWeight: 500 }}>{count}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: token.colorTextTertiary, minWidth: 28, textAlign: 'right' }}>
                      {safePct(count)}%
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {total > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 18, paddingTop: 14, borderTop: `1px solid ${token.colorBorderSecondary}` }}>
            <LegendChip color={COLOR_DANGER} label="Atrasadas" count={atrasadas} pct={safePct(atrasadas)} />
            <LegendChip color={COLOR_EMBER}  label="Pendentes" count={pendentes} pct={safePct(pendentes)} />
            <LegendChip color={COLOR_SAGE}   label="Entregues" count={entregues} pct={safePct(entregues)} />
          </div>
        )}
      </ChartCard>

      <ChartCard label="Alertas por Urgência">
        {alertas.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 32, gap: 10 }}>
            <CheckCircleOutlined style={{ fontSize: 32, color: COLOR_SAGE, opacity: 0.8 }} />
            <span style={{ fontSize: 13, color: token.colorTextTertiary }}>
              Nenhuma obrigação pendente ou atrasada
            </span>
          </div>
        ) : (
          <div style={{ marginTop: 4 }}>
            <UrgencyRow color={COLOR_DANGER} label="Em atraso"           count={buckets.atrasado} max={maxBucket} />
            <UrgencyRow color={COLOR_EMBER}  label="Crítico (1–7 dias)"  count={buckets.critico}  max={maxBucket} />
            <UrgencyRow color={COLOR_COBALT} label="Próximo (8–15 dias)" count={buckets.proximo}  max={maxBucket} />
            <UrgencyRow color={COLOR_SAGE}   label="Em breve (16–30 d)"  count={buckets.emBreve}  max={maxBucket} />
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${token.colorBorderSecondary}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: token.colorTextTertiary }}>
                Total de Alertas
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 400, color: token.colorText }}>
                {alertas.length}
              </span>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: token.colorTextTertiary, marginTop: 8, textAlign: 'right', opacity: 0.7 }}>
              obrigações atrasadas + vencimento ≤ 30 dias
            </div>
          </div>
        )}
      </ChartCard>
    </div>
  );
}
