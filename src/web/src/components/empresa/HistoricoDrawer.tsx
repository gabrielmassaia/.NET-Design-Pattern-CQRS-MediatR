import { CheckCircleOutlined } from '@ant-design/icons';
import { Drawer, Empty, Grid, Spin, Timeline, Typography, theme } from 'antd';
import { useHistorico } from '@/hooks/useObrigacoes';
import type { Empresa } from '@/domain/types';
import { formatDate } from '@/utils/formatters';

const { useBreakpoint } = Grid;

interface HistoricoDrawerProps {
  empresa: Empresa | null;
  onClose: () => void;
}

export function HistoricoDrawer({ empresa, onClose }: HistoricoDrawerProps) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { data: historico = [], isLoading } = useHistorico(empresa?.id ?? '');
  const { token } = theme.useToken();

  return (
    <Drawer
      title={
        <div>
          <Typography.Text strong style={{ fontSize: 15 }}>Histórico de Entregas</Typography.Text>
          {empresa && (
            <Typography.Text
              type="secondary"
              style={{ fontSize: 13, display: 'block', marginTop: 2, fontWeight: 400 }}
            >
              {empresa.razaoSocial}
            </Typography.Text>
          )}
        </div>
      }
      open={!!empresa}
      onClose={onClose}
      width={isMobile ? '100%' : 480}
    >
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
          <Spin size="large" />
        </div>
      )}

      {!isLoading && historico.length === 0 && (
        <Empty
          description="Nenhuma obrigação entregue registrada."
          style={{ marginTop: 60 }}
        />
      )}

      {!isLoading && historico.length > 0 && (
        <Timeline
          style={{ marginTop: 8 }}
          items={historico.map((o) => ({
            color: '#2E7D32',
            dot: (
              <CheckCircleOutlined style={{ fontSize: 16, color: '#2E7D32' }} />
            ),
            children: (
              <div style={{
                background:   token.colorBgElevated,
                border:       `1px solid ${token.colorBorderSecondary}`,
                borderLeft:   `3px solid #2E7D32`,
                borderRadius: 8,
                padding:      '10px 14px',
                marginBottom: 4,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{
                    display:    'inline-flex',
                    alignItems: 'center',
                    padding:    '1px 8px',
                    borderRadius: 999,
                    background:  'rgba(21,101,192,0.10)',
                    border:      '1px solid rgba(21,101,192,0.20)',
                    color:       '#1565C0',
                    fontSize:    12,
                    fontWeight:  600,
                  }}>
                    {o.tipoNome}
                  </span>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    Competência: {formatDate(o.competencia)}
                  </Typography.Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                      Entregue em
                    </Typography.Text>
                    <Typography.Text strong style={{ fontSize: 14, color: '#2E7D32' }}>
                      {formatDate(o.dataEntrega)}
                    </Typography.Text>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                      Vencimento
                    </Typography.Text>
                    <Typography.Text style={{ fontSize: 13 }}>
                      {formatDate(o.dataVencimento)}
                    </Typography.Text>
                  </div>
                </div>
              </div>
            ),
          }))}
        />
      )}
    </Drawer>
  );
}
