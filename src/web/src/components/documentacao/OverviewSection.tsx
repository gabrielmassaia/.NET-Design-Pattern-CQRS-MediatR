import { Typography, Row, Col, Tag, theme } from 'antd';
import { SectionCard } from './SectionCard';
import { useAppTheme } from '@/context/ThemeContext';

const { Text, Paragraph } = Typography;

const HIGHLIGHTS = [
  { label: 'Empresas', value: '4 regimes', color: '#D4A843' },
  { label: 'Obrigações', value: '11 tipos', color: '#4A7FC1' },
  { label: 'Backend', value: '.NET 9', color: '#7B4C9A' },
  { label: 'Frontend', value: 'React 19', color: '#4A9BD9' },
  { label: 'Testes', value: '338 total', color: '#4CAF7D' },
  { label: 'Containers', value: '5 serviços', color: '#E8944A' },
];

export function OverviewSection() {
  const { appTheme } = useAppTheme();
  const { token } = theme.useToken();
  const isDark = appTheme === 'dark';

  return (
    <SectionCard
      id="overview"
      icon="📖"
      title="Visão Geral"
      subtitle="Painel de Obrigações Acessórias — e-Auditoria"
    >
      <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
        Sistema para controle centralizado de obrigações fiscais acessórias. Escritórios contábeis gerenciam dezenas
        de CNPJs com regimes tributários distintos — cada regime exige um conjunto diferente de obrigações
        (DAS, DCTF, EFD, eSocial, SPED, DIRF, RAIS), cada uma com sua própria regra de vencimento.
        Perder um prazo significa multa.
      </Paragraph>

      <Row gutter={[12, 12]}>
        {HIGHLIGHTS.map((h) => (
          <Col key={h.label} xs={12} sm={8} md={6} lg={4}>
            <div style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: 10,
              padding: '14px 12px',
              textAlign: 'center',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: h.color, fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>
                {h.value}
              </div>
              <div style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)', fontWeight: 500 }}>
                {h.label}
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 24, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['Clean Architecture', 'CQRS', 'MediatR', 'EF Core 9', 'PostgreSQL 16', 'Redis 7', 'Meilisearch', 'Docker Compose', 'Ant Design 5', 'TanStack Query'].map((t) => (
          <Tag key={t} style={{ borderRadius: 6, fontSize: 11, padding: '2px 10px', border: 'none', background: isDark ? 'rgba(212,168,67,0.12)' : 'rgba(21,101,192,0.08)', color: isDark ? '#D4A843' : '#1565C0' }}>
            {t}
          </Tag>
        ))}
      </div>
    </SectionCard>
  );
}
