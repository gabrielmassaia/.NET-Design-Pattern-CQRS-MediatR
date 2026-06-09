import { Typography, Table, Tag, Row, Col, theme } from 'antd';
import { SectionCard } from './SectionCard';
import { MermaidDiagram } from './MermaidDiagram';
import { useAppTheme } from '@/context/ThemeContext';

const { Text, Paragraph } = Typography;

const TEST_PYRAMID = `graph LR
    subgraph "Pirâmide de Testes"
        E2E["🧪 Testes E2E<br/>(futuro: Playwright)"]
        INT["🔗 Testes Integração<br/>4 arquivos - WebApplicationFactory"]
        UNIT["✅ Testes Unitários<br/>163 backend + 174 frontend"]
    end

    style E2E fill:#fadbd8,stroke:#922b21,color:#000
    style INT fill:#fdebd0,stroke:#935116,color:#000
    style UNIT fill:#d5f5e3,stroke:#1e8449,color:#000`;

const BTEST_DATA = [
  { area: 'Domain', files: '~24', focus: 'Handlers, Validators, TributaryRulesEngine, DueDateCalculator, HolidayProvider, BusinessDayAdjuster', framework: 'xUnit + Moq + FluentAssertions' },
  { area: 'Application', files: '~8', focus: 'AppServices, AutoMapper, CachedDashboard decorator, Event Handlers', framework: 'xUnit + Moq + FluentAssertions' },
  { area: 'Infrastructure.Data', files: '~5', focus: 'Repositories, MeilisearchService, YearRolloverService', framework: 'xUnit + Moq + EF Core InMemory' },
  { area: 'Infrastructure.Services', files: '~4', focus: 'Export CSV/PDF/XLSX, CSV Injection sanitization', framework: 'xUnit + Moq + FluentAssertions' },
  { area: 'Shared', files: '~2', focus: 'ResponseData envelope, ResultExtensions', framework: 'xUnit + FluentAssertions' },
  { area: 'Integration', files: '4', focus: 'Todos endpoints via TestWebApplicationFactory', framework: 'xUnit + WebApplicationFactory + MemoryCache + NoOp Meili' },
];

const FRTEST_DATA = [
  { area: 'Components', files: '~20', focus: 'DataTable, FilterBar, StatusBadge, RegimeBadge, KpiGrid, DonutChart, AlertasChart, StatCard, UrgencyRow, AppSidebar, RegimeMatrixModal, EmpresaForm, etc.', framework: 'Vitest + Testing Library + MSW' },
  { area: 'Hooks', files: '~6', focus: 'useEmpresas, useObrigacoes, useDashboard (invalidação, loading, erro)', framework: 'Vitest + MSW' },
  { area: 'Pages', files: '~6', focus: 'Dashboard (KPI, alertas, export), Empresas (CRUD, busca), Calendário (filtros, registro)', framework: 'Vitest + Testing Library + MSW' },
  { area: 'Services', files: '~4', focus: 'Empresa, Dashboard, Obrigacao, BaseService', framework: 'Vitest + MSW' },
  { area: 'Utils', files: '~2', focus: 'Formatters, export/triggerDownload, query-keys', framework: 'Vitest' },
  { area: 'Infrastructure', files: '~2', focus: 'axios-client, ThemeContext', framework: 'Vitest' },
];

const BTEST_COL = [
  { title: 'Camada', dataIndex: 'area', key: 'area', render: (v: string) => <Tag>{v}</Tag> },
  { title: 'Arquivos', dataIndex: 'files', key: 'files' },
  { title: 'Foco dos Testes', dataIndex: 'focus', key: 'focus' },
  { title: 'Framework', dataIndex: 'framework', key: 'framework' },
];

export function TestsSection() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';

  return (
    <SectionCard id="tests" icon="✅" title="Testes" subtitle="338 testes · Backend: xUnit · Frontend: Vitest · Cobertura CI">
      <div style={{ marginBottom: 24 }}>
        <MermaidDiagram chart={TEST_PYRAMID} />
      </div>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <div style={{
            background: isDark ? 'rgba(76,175,125,0.08)' : 'rgba(76,175,125,0.06)',
            borderRadius: 10,
            padding: '16px 20px',
            textAlign: 'center',
            border: `1px solid ${isDark ? 'rgba(76,175,125,0.15)' : 'rgba(76,175,125,0.1)'}`,
          }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#4CAF7D', fontFamily: "'DM Mono', monospace" }}>163</div>
            <div style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', marginTop: 4 }}>Testes Backend (xUnit)</div>
          </div>
        </Col>
        <Col span={12}>
          <div style={{
            background: isDark ? 'rgba(74,127,193,0.08)' : 'rgba(74,127,193,0.06)',
            borderRadius: 10,
            padding: '16px 20px',
            textAlign: 'center',
            border: `1px solid ${isDark ? 'rgba(74,127,193,0.15)' : 'rgba(74,127,193,0.1)'}`,
          }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#4A7FC1', fontFamily: "'DM Mono', monospace" }}>174</div>
            <div style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', marginTop: 4 }}>Testes Frontend (Vitest) — 87.68% coverage</div>
          </div>
        </Col>
      </Row>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Backend — Testes Unitários
        </div>
        <Table dataSource={BTEST_DATA} columns={BTEST_COL} pagination={false} size="small" rowKey="area" style={{ marginBottom: 16 }} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Frontend — Testes Unitários
        </div>
        <Table dataSource={FRTEST_DATA} columns={[
          { title: 'Área', dataIndex: 'area', key: 'area', render: (v: string) => <Tag>{v}</Tag> },
          { title: 'Arquivos', dataIndex: 'files', key: 'files' },
          { title: 'Foco dos Testes', dataIndex: 'focus', key: 'focus' },
          { title: 'Framework', dataIndex: 'framework', key: 'framework' },
        ]} pagination={false} size="small" rowKey="area" />
      </div>

      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          CI Pipeline (GitHub Actions)
        </div>
        <div style={{
          background: isDark ? '#0F1117' : '#F5F5F5',
          borderRadius: 8,
          padding: '16px 20px',
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          lineHeight: 1.8,
          color: isDark ? '#E8EAF0' : '#1A1A2E',
        }}>
          <span style={{ color: '#888' }}># Trigger: push/PR → main</span>{'\n'}
          <span style={{ color: '#4A7FC1' }}>backend</span>:{'\n'}
          {'  '}dotnet restore → dotnet build → dotnet test --collect:"XPlat Code Coverage"{'\n'}
          {'  '}dotnet test (integration tests){'\n'}
          <span style={{ color: '#4CAF7D' }}>frontend</span>:{'\n'}
          {'  '}npm ci → npm run lint → npm run test:coverage → npm run build
        </div>
      </div>
    </SectionCard>
  );
}
