import { Typography, Table, Tag, theme } from 'antd';
import { SectionCard } from './SectionCard';
import { useAppTheme } from '@/context/ThemeContext';

const { Text } = Typography;

const BACKEND_DATA = [
  { layer: 'Runtime',      tech: '.NET 9 / ASP.NET Core',         purpose: 'Plataforma principal da API' },
  { layer: 'ORM',          tech: 'EF Core 9 / Npgsql',            purpose: 'Acesso a dados PostgreSQL' },
  { layer: 'CQRS',         tech: 'MediatR 12',                    purpose: 'Commands/Queries + Pipeline Behaviors' },
  { layer: 'Validação',    tech: 'FluentValidation 11',           purpose: 'Validação de entrada no pipeline' },
  { layer: 'Mapping',      tech: 'AutoMapper 13',                 purpose: 'ViewModel ↔ Domain mapping' },
  { layer: 'Cache',        tech: 'StackExchange.Redis',           purpose: 'Dashboard caching' },
  { layer: 'Search',       tech: 'Meilisearch .NET Client',       purpose: 'Full-text company search' },
  { layer: 'Testes',       tech: 'xUnit + Moq + FluentAssertions',purpose: 'Testes unitários e de integração' },
  { layer: 'Rate Limiting',tech: 'System.Threading.RateLimiting', purpose: 'Rate limit nativo .NET 9' },
];

const FRONTEND_DATA = [
  { layer: 'Framework',  tech: 'React 19 + TypeScript 5',         purpose: 'UI declarativa tipada' },
  { layer: 'Build',      tech: 'Vite 6',                          purpose: 'Bundler e dev server' },
  { layer: 'UI Kit',     tech: 'Ant Design 5 + @ant-design/icons',purpose: 'Componentes de interface' },
  { layer: 'State',      tech: 'TanStack Query 5',                purpose: 'Server state + cache + polling' },
  { layer: 'HTTP',       tech: 'Axios 1.9',                       purpose: 'Cliente HTTP com interceptors' },
  { layer: 'Router',     tech: 'React Router 7',                  purpose: 'Navegação SPA' },
  { layer: 'Date',       tech: 'Dayjs',                           purpose: 'Manipulação de datas' },
  { layer: 'Style',      tech: 'Tailwind CSS 4 + Ant Design',     purpose: 'Estilização utilitária' },
  { layer: 'Testes',     tech: 'Vitest + Testing Library + MSW',  purpose: 'Testes unitários e mocks' },
  { layer: 'Fonts',      tech: 'DM Mono + Plus Jakarta Sans',     purpose: 'Fontes tipográficas' },
];

const INFRA_DATA = [
  { service: 'PostgreSQL 16',    role: 'Banco de dados principal',        port: 5432 },
  { service: 'Redis 7',          role: 'Cache de dashboard/alertas',      port: 6379 },
  { service: 'Meilisearch 1.9',  role: 'Motor de busca textual',          port: 7700 },
  { service: '.NET 9 API',       role: 'API REST (Minimal APIs)',         port: 8080 },
  { service: 'Nginx + React',    role: 'SPA + Reverse Proxy + SSL',       port: '80 / 443' },
];

const COL = [
  { title: 'Camada', dataIndex: 'layer', key: 'layer', render: (v: string) => <Text code style={{ fontSize: 12 }}>{v}</Text> },
  { title: 'Tecnologia', dataIndex: 'tech', key: 'tech' },
  { title: 'Propósito', dataIndex: 'purpose', key: 'purpose' },
];

const INFRA_COL = [
  { title: 'Serviço', dataIndex: 'service', key: 'service', render: (v: string) => <Text strong>{v}</Text> },
  { title: 'Função', dataIndex: 'role', key: 'role' },
  { title: 'Porta', dataIndex: 'port', key: 'port', render: (v: string | number) => <Tag>{v}</Tag> },
];

export function TechStackSection() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';
  const t = (c: string) => isDark ? c : c;

  return (
    <SectionCard id="tech-stack" icon="⚙" title="Stack Tecnológica" subtitle="Backend · Frontend · Infraestrutura">
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Backend
      </div>
      <Table
        dataSource={BACKEND_DATA}
        columns={COL}
        pagination={false}
        size="small"
        rowKey="layer"
        style={{ marginBottom: 28 }}
      />

      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Frontend
      </div>
      <Table
        dataSource={FRONTEND_DATA}
        columns={COL}
        pagination={false}
        size="small"
        rowKey="layer"
        style={{ marginBottom: 28 }}
      />

      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Infraestrutura (Docker Compose)
      </div>
      <Table
        dataSource={INFRA_DATA}
        columns={INFRA_COL}
        pagination={false}
        size="small"
        rowKey="service"
      />
    </SectionCard>
  );
}
