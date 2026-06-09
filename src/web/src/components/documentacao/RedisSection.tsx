import { Typography, Table, Tag, theme } from 'antd';
import { SectionCard } from './SectionCard';
import { MermaidDiagram } from './MermaidDiagram';
import { useAppTheme } from '@/context/ThemeContext';

const { Text, Paragraph } = Typography;

const CACHE_FLOW = `sequenceDiagram
    participant Client as "🌐 Requisição"
    participant EP as "📡 Endpoint"
    participant Cache as "💾 CachedDashboardAppService"
    participant Inner as "📋 DashboardAppService"
    participant Redis as "⚡ Redis"
    participant DB as "🗄 PostgreSQL"

    Client->>EP: GET /api/dashboard
    EP->>Cache: GetDashboard(year, month)
    Cache->>Redis: Get("painel:dashboard:{ano}:{mes}")

    alt Cache HIT
        Redis-->>Cache: JSON cached
        Cache-->>EP: ViewModel
        EP-->>Client: 200 OK
    else Cache MISS
        Redis-->>Cache: null
        Cache->>Inner: GetDashboard(year, month)
        Inner->>DB: Query aggregated counts
        DB-->>Inner: DashboardModel
        Inner-->>Cache: DashboardModel
        Cache->>Redis: Set("painel:dashboard:{ano}:{mes}", json, TTL 30s)
        Cache-->>EP: ViewModel
        EP-->>Client: 200 OK
    end`;

const INVAL_FLOW = `sequenceDiagram
    participant Handler as "⚡ CommandHandler"
    participant UoW as "📝 IUnitOfWork"
    participant Event as "📢 INotification"
    participant EH as "🔊 EventHandler"
    participant Redis as "⚡ Redis"

    Handler->>UoW: CompleteAsync()
    UoW-->>Handler: OK
    Handler->>Event: Publish(EmpresaCreatedEvent)
    Event->>EH: Handle(EmpresaCreatedEvent)
    EH->>Redis: Remove("painel:dashboard:*")
    EH->>Redis: Remove("painel:alertas:current")`;

const CACHE_TABLE = [
  { key: 'dashboard:{year}:{month}', ttl: '30s', description: 'KPIs do dashboard (total empresas, obrigações, pendentes, etc.)', setBy: 'CachedDashboardAppService', invalidation: 'Eventos: EmpresaCreated, EmpresaDeleted, ObrigacaoEntregue' },
  { key: 'alertas:current', ttl: '60s', description: 'Alertas de obrigações vencendo em até 30 dias', setBy: 'CachedDashboardAppService', invalidation: 'Eventos: EmpresaCreated, EmpresaDeleted, ObrigacaoEntregue' },
];

const CACHE_COL = [
  { title: 'Chave (padrão)', dataIndex: 'key', key: 'key', render: (v: string) => <Text code style={{ fontSize: 11 }}>painel:{v}</Text> },
  { title: 'TTL', dataIndex: 'ttl', key: 'ttl', render: (v: string) => <Tag color="gold">{v}</Tag> },
  { title: 'Descrição', dataIndex: 'description', key: 'description' },
  { title: 'Definido por', dataIndex: 'setBy', key: 'setBy', render: (v: string) => <Text code style={{ fontSize: 10 }}>{v}</Text> },
  { title: 'Invalidação', dataIndex: 'invalidation', key: 'invalidation' },
];

export function RedisSection() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';

  return (
    <SectionCard id="redis-cache" icon="💾" title="Redis Cache" subtitle="StackExchange.Redis · Cache-aside · Invalidação por Eventos">
      <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
        O Redis é usado para cachear as queries mais pesadas do dashboard, reduzindo a carga no PostgreSQL
        e melhorando a latência. Implementa o padrão <strong>Cache-aside</strong> (lazy loading) via
        um <strong>Decorator</strong> (<Text code>CachedDashboardAppService</Text>) que envolve o
        <Text code>DashboardAppService</Text> real.
      </Paragraph>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Cache-aside Flow
        </div>
        <MermaidDiagram chart={CACHE_FLOW} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Invalidação por Eventos de Domínio
        </div>
        <MermaidDiagram chart={INVAL_FLOW} />
        <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, marginTop: 12, lineHeight: 1.7 }}>
          Quando uma empresa é criada/excluída ou uma obrigação é entregue, um <Text code>INotification</Text> é
          publicado. O EventHandler correspondente invalida as chaves de cache relevantes, garantindo que
          a próxima leitura seja fresca. O TTL serve como fallback de segurança.
        </Paragraph>
      </div>

      <div>
        <Table dataSource={CACHE_TABLE} columns={CACHE_COL} pagination={false} size="small" rowKey="key" />
      </div>
    </SectionCard>
  );
}
