import { Typography, Table, Tag, theme } from 'antd';
import { SectionCard } from './SectionCard';
import { useAppTheme } from '@/context/ThemeContext';

const { Text, Paragraph } = Typography;

const HEADER_TABLE = [
  { header: 'X-Content-Type-Options', value: 'nosniff' },
  { header: 'X-Frame-Options', value: 'DENY' },
  { header: 'X-XSS-Protection', value: '0' },
  { header: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { header: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { header: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { header: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  { header: 'Strict-Transport-Security', value: 'max-age=63072000 (Nginx HTTPS)' },
];

const HEADER_COL = [
  { title: 'Header', dataIndex: 'header', key: 'header', render: (v: string) => <Text code style={{ fontSize: 11 }}>{v}</Text> },
  { title: 'Valor', dataIndex: 'value', key: 'value', render: (v: string) => <Text code style={{ fontSize: 11 }}>{v}</Text> },
];

const OMITTED = [
  { item: 'Autenticação JWT', reason: 'Não solicitado no case. Sem valor para demonstração.', evolution: 'Microsoft.AspNetCore.Authentication.JwtBearer + [Authorize]' },
  { item: 'CSRF Protection', reason: 'Sem cookies de sessão → sem risco de CSRF.', evolution: 'AddAntiforgery() com X-CSRF-TOKEN' },
  { item: 'Secrets Management', reason: 'Configurações em docker-compose para execução imediata.', evolution: 'User Secrets (dev) / Key Vault (prod)' },
  { item: 'Multi-tenant', reason: 'Sem conceito de usuário. Dashboard único.', evolution: 'tenantId nas entidades + filtros globais' },
];

const OMIT_COL = [
  { title: 'Item', dataIndex: 'item', key: 'item', render: (v: string) => <Text strong>{v}</Text> },
  { title: 'Motivo', dataIndex: 'reason', key: 'reason' },
  { title: 'Evolução', dataIndex: 'evolution', key: 'evolution' },
];

export function SecuritySection() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';

  return (
    <SectionCard id="security" icon="🛡" title="Segurança" subtitle="Rate Limiting · Headers · DDoS Protection">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Rate Limiting
        </div>
        <Table
          dataSource={[
            { policy: 'ApiGlobal', limit: '100 req/min por IP', scope: 'Todas as rotas' },
            { policy: 'Export', limit: '5 req/min por IP', scope: 'Endpoints de exportação CSV/PDF/XLSX' },
          ]}
          columns={[
            { title: 'Política', dataIndex: 'policy', key: 'policy', render: (v: string) => <Tag color="blue">{v}</Tag> },
            { title: 'Limite', dataIndex: 'limit', key: 'limit' },
            { title: 'Escopo', dataIndex: 'scope', key: 'scope' },
          ]}
          pagination={false}
          size="small"
          rowKey="policy"
          style={{ marginBottom: 16 }}
        />
        <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, lineHeight: 1.7 }}>
          Implementado com <Text code>System.Threading.RateLimiting</Text> nativo do .NET 9.
          Retorna HTTP 429 quando excedido.
        </Paragraph>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Security Headers (API Middleware + Nginx)
        </div>
        <Table dataSource={HEADER_TABLE} columns={HEADER_COL} pagination={false} size="small" rowKey="header" />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          DDoS Protection (3 Camadas)
        </div>
        <Table
          dataSource={[
            { layer: 'Nginx', config: 'client_max_body_size 1M, limit_conn addr 10, limit_req zone=api rate=30r/s burst=20' },
            { layer: 'Kestrel', config: 'MaxRequestBodySize 1MB, MaxConcurrentConnections 100, KeepAliveTimeout 2min' },
            { layer: 'Docker', config: 'Per-container CPU/memory limits (ex: api: 1 CPU / 512MB)' },
          ]}
          columns={[
            { title: 'Camada', dataIndex: 'layer', key: 'layer', render: (v: string) => <Tag>{v}</Tag> },
            { title: 'Configuração', dataIndex: 'config', key: 'config', render: (v: string) => <Text code style={{ fontSize: 11 }}>{v}</Text> },
          ]}
          pagination={false}
          size="small"
          rowKey="layer"
        />
      </div>

      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Não Implementado (Decisão Consciente)
        </div>
        <Table dataSource={OMITTED} columns={OMIT_COL} pagination={false} size="small" rowKey="item" />
      </div>
    </SectionCard>
  );
}
