import { Typography, Table, theme } from 'antd';
import { SectionCard } from './SectionCard';
import { MermaidDiagram } from './MermaidDiagram';
import { useAppTheme } from '@/context/ThemeContext';

const { Text, Paragraph } = Typography;

const FE_FLOW = `graph LR
    Page["📄 Page<br/>Dashboard / Empresas / Calendário"] --> Hook["🎣 Hook<br/>TanStack Query"]
    Hook --> Service["📡 Service<br/>Extends BaseService"]
    Service --> Axios["🌐 Axios<br/>api/axios-client"]
    Axios --> API["⚡ REST API"]

    Hook --> Query["📊 useQuery<br/>data fetching"]
    Hook --> Mutation["✏️ useMutation<br/>create/update/delete"]

    Mutation -->|onSuccess| Inval["🔄 Invalidate Cache"]
    Inval --> Query`;

const ROUTES = `graph LR
    subgraph "React Router 7"
        Root["/"] --> Redirect["→ /dashboard"]
        Dashboard["/dashboard"] --> DBPage["DashboardPage<br/>KPIs + Alertas + Export"]
        Empresas["/empresas"] --> EmpPage["EmpresasPage<br/>CRUD + Busca + Histórico"]
        Calendario["/calendario"] --> CalPage["CalendarioPage<br/>Filtros + Registro + Export"]
    end

    Dashboard -->|"?alertas=1"| Alertas["Full-screen Alertas"]`;

const PAGE_DATA = [
  { page: 'Dashboard', route: '/dashboard', purpose: 'KPIs consolidados (5 cards), gráfico de alertas (donut + urgência), exportação', hooks: 'useDashboard, useAlertas', features: 'Polling 30s, cache Redis, tema claro/escuro' },
  { page: 'Empresas', route: '/empresas', purpose: 'CRUD completo, busca full-text com debounce 300ms, histórico de entregas', hooks: 'useEmpresas, useCreateEmpresa, useDeleteEmpresa, useEmpresaSearch', features: 'Meilisearch, soft delete, timeline de entregas' },
  { page: 'Calendário', route: '/calendario', purpose: 'Filtro por empresa/mês/status, registro de entrega, export CSV/PDF/XLSX', hooks: 'useObrigacoes, useRegistrarEntrega, useHistorico', features: 'Status dinâmico, row version concorrência, color-coded rows' },
];

const PAGECOLS = [
  { title: 'Página', dataIndex: 'page', key: 'page', render: (v: string) => <Text strong>{v}</Text> },
  { title: 'Rota', dataIndex: 'route', key: 'route', render: (v: string) => <Text code style={{ fontSize: 12 }}>{v}</Text> },
  { title: 'Propósito', dataIndex: 'purpose', key: 'purpose' },
  { title: 'Hooks', dataIndex: 'hooks', key: 'hooks' },
  { title: 'Diferenciais', dataIndex: 'features', key: 'features' },
];

export function FrontendSection() {
  const { appTheme } = useAppTheme();
  const { token } = theme.useToken();
  const isDark = appTheme === 'dark';

  return (
    <SectionCard id="frontend" icon="🖥" title="Frontend" subtitle="React 19 · Vite 6 · Ant Design 5 · TanStack Query 5">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Arquitetura Frontend
        </div>
        <MermaidDiagram chart={FE_FLOW} />
        <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, marginTop: 12, lineHeight: 1.7 }}>
          Toda comunicação com a API passa por hooks do TanStack Query → services → Axios.
          Nenhum componente chama HTTP diretamente. Mutations invalidam o cache automaticamente.
        </Paragraph>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Páginas e Rotas
        </div>
        <MermaidDiagram chart={ROUTES} />
      </div>

      <div>
        <Table dataSource={PAGE_DATA} columns={PAGECOLS} pagination={false} size="small" rowKey="page" />
      </div>
    </SectionCard>
  );
}
