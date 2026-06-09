import { Typography, Table, Tag, theme } from 'antd';
import { SectionCard } from './SectionCard';
import { useAppTheme } from '@/context/ThemeContext';

const { Text, Paragraph } = Typography;

const PROJ_DATA = [
  { project: 'PainelObrigacoes.Api',             layer: 'Api',       deps: 'Application, IoC, Shared',                    resp: 'Minimal API endpoints, Middleware, Program.cs' },
  { project: 'PainelObrigacoes.Domain',           layer: 'Domain',    deps: 'Shared (apenas)',                              resp: 'Commands, Handlers, Models, Validators, Interfaces, Services, Events' },
  { project: 'PainelObrigacoes.Application',      layer: 'App',       deps: 'Domain, Shared',                               resp: 'AppServices, ViewModels, AutoMapper' },
  { project: 'PainelObrigacoes.Infrastructure.Data', layer: 'Infra',  deps: 'Domain',                                      resp: 'EF Core, Repositories, Migrations, Seed, Meilisearch, Event Handlers' },
  { project: 'PainelObrigacoes.Infrastructure.Services', layer: 'Infra', deps: 'Application',                                resp: 'Export CSV/PDF/XLSX (QuestPDF, ClosedXML)' },
  { project: 'PainelObrigacoes.Infrastructure.CrossCutting.IoC', layer: 'IoC', deps: 'Domain, App, Data, Services',          resp: 'ProjectBootstrapper, DI composition root' },
  { project: 'PainelObrigacoes.Shared',          layer: 'Shared',    deps: 'nenhuma',                                      resp: 'ResponseData<T>, ResponseErrorCode' },
];

const PROJ_COL = [
  { title: 'Projeto', dataIndex: 'project', key: 'project', render: (v: string) => <Text code style={{ fontSize: 11 }}>{v}</Text> },
  { title: 'Camada', dataIndex: 'layer', key: 'layer', render: (v: string) => {
    const colors: Record<string, string> = { Api: '#6c3483', Domain: '#2c3e50', App: '#1e8449', Infra: '#935116', IoC: '#922b21', Shared: '#7d6608' };
    return <Tag color={colors[v] || 'default'}>{v}</Tag>;
  }},
  { title: 'Dependências', dataIndex: 'deps', key: 'deps' },
  { title: 'Responsabilidade', dataIndex: 'resp', key: 'resp' },
];

const EP_DATA = [
  { group: 'Empresas', route: '/api/empresas', method: 'GET', description: 'Listar empresas (paginado)', handler: 'FindAllEmpresasAsync' },
  { group: 'Empresas', route: '/api/empresas', method: 'POST', description: 'Criar empresa + gerar obrigações', handler: 'CreateEmpresaAsync' },
  { group: 'Empresas', route: '/api/empresas/search', method: 'GET', description: 'Busca textual (Meilisearch)', handler: 'SearchEmpresasAsync' },
  { group: 'Empresas', route: '/api/empresas/{id}', method: 'DELETE', description: 'Soft delete empresa', handler: 'DeleteEmpresaAsync' },
  { group: 'Obrigações', route: '/api/obrigacoes', method: 'GET', description: 'Listar obrigações (filtros)', handler: 'FindObrigacoesAsync' },
  { group: 'Obrigações', route: '/api/obrigacoes/{id}/entrega', method: 'PATCH', description: 'Registrar entrega', handler: 'RegistrarEntregaAsync' },
  { group: 'Obrigações', route: '/api/obrigacoes/historico/{empresaId}', method: 'GET', description: 'Histórico de entregas', handler: 'GetHistoricoEmpresaAsync' },
  { group: 'Obrigações', route: '/api/obrigacoes/export', method: 'GET', description: 'Exportar CSV/PDF/XLSX', handler: 'ExportObrigacoesAsync' },
  { group: 'Dashboard', route: '/api/dashboard', method: 'GET', description: 'KPIs (cache 30s Redis)', handler: 'GetDashboardAsync' },
  { group: 'Dashboard', route: '/api/dashboard/alertas', method: 'GET', description: 'Alertas 30d (cache 60s)', handler: 'GetAlertasAsync' },
  { group: 'Dashboard', route: '/api/dashboard/export', method: 'GET', description: 'Exportar dashboard', handler: 'ExportDashboardAsync' },
  { group: 'Dashboard', route: '/api/dashboard/alertas/export', method: 'GET', description: 'Exportar alertas', handler: 'ExportAlertasAsync' },
  { group: 'Health', route: '/health', method: 'GET', description: 'Health check', handler: '—' },
];

const EP_COL = [
  { title: 'Grupo', dataIndex: 'group', key: 'group', render: (v: string) => <Tag>{v}</Tag> },
  { title: 'Rota', dataIndex: 'route', key: 'route', render: (v: string) => <Text code style={{ fontSize: 11 }}>{v}</Text> },
  { title: 'Método', dataIndex: 'method', key: 'method', render: (v: string) => {
    const c = v === 'GET' ? '#4CAF7D' : v === 'POST' ? '#4A7FC1' : v === 'PATCH' ? '#E8944A' : '#C0392B';
    return <span style={{ color: c, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{v}</span>;
  }},
  { title: 'Descrição', dataIndex: 'description', key: 'description' },
  { title: 'Handler', dataIndex: 'handler', key: 'handler', render: (v: string) => <Text code style={{ fontSize: 10 }}>{v}</Text> },
];

export function BackendSection() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';

  return (
    <SectionCard id="backend" icon="⚡" title="Backend" subtitle="7 Projetos .NET 9 · Minimal APIs · CQRS">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Projetos da Solução
        </div>
        <Table dataSource={PROJ_DATA} columns={PROJ_COL} pagination={false} size="small" rowKey="project" />
      </div>

      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Endpoints da API
        </div>
        <Table dataSource={EP_DATA} columns={EP_COL} pagination={false} size="small" rowKey="route" />
      </div>
    </SectionCard>
  );
}
