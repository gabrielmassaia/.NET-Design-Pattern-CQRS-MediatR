import { Typography, Table, Tag, theme } from 'antd';
import { SectionCard } from './SectionCard';
import { useAppTheme } from '@/context/ThemeContext';

const { Text, Paragraph } = Typography;

const ALL_ENDPOINTS = [
  { group: 'Health', method: 'GET', route: '/health', description: 'Health check', rateLimit: '—', auth: '—' },
  { group: 'Empresas', method: 'GET', route: '/api/empresas?skip=0&take=50', description: 'Listar empresas (paginado)', rateLimit: 'Global', auth: '—' },
  { group: 'Empresas', method: 'POST', route: '/api/empresas', description: 'Criar empresa + gerar obrigações', rateLimit: 'Global', auth: '—' },
  { group: 'Empresas', method: 'GET', route: '/api/empresas/search?q=', description: 'Busca textual (Meilisearch)', rateLimit: 'Global', auth: '—' },
  { group: 'Empresas', method: 'DELETE', route: '/api/empresas/{id}', description: 'Soft delete empresa', rateLimit: 'Global', auth: '—' },
  { group: 'Obrigações', method: 'GET', route: '/api/obrigacoes?empresaId&ano&mes&skip&take', description: 'Listar obrigações por mês', rateLimit: 'Global', auth: '—' },
  { group: 'Obrigações', method: 'PATCH', route: '/api/obrigacoes/{id}/entrega', description: 'Registrar entrega (rate limited)', rateLimit: 'Export', auth: '—' },
  { group: 'Obrigações', method: 'GET', route: '/api/obrigacoes/historico/{empresaId}', description: 'Histórico de entregas', rateLimit: 'Global', auth: '—' },
  { group: 'Obrigações', method: 'GET', route: '/api/obrigacoes/export?empresaId&ano&mes&formato', description: 'Exportar (CSV/PDF/XLSX)', rateLimit: 'Export', auth: '—' },
  { group: 'Dashboard', method: 'GET', route: '/api/dashboard?ano&mes', description: 'KPIs (cache 30s Redis)', rateLimit: 'Global', auth: '—' },
  { group: 'Dashboard', method: 'GET', route: '/api/dashboard/alertas', description: 'Alertas 30 dias (cache 60s)', rateLimit: 'Global', auth: '—' },
  { group: 'Dashboard', method: 'GET', route: '/api/dashboard/export?formato', description: 'Exportar dashboard', rateLimit: 'Export', auth: '—' },
  { group: 'Dashboard', method: 'GET', route: '/api/dashboard/alertas/export?formato', description: 'Exportar alertas', rateLimit: 'Export', auth: '—' },
];

const EP_COL = [
  { title: 'Grupo', dataIndex: 'group', key: 'group', render: (v: string) => <Tag>{v}</Tag> },
  { title: 'Método', dataIndex: 'method', key: 'method', render: (v: string) => {
    const c: Record<string, string> = { GET: '#4CAF7D', POST: '#4A7FC1', PATCH: '#E8944A', DELETE: '#C0392B' };
    return <span style={{ color: c[v] || '#666', fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{v}</span>;
  }},
  { title: 'Rota', dataIndex: 'route', key: 'route', render: (v: string) => <Text code style={{ fontSize: 11 }}>{v}</Text> },
  { title: 'Descrição', dataIndex: 'description', key: 'description' },
  { title: 'Rate Limit', dataIndex: 'rateLimit', key: 'rateLimit', render: (v: string) => {
    if (v === 'Export') return <Tag color="orange">{v}</Tag>;
    if (v === 'Global') return <Tag color="blue">{v}</Tag>;
    return <span style={{ color: 'rgba(255,255,255,0.3)' }}>{v}</span>;
  }},
];

const RESPONSE_EX = `{
  "success": true,
  "message": "",
  "data": { ... },
  "errorCode": null
}`;

const ERROR_TABLE = [
  { errorCode: 'null', httpStatus: '200 OK', when: 'Sucesso' },
  { errorCode: 'Validation', httpStatus: '400 Bad Request', when: 'FluentValidation falhou' },
  { errorCode: 'NotFound', httpStatus: '404 Not Found', when: 'Entidade não encontrada (KeyNotFoundException)' },
  { errorCode: 'Conflict', httpStatus: '409 Conflict', when: 'Violação de regra de negócio (InvalidOperationException)' },
  { errorCode: 'InternalError', httpStatus: '500 Internal Server Error', when: 'Erro não tratado' },
];

const ERR_COL = [
  { title: 'ErrorCode', dataIndex: 'errorCode', key: 'errorCode', render: (v: string) => <Text code>{v || 'null'}</Text> },
  { title: 'HTTP Status', dataIndex: 'httpStatus', key: 'httpStatus', render: (v: string) => <Tag>{v}</Tag> },
  { title: 'Quando', dataIndex: 'when', key: 'when' },
];

export function ApiReferenceSection() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';

  return (
    <SectionCard id="api-reference" icon="📡" title="API Reference" subtitle="Todos os Endpoints · ResponseData Envelope · Error Codes">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Endpoints
        </div>
        <Table dataSource={ALL_ENDPOINTS} columns={EP_COL} pagination={false} size="small" rowKey="route" />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Response Data Envelope
        </div>
        <div style={{
          background: isDark ? '#0F1117' : '#F5F5F5',
          borderRadius: 8,
          padding: '16px 20px',
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
          lineHeight: 1.8,
          color: isDark ? '#E8EAF0' : '#1A1A2E',
          marginBottom: 16,
        }}>
          {RESPONSE_EX}
        </div>
        <Table dataSource={ERROR_TABLE} columns={ERR_COL} pagination={false} size="small" rowKey="errorCode" />
      </div>

      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Rate Limiting
        </div>
        <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, lineHeight: 1.7 }}>
          <Tag color="blue">Global</Tag> 100 requisições/minuto por IP — aplicado a todas as rotas.
          <Tag color="orange">Export</Tag> 5 requisições/minuto por IP — endpoints de exportação (CSV/PDF/XLSX) e registro de entrega.
          Retorna HTTP 429 quando excedido.
        </Paragraph>
      </div>
    </SectionCard>
  );
}
