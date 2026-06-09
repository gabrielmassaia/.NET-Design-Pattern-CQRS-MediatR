import { DownloadOutlined } from '@ant-design/icons';
import { Button, message, theme } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui';
import { KpiGrid, AlertasChart, AlertasTable } from '@/components/dashboard';
import { useAlertas, useDashboard } from '@/hooks';
import { dashboardService } from '@/application/services';
import { ExportFormato } from '@/domain/types';
import { triggerDownload } from '@/shared/utils/export';

export default function DashboardPage() {
  const [searchParams] = useSearchParams();
  const showOnlyAlertas = searchParams.get('alertas') === '1';

  const { data: dashboard, isLoading: loadingDash } = useDashboard();
  const { data: alertas = [], isLoading: loadingAlertas } = useAlertas();
  const [isExporting, setIsExporting] = useState(false);
  const { token } = theme.useToken();

  const timestamp = dayjs().format('HH:mm');

  async function handleExportAlertas(formato: ExportFormato) {
    setIsExporting(true);
    try {
      const blob = await dashboardService.exportAlertas(formato);
      const now = new Date();
      triggerDownload(blob, `alertas-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.${formato}`);
    } catch {
      message.error('Erro ao exportar alertas. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportDashboard(formato: ExportFormato) {
    setIsExporting(true);
    try {
      const blob = await dashboardService.exportDashboard(formato);
      const now = new Date();
      triggerDownload(blob, `dashboard-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.${formato}`);
    } catch {
      message.error('Erro ao exportar dashboard. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  }

  const hasAlertas = alertas.length > 0;

  const alertasExportButtons = (
    <Button.Group>
      <Button icon={<DownloadOutlined />} loading={isExporting} disabled={!hasAlertas} onClick={() => handleExportAlertas(ExportFormato.CSV)}>CSV</Button>
      <Button icon={<DownloadOutlined />} loading={isExporting} disabled={!hasAlertas} onClick={() => handleExportAlertas(ExportFormato.PDF)}>PDF</Button>
    </Button.Group>
  );

  if (showOnlyAlertas) {
    return (
      <>
        <PageHeader
          title="Painel de Alertas"
          subtitle="Obrigações vencendo nos próximos 30 dias e já atrasadas"
          actions={alertasExportButtons}
        />
        <AlertasTable data={alertas} loading={loadingAlertas} />
      </>
    );
  }

  const dashboardExportButtons = (
    <Button.Group>
      <Button icon={<DownloadOutlined />} loading={isExporting} disabled={!hasAlertas} onClick={() => handleExportDashboard(ExportFormato.CSV)}>CSV</Button>
      <Button icon={<DownloadOutlined />} loading={isExporting} disabled={!hasAlertas} onClick={() => handleExportDashboard(ExportFormato.PDF)}>PDF</Button>
    </Button.Group>
  );

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <PageHeader
            title="Dashboard"
            subtitle="Visão consolidada do mês atual"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          <div style={{
            fontFamily:    "'DM Mono', monospace",
            fontSize:      11,
            color:         token.colorTextTertiary,
            paddingTop:    4,
            letterSpacing: '0.06em',
          }}>
            Atualizado às {timestamp}
          </div>
          {dashboardExportButtons}
        </div>
      </div>

      <KpiGrid dashboard={dashboard} loading={loadingDash} />

      <div style={{
        display:     'flex',
        alignItems:  'center',
        gap:         12,
        marginBottom: 18,
      }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: token.colorTextTertiary }}>
          Visão de Alertas
        </div>
        <div style={{ flex: 1, height: 1, background: token.colorBorderSecondary }} />
      </div>

      <AlertasChart
        alertas={alertas}
        dashboard={dashboard}
        loadingAlertas={loadingAlertas}
        loadingDash={loadingDash}
      />
    </>
  );
}
